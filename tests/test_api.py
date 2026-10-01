"""API integration test suite for RouteRight AI FastAPI backend.

Tests endpoints:
- GET /
- GET /health
- POST /predict
And validates input validation, error handling, contract alignment, and edge cases.
"""

import pytest
from fastapi.testclient import TestClient

from app.backend.main import app


@pytest.fixture(scope="module")
def client():
    """TestClient fixture with lifespan context enabled."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_ticket_payload() -> dict:
    """Fixture with valid 11-field ticket payload matching training contract."""
    return {
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


# =============================================================================
# 1. Foundation Endpoints Tests
# =============================================================================

def test_root_endpoint(client: TestClient):
    """Test GET / endpoint returns service identity and online status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data
    assert data["docs_url"] == "/docs"


def test_health_check_endpoint(client: TestClient):
    """Test GET /health returns healthy status and loaded artifacts."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["artifacts_loaded"] is True
    assert data["details"]["model_file_exists"] is True
    assert data["details"]["pipeline_file_exists"] is True
    assert data["details"]["metadata_file_exists"] is True


# =============================================================================
# 2. POST /predict Success & Contract Tests
# =============================================================================

def test_predict_endpoint_valid_payload(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict with a valid complete payload returns HTTP 200 and valid schema."""
    response = client.post("/predict", json=valid_ticket_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["reassignment_required"] in (0, 1)
    assert isinstance(data["reassignment_probability"], float)
    assert 0.0 <= data["reassignment_probability"] <= 1.0
    assert data["risk_label"] in ("Low Risk", "High Risk")
    assert data["decision_threshold"] == 0.5
    assert data["model_name"] == "Random Forest"
    assert data["status"] == "success"

    # Verify risk_label consistency with threshold
    if data["reassignment_required"] == 1:
        assert data["risk_label"] == "High Risk"
        assert data["reassignment_probability"] >= data["decision_threshold"]
    else:
        assert data["risk_label"] == "Low Risk"
        assert data["reassignment_probability"] < data["decision_threshold"]


def test_predict_endpoint_missing_optional_fields(client: TestClient):
    """Test POST /predict with optional categorical fields set to None succeeds."""
    payload = {
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
        "priority": "1 - Critical"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["reassignment_required"] in (0, 1)


def test_predict_endpoint_unseen_categories(client: TestClient):
    """Test POST /predict with unseen/rare category strings succeeds gracefully."""
    payload = {
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
        "priority": "4 - Low"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["reassignment_required"] in (0, 1)


# =============================================================================
# 3. Input Validation & Error Handling Tests
# =============================================================================

def test_predict_missing_required_opened_at(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict missing required opened_at field returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload)
    del bad_payload["opened_at"]
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_missing_required_contact_type(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict missing required contact_type field returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload)
    del bad_payload["contact_type"]
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_missing_required_impact(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict missing required impact field returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload)
    del bad_payload["impact"]
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_missing_required_urgency(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict missing required urgency field returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload)
    del bad_payload["urgency"]
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_missing_required_priority(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict missing required priority field returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload)
    del bad_payload["priority"]
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_invalid_impact_enum(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict with invalid impact enum string returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload, impact="High")
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_invalid_urgency_enum(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict with invalid urgency enum string returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload, urgency="5 - Ultra")
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_invalid_priority_enum(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict with invalid priority enum string returns HTTP 422."""
    bad_payload = dict(valid_ticket_payload, priority="P1")
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422


def test_predict_invalid_datetime_string(client: TestClient, valid_ticket_payload: dict):
    """Test POST /predict with non-date string returns HTTP 400."""
    bad_payload = dict(valid_ticket_payload, opened_at="not-a-valid-timestamp")
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 400
    assert "Invalid or unparseable opened_at" in response.json()["detail"]


def test_health_check_degraded_when_artifacts_not_loaded(client: TestClient, monkeypatch):
    """Test GET /health returns degraded status if artifacts are not loaded."""
    from app.backend.model_loader import artifact_loader
    monkeypatch.setattr(artifact_loader, "_is_loaded", False)

    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "degraded"
    assert data["artifacts_loaded"] is False


def test_predict_internal_server_error_sanitization(client: TestClient, valid_ticket_payload: dict, monkeypatch):
    """Test POST /predict returns generic HTTP 500 without leaking internal error details or paths."""
    import app.backend.main as main_mod

    class BrokenPredictor:
        def predict(self, raw_input):
            raise RuntimeError("Secret internal failure in /root/secret/file.py line 42")

    monkeypatch.setattr(main_mod, "get_predictor", lambda: BrokenPredictor())

    response = client.post("/predict", json=valid_ticket_payload)
    assert response.status_code == 500
    data = response.json()
    assert "Secret internal failure" not in data["detail"]
    assert "/root/secret/file.py" not in data["detail"]
    assert data["detail"] == "An internal error occurred while processing the prediction."

