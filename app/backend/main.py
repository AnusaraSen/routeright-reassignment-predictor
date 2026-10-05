"""
RouteRight AI - FastAPI Backend Foundation Service

Endpoints implemented:
- GET / : Root welcome endpoint
- GET /health : Backend status and artifact availability check
"""

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.backend.schemas import (
    HealthCheckResponse,
    IncidentPredictionRequest,
    IncidentPredictionResponse,
)
from app.backend.model_loader import artifact_loader
from app.backend.services.predictor import get_predictor

# Configure logger
logger = logging.getLogger("routeright.backend")
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler to load model artifacts when server starts.
    """
    logger.info("Initializing RouteRight AI backend service...")
    try:
        artifact_loader.load_artifacts()
        # Initialize predictor singleton with loaded artifacts
        get_predictor()
        logger.info("All model artifacts loaded successfully during startup.")
    except Exception as err:
        logger.warning(
            f"Backend started with artifact loading warning: {err}. "
            "Model artifacts can still be verified via /health endpoint."
        )
    yield
    logger.info("Shutting down RouteRight AI backend service...")


# Instantiate FastAPI application
app = FastAPI(
    title="RouteRight AI - Incident Reassignment Predictor API",
    description=(
        "Backend service for predicting IT support ticket reassignment risks "
        "using a trained Random Forest model and preprocessing pipeline."
    ),
    version="0.1.0",
    lifespan=lifespan
)

# Enable CORS for local development and future frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint returning service identity.
    """
    return {
        "service": "RouteRight AI - Incident Reassignment Predictor Backend",
        "status": "online",
        "docs_url": "/docs"
    }


@app.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    tags=["Health Check"],
    summary="Check Backend Health & Model Artifact Status"
)
async def health_check():
    """
    Returns the health status of the backend application and checks
    if the model, preprocessing pipeline, and metadata files exist and are loaded.
    """
    artifact_status = artifact_loader.check_artifacts_status()

    # Determine overall service status: healthy only if all artifact files exist AND are loaded
    is_healthy = (
        artifact_status["model_file_exists"]
        and artifact_status["pipeline_file_exists"]
        and artifact_status["metadata_file_exists"]
        and artifact_status["is_loaded"]
    )

    return HealthCheckResponse(
        status="healthy" if is_healthy else "degraded",
        service="RouteRight AI - Backend API",
        artifacts_loaded=artifact_status["is_loaded"],
        details=artifact_status
    )


@app.post(
    "/predict",
    response_model=IncidentPredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"],
    summary="Predict Incident Ticket Reassignment Risk"
)
async def predict_incident(payload: IncidentPredictionRequest):
    """
    Predicts whether an IT support incident ticket is likely to require reassignment later
    in its lifecycle, based on attributes available at ticket creation time.
    """
    try:
        predictor = get_predictor()
        raw_dict = payload.model_dump()
        result = predictor.predict(raw_dict)

        return IncidentPredictionResponse(
            prediction=result["prediction"],
            label=result["label"],
            probability=result["probability"],
            risk_level=result["risk_level"],
            decision_threshold=result["decision_threshold"],
            model_name=result["model_name"],
            status=result["status"],
            inference_time_ms=result["inference_time_ms"],
        )
    except ValueError as val_err:
        logger.warning(f"Validation error during prediction: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request data: {str(val_err)}"
        ) from val_err
    except RuntimeError as run_err:
        logger.error(f"Internal runtime error during prediction: {run_err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while processing the prediction."
        ) from run_err
    except Exception as err:
        logger.error(f"Unexpected error during prediction: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while processing the prediction."
        ) from err
