"""
Centralized Configuration for Backend Directory & Artifact Paths

Uses pathlib.Path relative to project root so the backend operates seamlessly
across different OS platforms and team members' environments without hardcoded absolute paths.
"""

from pathlib import Path

# Compute repository root dynamically (app/backend/config.py -> parent x3 = repo root)
CURRENT_FILE_PATH = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE_PATH.parent
APP_DIR = BACKEND_DIR.parent
PROJECT_ROOT = APP_DIR.parent

# Centralized artifact paths
MODEL_PATH = PROJECT_ROOT / "models" / "final" / "final_model.pkl"
METADATA_PATH = PROJECT_ROOT / "models" / "final" / "final_model_meta.json"
PREPROCESSING_PIPELINE_PATH = PROJECT_ROOT / "models" / "preprocessing_pipeline.pkl"
