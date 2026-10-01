"""
Reusable Model & Artifact Loader Module

Safely loads:
1. Final trained model (.pkl)
2. Fitted preprocessing pipeline (.pkl)
3. Final model metadata (.json)

Handles custom sklearn transformers and missing file exceptions gracefully.
"""

import json
import logging
from typing import Dict, Any, Tuple
import joblib

from app.backend.config import MODEL_PATH, METADATA_PATH, PREPROCESSING_PIPELINE_PATH
from app.backend.transformers import register_custom_transformers

# Configure basic logger
logger = logging.getLogger("routeright.model_loader")
logging.basicConfig(level=logging.INFO)

# Ensure canonical custom transformers are registered in __main__ for unpickling
register_custom_transformers()


class ArtifactLoader:
    """
    Singleton-style loader managing artifact loading and verification.
    """
    def __init__(self):
        self.model = None
        self.pipeline = None
        self.metadata = None
        self._is_loaded = False

    def load_artifacts(self) -> Tuple[Any, Any, Dict[str, Any]]:
        """
        Loads model, preprocessing pipeline, and metadata from disk.
        
        Raises:
            FileNotFoundError: If any artifact file does not exist.
            RuntimeError: If deserialization fails.
        """
        # 1. Verify file existence
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        if not PREPROCESSING_PIPELINE_PATH.exists():
            raise FileNotFoundError(f"Preprocessing pipeline file not found at: {PREPROCESSING_PIPELINE_PATH}")
        if not METADATA_PATH.exists():
            raise FileNotFoundError(f"Metadata file not found at: {METADATA_PATH}")

        try:
            # 2. Load model metadata JSON
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            logger.info("Successfully loaded model metadata JSON.")

            # 3. Load trained model pkl
            self.model = joblib.load(MODEL_PATH)
            logger.info("Successfully loaded final model pickle.")

            # 4. Load preprocessing pipeline pkl
            self.pipeline = joblib.load(PREPROCESSING_PIPELINE_PATH)
            logger.info("Successfully loaded preprocessing pipeline pickle.")

            self._is_loaded = True
            return self.model, self.pipeline, self.metadata

        except Exception as err:
            logger.error(f"Error loading artifacts: {err}")
            raise RuntimeError(f"Failed to load RouteRight AI model artifacts: {str(err)}") from err

    def check_artifacts_status(self) -> Dict[str, Any]:
        """
        Checks artifact file existence and load status for health checks.
        """
        return {
            "model_file_exists": MODEL_PATH.exists(),
            "pipeline_file_exists": PREPROCESSING_PIPELINE_PATH.exists(),
            "metadata_file_exists": METADATA_PATH.exists(),
            "model_path": str(MODEL_PATH),
            "pipeline_path": str(PREPROCESSING_PIPELINE_PATH),
            "metadata_path": str(METADATA_PATH),
            "is_loaded": self._is_loaded
        }


# Global loader instance
artifact_loader = ArtifactLoader()
