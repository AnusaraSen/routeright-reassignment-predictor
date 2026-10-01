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

from app.backend.schemas import HealthCheckResponse
from app.backend.model_loader import artifact_loader

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

    # Determine overall service status
    is_healthy = (
        artifact_status["model_file_exists"]
        and artifact_status["pipeline_file_exists"]
        and artifact_status["metadata_file_exists"]
    )

    return HealthCheckResponse(
        status="healthy" if is_healthy else "degraded",
        service="RouteRight AI - Backend API",
        artifacts_loaded=artifact_status["is_loaded"],
        details=artifact_status
    )
