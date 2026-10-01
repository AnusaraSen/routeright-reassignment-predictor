"""
Pydantic Schemas for Prediction API Input and Output Data Contracts
"""

from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict

# Canonical ordinal value types matching the machine learning model
ImpactLevel = Literal["1 - High", "2 - Medium", "3 - Low"]
UrgencyLevel = Literal["1 - High", "2 - Medium", "3 - Low"]
PriorityLevel = Literal["1 - Critical", "2 - High", "3 - Moderate", "4 - Low"]


class IncidentPredictionRequest(BaseModel):
    """
    Input schema representing raw incident ticket attributes available at creation time.
    """
    opened_at: str = Field(
        ...,
        description="Timestamp when ticket was created (e.g. '2016-03-01 09:30:00' or '29/2/2016 01:16')"
    )
    contact_type: str = Field(
        ...,
        description="Channel through which the ticket was submitted (e.g. 'Phone', 'Email', 'Self service')"
    )
    impact: ImpactLevel = Field(
        ...,
        description="Categorical impact level ('1 - High', '2 - Medium', '3 - Low')"
    )
    urgency: UrgencyLevel = Field(
        ...,
        description="Categorical urgency level ('1 - High', '2 - Medium', '3 - Low')"
    )
    priority: PriorityLevel = Field(
        ...,
        description="Categorical priority level ('1 - Critical', '2 - High', '3 - Moderate', '4 - Low')"
    )
    opened_by: Optional[str] = Field(
        default=None,
        description="Identifier of user opening the ticket (e.g. 'Opened by 8' or '8')"
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

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "opened_at": "2016-03-01 09:30:00",
                "opened_by": "Opened by 180",
                "contact_type": "Phone",
                "location": "Location 108",
                "category": "Category 26",
                "subcategory": "Subcategory 175",
                "u_symptom": "Symptom 491",
                "assignment_group": "Group 70",
                "impact": "2 - Medium",
                "urgency": "2 - Medium",
                "priority": "3 - Moderate"
            }
        }
    )


class IncidentPredictionResponse(BaseModel):
    """
    Output schema for incident ticket reassignment prediction.
    """
    reassignment_required: int = Field(
        description="Binary prediction: 1 = Reassignment Required, 0 = No Reassignment"
    )
    reassignment_probability: float = Field(
        description="Predicted probability score for reassignment requirement (0.0 to 1.0)"
    )
    risk_label: str = Field(
        description="Categorical risk rating: 'Low Risk' or 'High Risk'"
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
    status: str = Field(default="healthy", description="Service health state ('healthy' or 'degraded')")
    service: str = Field(default="RouteRight AI - Backend API", description="Service description name")
    artifacts_loaded: bool = Field(description="Indicates if model artifacts are accessible and loaded")
    details: Dict[str, Any] = Field(description="Details on loaded model file existence")
