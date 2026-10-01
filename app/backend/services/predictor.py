"""Standalone prediction service for RouteRight AI ticket reassignment risk.

This module implements the complete inference flow from 11 raw ticket input
fields to the final binary risk prediction, strictly matching the transformations
and artifact configurations established during model training.
"""

import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import joblib
import numpy as np
import pandas as pd

# Import transformers module to ensure CategoryLabelCleaner and RareCategoryGrouper
# are registered into __main__ for unpickling compatibility
import app.backend.transformers


# Ordinal severity mappings (exact mappings from 03_Preprocessing_FeatureEngineering.ipynb)
IMPACT_MAPPING = {
    "3 - Low": 1,
    "2 - Medium": 2,
    "1 - High": 3,
}

URGENCY_MAPPING = {
    "3 - Low": 1,
    "2 - Medium": 2,
    "1 - High": 3,
}

PRIORITY_MAPPING = {
    "4 - Low": 1,
    "3 - Moderate": 2,
    "2 - High": 3,
    "1 - Critical": 4,
}

# The 14 exact columns expected by the saved preprocessing pipeline
PREPROCESSING_INPUT_COLUMNS: List[str] = [
    "opened_by",
    "contact_type",
    "location",
    "category",
    "subcategory",
    "u_symptom",
    "assignment_group",
    "opened_hour",
    "opened_day_of_week",
    "opened_month",
    "opened_is_weekend",
    "impact_encoded",
    "urgency_encoded",
    "priority_encoded",
]

# The 11 raw fields available at incident creation
RAW_INPUT_FIELDS: List[str] = [
    "opened_at",
    "opened_by",
    "contact_type",
    "location",
    "category",
    "subcategory",
    "u_symptom",
    "assignment_group",
    "impact",
    "urgency",
    "priority",
]

EXPECTED_FEATURE_COUNT = 109


def _find_project_root() -> Path:
    """Find the root directory of the repository."""
    current = Path(__file__).resolve()
    for parent in [current] + list(current.parents):
        if (parent / "models" / "preprocessing_pipeline.pkl").exists():
            return parent
    return Path.cwd()


