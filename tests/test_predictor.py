"""Automated test suite for the RouteRight standalone prediction service.

Tests cover:
- Preprocessor and model artifact loading
- 11-field raw input -> 14-field feature engineering
- Temporal and ordinal feature extraction
- Preprocessing pipeline transformation & dimension integrity (109 features)
- Real model inference contract (probability, binary prediction, risk label, threshold)
- Missing optional inputs handling
- Unseen categorical values handling
- Intentional validation errors on invalid inputs
"""

import pytest
import numpy as np
import pandas as pd

from app.backend.services.predictor import (
    ReassignmentPredictor,
    get_predictor,
    PREPROCESSING_INPUT_COLUMNS,
    RAW_INPUT_FIELDS,
    IMPACT_MAPPING,
    URGENCY_MAPPING,
    PRIORITY_MAPPING,
    EXPECTED_FEATURE_COUNT,
)


@pytest.fixture(scope="module")
def predictor() -> ReassignmentPredictor:
    """Fixture providing an initialized ReassignmentPredictor instance."""
    return get_predictor()


@pytest.fixture
def valid_raw_sample() -> dict:
    """Fixture providing a standard valid 11-field raw ticket input."""
    return {
        "opened_at": "29/2/2016 01:16",
        "opened_by": "Opened by  8",
        "contact_type": "Phone",
        "location": "Location 143",
        "category": "Category 55",
        "subcategory": "Subcategory 170",
        "u_symptom": "Symptom 72",
        "assignment_group": "Group 56",
        "impact": "2 - Medium",
        "urgency": "2 - Medium",
        "priority": "3 - Moderate",
    }


# =============================================================================
# 1. Artifact Loading Tests
# =============================================================================

def test_artifact_loading(predictor: ReassignmentPredictor):
    """Verify that the predictor loads all artifacts without error."""
    assert predictor.is_loaded is True
    assert predictor.pipeline is not None
    assert predictor.model is not None
    assert predictor.meta is not None
    assert len(predictor.meta) > 0
    assert predictor.threshold == 0.5
    assert 1 in predictor.model.classes_


# =============================================================================
# 2. Feature Engineering & Structure Tests
# =============================================================================

