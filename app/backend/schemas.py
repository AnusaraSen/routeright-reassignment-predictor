"""
Pydantic Schemas for Prediction API Input and Output Data Contracts
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class IncidentPredictionRequest(BaseModel):
    """
    Input schema representing raw incident ticket attributes available at creation time.
    """
    opened_by: Optional[str] = Field(
        default=None,
        description="Identifier of user opening the ticket (e.g. 'Opened by 8' or '8')"
    )
    contact_type: Optional[str] = Field(
        default="Phone",
        description="Channel through which the ticket was submitted (e.g. 'Phone', 'Email')"
    )
    location: Optional[str] = Field(
        default=None,
        description="Location identifier (e.g. 'Location 143' or '143')"
    )
    category: Optional[str] = Field(
        default=None,
        description="Category classification (e.g. 'Category 26' or '26')"
    )
    subcategory: Optional[str] = Field(
        default=None,
        description="Subcategory classification (e.g. 'Subcategory 175' or '175')"
    )
    u_symptom: Optional[str] = Field(
        default=None,
        description="Symptom classification (e.g. 'Symptom 491' or '491')"
    )
    assignment_group: Optional[str] = Field(
        default=None,
        description="Initial assignment group (e.g. 'Group 70' or '70')"
    )
    opened_at: Optional[str] = Field(
        default=None,
        description="Timestamp when ticket was created (ISO string or 'DD/MM/YYYY HH:MM')"
    )
    impact: Optional[int] = Field(
        default=2,
        ge=1,
        le=3,
        description="Impact level (1=High, 2=Medium, 3=Low)"
    )
    urgency: Optional[int] = Field(
        default=2,
        ge=1,
        le=3,
        description="Urgency level (1=High, 2=Medium, 3=Low)"
    )
    priority: Optional[int] = Field(
        default=3,
        ge=1,
        le=4,
        description="Priority level (1=Critical, 2=High, 3=Moderate, 4=Low)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "opened_by": "Opened by 180",
                "contact_type": "Phone",
                "location": "Location 108",
                "category": "Category 26",
                "subcategory": "Subcategory 175",
                "u_symptom": "Symptom 491",
                "assignment_group": "Group 70",
                "opened_at": "2016-03-01 09:30:00",
                "impact": 2,
                "urgency": 2,
                "priority": 3
            }
        }


class IncidentPredictionResponse(BaseModel):
    """
    Output schema for future prediction endpoint.
    """
    reassignment_required: int = Field(
        description="Binary prediction: 1 = Reassignment Required, 0 = No Reassignment"
    )
    reassignment_probability: float = Field(
        description="Predicted probability score for reassignment requirement (0.0 to 1.0)"
    )
    decision_threshold: float = Field(
        default=0.5,
        description="Classification decision threshold used by the Random Forest model"
    )
    model_name: str = Field(
        default="Random Forest",
        description="Name of final model used for prediction"
    )
    status: str = Field(
        default="success",
        description="Execution status of prediction request"
    )


class HealthCheckResponse(BaseModel):
    """
    Response schema for GET /health endpoint.
    """
    status: str = Field(example="healthy")
    service: str = Field(example="RouteRight AI - Backend API")
    artifacts_loaded: bool = Field(description="Indicates if model artifacts are accessible")
    details: Dict[str, Any] = Field(description="Details on loaded model file existence")