class ReassignmentPredictor:
    """Core prediction service managing feature engineering, preprocessing, and model inference."""

    def __init__(
        self,
        pipeline_path: Optional[Union[str, Path]] = None,
        model_path: Optional[Union[str, Path]] = None,
        meta_path: Optional[Union[str, Path]] = None,
        auto_load: bool = True,
    ):
        project_root = _find_project_root()
        self.pipeline_path = Path(pipeline_path or (project_root / "models" / "preprocessing_pipeline.pkl"))
        self.model_path = Path(model_path or (project_root / "models" / "final" / "final_model.pkl"))
        self.meta_path = Path(meta_path or (project_root / "models" / "final" / "final_model_meta.json"))

        self.pipeline: Any = None
        self.model: Any = None
        self.meta: Dict[str, Any] = {}
        self.threshold: float = 0.5
        self.class_1_idx: int = 1
        self.is_loaded: bool = False

        if auto_load:
            self.load_artifacts()

    def load_artifacts(self) -> None:
        """Load and validate the preprocessing pipeline, final model, and metadata JSON."""
        # 1. Load metadata JSON
        if not self.meta_path.exists():
            raise FileNotFoundError(f"Model metadata file not found at: {self.meta_path}")
        try:
            with open(self.meta_path, "r", encoding="utf-8") as f:
                self.meta = json.load(f)
        except Exception as e:
            raise RuntimeError(f"Failed to read model metadata JSON: {e}") from e

        # Extract threshold and expected columns from metadata
        self.threshold = float(self.meta.get("decision_threshold", 0.5))
        expected_meta_columns = self.meta.get("feature_columns", [])
        expected_n_features = int(self.meta.get("n_features", EXPECTED_FEATURE_COUNT))

        # 2. Load preprocessing pipeline
        if not self.pipeline_path.exists():
            raise FileNotFoundError(f"Preprocessing pipeline file not found at: {self.pipeline_path}")
        try:
            self.pipeline = joblib.load(self.pipeline_path)
        except Exception as e:
            raise RuntimeError(
                f"Failed to load preprocessing pipeline from {self.pipeline_path}. "
                f"Ensure custom transformers are registered: {e}"
            ) from e

        # Validate pipeline feature names and count
        if not hasattr(self.pipeline, "get_feature_names_out"):
            raise RuntimeError("Loaded pipeline does not implement get_feature_names_out().")

        pipeline_feature_names = list(self.pipeline.get_feature_names_out())
        if len(pipeline_feature_names) != expected_n_features:
            raise ValueError(
                f"Pipeline output feature count ({len(pipeline_feature_names)}) does not match "
                f"expected count ({expected_n_features})."
            )

        if expected_meta_columns and pipeline_feature_names != expected_meta_columns:
            raise ValueError(
                "Feature column names/order from preprocessing pipeline do not match metadata JSON feature_columns."
            )

        # 3. Load final model
        if not self.model_path.exists():
            raise FileNotFoundError(f"Final model file not found at: {self.model_path}")
        try:
            self.model = joblib.load(self.model_path)
        except Exception as e:
            raise RuntimeError(f"Failed to load final model from {self.model_path}: {e}") from e

        # Validate model input features
        model_n_features = getattr(self.model, "n_features_in_", None)
        if model_n_features is not None and model_n_features != expected_n_features:
            raise ValueError(
                f"Model expects {model_n_features} input features, but pipeline produces {expected_n_features}."
            )

        # Validate model classes
        model_classes = getattr(self.model, "classes_", None)
        if model_classes is None or 1 not in model_classes:
            raise ValueError(f"Model classes_ does not contain positive class 1: {model_classes}")

        # Find the safe index for positive class (1)
        classes_list = list(model_classes)
        self.class_1_idx = classes_list.index(1)

        self.is_loaded = True

    def _parse_opened_at(self, val: Any) -> pd.Timestamp:
        """Parse raw opened_at input into a valid pandas Timestamp.

        Supports ISO 8601 strings, DD/MM/YYYY timestamps, datetime objects, and Timestamps.
        """
        if val is None:
            raise ValueError("opened_at is required and cannot be None.")

        if isinstance(val, str):
            val_clean = val.strip()
            if not val_clean:
                raise ValueError("opened_at is required and cannot be an empty string.")
            try:
                # ISO formats (YYYY-MM-DD...) should not use dayfirst=True
                if "-" in val_clean and val_clean[:4].isdigit():
                    dt = pd.to_datetime(val_clean)
                else:
                    dt = pd.to_datetime(val_clean, dayfirst=True)
            except Exception as e:
                raise ValueError(f"Invalid or unparseable opened_at datetime string: {val!r}") from e
        elif isinstance(val, (pd.Timestamp, np.datetime64)):
            dt = pd.to_datetime(val)
        else:
            try:
                dt = pd.to_datetime(val)
            except Exception as e:
                raise ValueError(f"Invalid opened_at datetime value: {val!r}") from e

        if pd.isna(dt):
            raise ValueError(f"Invalid opened_at value evaluated to NaT: {val!r}")

        return dt

    def engineer_features(self, raw_input: Union[Dict[str, Any], pd.DataFrame]) -> pd.DataFrame:
        """Transform the 11 raw ticket input fields into the 14 columns required by the pipeline."""
        if isinstance(raw_input, pd.DataFrame):
            if len(raw_input) == 0:
                raise ValueError("Input DataFrame is empty.")
            raw_dict = raw_input.iloc[0].to_dict()
        elif isinstance(raw_input, dict):
            raw_dict = raw_input
        else:
            raise TypeError(f"Expected dict or DataFrame, got {type(raw_input).__name__}")

        # 1. Datetime feature engineering from opened_at
        opened_at_val = raw_dict.get("opened_at")
        dt = self._parse_opened_at(opened_at_val)

        opened_hour = int(dt.hour)
        opened_day_of_week = int(dt.dayofweek)
        opened_month = int(dt.month)
        opened_is_weekend = int(opened_day_of_week >= 5)

        # 2. Ordinal feature encoding with strict validation
        impact_val = raw_dict.get("impact")
        if impact_val not in IMPACT_MAPPING:
            raise ValueError(
                f"Invalid impact value: {impact_val!r}. Allowed values are: {list(IMPACT_MAPPING.keys())}"
            )
        impact_encoded = IMPACT_MAPPING[impact_val]

        urgency_val = raw_dict.get("urgency")
        if urgency_val not in URGENCY_MAPPING:
            raise ValueError(
                f"Invalid urgency value: {urgency_val!r}. Allowed values are: {list(URGENCY_MAPPING.keys())}"
            )
        urgency_encoded = URGENCY_MAPPING[urgency_val]

        priority_val = raw_dict.get("priority")
        if priority_val not in PRIORITY_MAPPING:
            raise ValueError(
                f"Invalid priority value: {priority_val!r}. Allowed values are: {list(PRIORITY_MAPPING.keys())}"
            )
        priority_encoded = PRIORITY_MAPPING[priority_val]

        # 3. Nominal categorical features (missing/None preserved for pipeline SimpleImputer)
        def _clean_nominal(val: Any) -> Any:
            if val is None or pd.isna(val):
                return np.nan
            if isinstance(val, str):
                s = val.strip()
                return s if s else np.nan
            return val

        engineered_data: Dict[str, Any] = {
            "opened_by": _clean_nominal(raw_dict.get("opened_by")),
            "contact_type": _clean_nominal(raw_dict.get("contact_type")),
            "location": _clean_nominal(raw_dict.get("location")),
            "category": _clean_nominal(raw_dict.get("category")),
            "subcategory": _clean_nominal(raw_dict.get("subcategory")),
            "u_symptom": _clean_nominal(raw_dict.get("u_symptom")),
            "assignment_group": _clean_nominal(raw_dict.get("assignment_group")),
            "opened_hour": opened_hour,
            "opened_day_of_week": opened_day_of_week,
            "opened_month": opened_month,
            "opened_is_weekend": opened_is_weekend,
            "impact_encoded": impact_encoded,
            "urgency_encoded": urgency_encoded,
            "priority_encoded": priority_encoded,
        }

        # Construct DataFrame in exact expected column order
        df_14 = pd.DataFrame([engineered_data], columns=PREPROCESSING_INPUT_COLUMNS)
        nominal_cols = ["opened_by", "contact_type", "location", "category", "subcategory", "u_symptom", "assignment_group"]
        for col in nominal_cols:
            df_14[col] = df_14[col].astype(object)
        return df_14

    def predict(self, raw_input: Union[Dict[str, Any], pd.DataFrame]) -> Dict[str, Any]:
        """Perform end-to-end prediction from raw ticket inputs.

        Returns:
            Dict containing:
                - prediction (int): 0 (No Reassignment) or 1 (Reassignment Required)
                - probability (float): Model confidence for positive class [0.0, 1.0]
                - risk_label (str): "Low Risk" or "High Risk"
                - threshold (float): Decision threshold used (from metadata)
        """
        if not self.is_loaded:
            self.load_artifacts()

        # Step 1 & 2: Validate raw inputs & engineer the 14 features
        df_14 = self.engineer_features(raw_input)

        # Step 3: Transform through saved preprocessing pipeline
        try:
            X_transformed = self.pipeline.transform(df_14)
        except Exception as e:
            raise RuntimeError(f"Preprocessing pipeline transform failed: {e}") from e

        # Step 4: Verify transformed shape (1, 109)
        if hasattr(X_transformed, "toarray"):
            X_transformed = X_transformed.toarray()
        X_array = np.asarray(X_transformed)

        if X_array.shape[1] != EXPECTED_FEATURE_COUNT:
            raise RuntimeError(
                f"Transformed feature shape {X_array.shape} does not match expected {EXPECTED_FEATURE_COUNT} columns."
            )

        # Step 5: Model inference
        try:
            feature_names = self.pipeline.get_feature_names_out()
            X_df = pd.DataFrame(X_array, columns=feature_names)
            probs = self.model.predict_proba(X_df)
        except Exception as e:
            raise RuntimeError(f"Model prediction failed: {e}") from e

        # Step 6: Extract positive-class probability
        pos_prob = float(probs[0, self.class_1_idx])

        # Step 7: Apply decision threshold
        prediction = 1 if pos_prob >= self.threshold else 0
        risk_label = "High Risk" if prediction == 1 else "Low Risk"

        return {
            "prediction": prediction,
            "probability": round(pos_prob, 4),
            "risk_label": risk_label,
            "threshold": self.threshold,
        }


# Singleton instance for simple backend reuse
_DEFAULT_PREDICTOR: Optional[ReassignmentPredictor] = None


def get_predictor() -> ReassignmentPredictor:
    """Get or create the singleton ReassignmentPredictor instance."""
    global _DEFAULT_PREDICTOR
    if _DEFAULT_PREDICTOR is None:
        _DEFAULT_PREDICTOR = ReassignmentPredictor()
    return _DEFAULT_PREDICTOR