def test_feature_engineering_structure_and_shape(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that 11 raw inputs produce a 1-row, 14-column DataFrame in exact expected order."""
    df_14 = predictor.engineer_features(valid_raw_sample)
    assert isinstance(df_14, pd.DataFrame)
    assert df_14.shape == (1, 14)
    assert df_14.columns.tolist() == PREPROCESSING_INPUT_COLUMNS


def test_datetime_feature_engineering_known_values(predictor: ReassignmentPredictor):
    """Verify deterministic datetime extraction for a known timestamp."""
    sample = {
        "opened_at": "2016-02-29 01:16:00",
        "opened_by": "Opened by  8",
        "contact_type": "Phone",
        "location": "Location 143",
        "category": "Category 55",
        "subcategory": "Subcategory 170",
        "u_symptom": "Symptom 72",
        "assignment_group": "Group 56",
        "impact": "2 - Medium",
        "urgency": "2 - Medium",
        "priority": "3 - Moderate",
    }
    df_14 = predictor.engineer_features(sample)
    row = df_14.iloc[0]

    assert row["opened_hour"] == 1
    assert row["opened_day_of_week"] == 0  # Monday
    assert row["opened_month"] == 2        # February
    assert row["opened_is_weekend"] == 0   # Weekday


def test_weekend_feature_detection(predictor: ReassignmentPredictor, valid_raw_sample: dict):
    """Verify opened_is_weekend correctly differentiates weekdays and weekend dates."""
    # Friday -> Weekday (0)
    weekday_sample = dict(valid_raw_sample, opened_at="2016-04-15 14:30:00")
    df_weekday = predictor.engineer_features(weekday_sample)
    assert df_weekday.iloc[0]["opened_day_of_week"] == 4  # Friday
    assert df_weekday.iloc[0]["opened_is_weekend"] == 0

    # Saturday -> Weekend (1)
    saturday_sample = dict(valid_raw_sample, opened_at="2016-04-16 10:00:00")
    df_saturday = predictor.engineer_features(saturday_sample)
    assert df_saturday.iloc[0]["opened_day_of_week"] == 5  # Saturday
    assert df_saturday.iloc[0]["opened_is_weekend"] == 1

    # Sunday -> Weekend (1)
    sunday_sample = dict(valid_raw_sample, opened_at="2016-04-17 12:00:00")
    df_sunday = predictor.engineer_features(sunday_sample)
    assert df_sunday.iloc[0]["opened_day_of_week"] == 6  # Sunday
    assert df_sunday.iloc[0]["opened_is_weekend"] == 1


# =============================================================================
# 3. Ordinal Mapping Tests
# =============================================================================

def test_ordinal_mappings(predictor: ReassignmentPredictor, valid_raw_sample: dict):
    """Verify all valid ordinal values map to their exact integer scores."""
    # Test all impact levels
    for impact_str, expected_num in IMPACT_MAPPING.items():
        sample = dict(valid_raw_sample, impact=impact_str)
        df = predictor.engineer_features(sample)
        assert df.iloc[0]["impact_encoded"] == expected_num

    # Test all urgency levels
    for urgency_str, expected_num in URGENCY_MAPPING.items():
        sample = dict(valid_raw_sample, urgency=urgency_str)
        df = predictor.engineer_features(sample)
        assert df.iloc[0]["urgency_encoded"] == expected_num

    # Test all priority levels
    for priority_str, expected_num in PRIORITY_MAPPING.items():
        sample = dict(valid_raw_sample, priority=priority_str)
        df = predictor.engineer_features(sample)
        assert df.iloc[0]["priority_encoded"] == expected_num


# =============================================================================
# 4. Preprocessing Integrity & Feature Compatibility Tests
# =============================================================================

def test_preprocessing_integrity(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that preprocessing pipeline produces exactly 109 features matching metadata."""
    df_14 = predictor.engineer_features(valid_raw_sample)
    X_transformed = predictor.pipeline.transform(df_14)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()

    assert X_transformed.shape == (1, EXPECTED_FEATURE_COUNT)
    pipeline_feature_names = list(predictor.pipeline.get_feature_names_out())
    assert len(pipeline_feature_names) == EXPECTED_FEATURE_COUNT
    assert pipeline_feature_names == predictor.meta["feature_columns"]


def test_model_pipeline_feature_compatibility(predictor: ReassignmentPredictor):
    """Confirm exact alignment across pipeline, metadata, and final model feature counts."""
    pipeline_n = len(predictor.pipeline.get_feature_names_out())
    meta_n = predictor.meta["n_features"]
    model_n = predictor.model.n_features_in_

    assert pipeline_n == EXPECTED_FEATURE_COUNT
    assert meta_n == EXPECTED_FEATURE_COUNT
    assert model_n == EXPECTED_FEATURE_COUNT


# =============================================================================
# 5. Real Prediction Contract Tests
# =============================================================================

def test_real_prediction_contract(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that predict() returns a valid Python dictionary adhering to the response contract."""
    result = predictor.predict(valid_raw_sample)

    assert isinstance(result, dict)
    assert "prediction" in result
    assert "probability" in result
    assert "label" in result
    assert "risk_level" in result
    assert "decision_threshold" in result
    assert "model_name" in result
    assert "status" in result
    assert "inference_time_ms" in result

    assert result["prediction"] in (0, 1)
    assert isinstance(result["probability"], float)
    assert 0.0 <= result["probability"] <= 1.0
    assert result["label"] in ("Reassignment Required", "No Reassignment Required")
    assert result["risk_level"] in ("low", "medium", "high")
    assert result["decision_threshold"] == predictor.threshold
    assert result["model_name"] == "Random Forest"
    assert result["status"] == "success"
    assert isinstance(result["inference_time_ms"], float)
    assert result["inference_time_ms"] >= 0

    # Verify label and risk-level consistency with prediction
    if result["prediction"] == 1:
        assert result["label"] == "Reassignment Required"
        assert result["risk_level"] == "high"
        assert result["probability"] >= result["decision_threshold"]
    else:
        assert result["label"] == "No Reassignment Required"
        assert result["risk_level"] == "low"
        assert result["probability"] < result["decision_threshold"]


# =============================================================================
# 6. Missing Optional Categorical Fields Tests
# =============================================================================

def test_missing_optional_categorical_fields(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that None values in optional nominal columns are handled smoothly by SimpleImputer."""
    null_sample = {
        "opened_at": "2016-04-15 10:00:00",
        "opened_by": None,
        "contact_type": "Phone",
        "location": None,
        "category": None,
        "subcategory": None,
        "u_symptom": None,
        "assignment_group": None,
        "impact": "1 - High",
        "urgency": "1 - High",
        "priority": "1 - Critical",
    }
    result = predictor.predict(null_sample)

    assert result["prediction"] in (0, 1)
    assert 0.0 <= result["probability"] <= 1.0
    assert result["risk_level"] in ("low", "medium", "high")


# =============================================================================
# 7. Unseen Categorical Values Tests
# =============================================================================

def test_unseen_categorical_values(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that unseen/rare categories are safely mapped to 'Other' without crashing."""
    unseen_sample = {
        "opened_at": "2016-04-15 10:00:00",
        "opened_by": "Opened by 99999",
        "contact_type": "Carrier Pigeon",
        "location": "Location 88888",
        "category": "Category 77777",
        "subcategory": "Subcategory 66666",
        "u_symptom": "Symptom 55555",
        "assignment_group": "Group 44444",
        "impact": "3 - Low",
        "urgency": "3 - Low",
        "priority": "4 - Low",
    }
    result = predictor.predict(unseen_sample)

    assert result["prediction"] in (0, 1)
    assert 0.0 <= result["probability"] <= 1.0
    assert result["risk_level"] in ("low", "medium", "high")


# =============================================================================
# 8. Invalid Datetime Handling Tests
# =============================================================================

def test_invalid_datetime_none_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that None for opened_at raises ValueError."""
    bad_sample = dict(valid_raw_sample, opened_at=None)
    with pytest.raises(ValueError, match="opened_at is required"):
        predictor.predict(bad_sample)


def test_invalid_datetime_empty_string_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that empty string for opened_at raises ValueError."""
    bad_sample = dict(valid_raw_sample, opened_at="   ")
    with pytest.raises(ValueError, match="opened_at is required"):
        predictor.predict(bad_sample)


def test_invalid_datetime_unparseable_string_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that non-date string for opened_at raises ValueError."""
    bad_sample = dict(valid_raw_sample, opened_at="not-a-date")
    with pytest.raises(ValueError, match="Invalid or unparseable opened_at"):
        predictor.predict(bad_sample)


# =============================================================================
# 9. Invalid Ordinal Values Handling Tests
# =============================================================================

def test_invalid_impact_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that invalid impact value raises ValueError."""
    bad_sample = dict(valid_raw_sample, impact="Invalid Impact")
    with pytest.raises(ValueError, match="Invalid impact value"):
        predictor.predict(bad_sample)


def test_invalid_urgency_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that invalid urgency value raises ValueError."""
    bad_sample = dict(valid_raw_sample, urgency="5 - Ultra")
    with pytest.raises(ValueError, match="Invalid urgency value"):
        predictor.predict(bad_sample)


def test_invalid_priority_raises_value_error(
    predictor: ReassignmentPredictor, valid_raw_sample: dict
):
    """Verify that invalid priority value raises ValueError."""
    bad_sample = dict(valid_raw_sample, priority="P1")
    with pytest.raises(ValueError, match="Invalid priority value"):
        predictor.predict(bad_sample)
