"""Resilience tests for the public FastAPI prediction contract.

These tests exercise hostile, incomplete, repeated, and unusual requests at
the HTTP boundary. They intentionally focus on stable response behavior rather
than model accuracy.
"""

import pytest
from fastapi.testclient import TestClient

from app.backend.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_payload() -> dict:
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
        "priority": "3 - Moderate",
    }


@pytest.mark.parametrize(
    "field,value",
    [
        ("opened_at", None),
        ("opened_at", ""),
        ("contact_type", None),
        ("impact", None),
        ("urgency", None),
        ("priority", None),
    ],
)
def test_required_fields_never_turn_malformed_requests_into_500(
    client: TestClient, valid_payload: dict, field: str, value
):
    response = client.post("/predict", json={**valid_payload, field: value})

    assert response.status_code in (400, 422)
    assert response.headers["content-type"].startswith("application/json")


@pytest.mark.parametrize(
    "field,value",
    [
        ("impact", "critical"),
        ("urgency", "urgent"),
        ("priority", "P0"),
        ("opened_at", "2024-02-30 12:00:00"),
        ("opened_at", "not-a-date"),
    ],
)
def test_invalid_values_return_actionable_client_errors(
    client: TestClient, valid_payload: dict, field: str, value
):
    response = client.post("/predict", json={**valid_payload, field: value})

    assert response.status_code in (400, 422)
    assert response.status_code != 500
    assert response.json().get("detail")


def test_optional_categorical_fields_can_be_null(client: TestClient, valid_payload: dict):
    optional_fields = (
        "opened_by",
        "location",
        "category",
        "subcategory",
        "u_symptom",
        "assignment_group",
    )
    payload = {**valid_payload, **{field: None for field in optional_fields}}

    response = client.post("/predict", json=payload)

    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_unseen_and_whitespace_categories_do_not_crash_inference(
    client: TestClient, valid_payload: dict
):
    payload = {
        **valid_payload,
        "opened_by": "  New caller not in training data  ",
        "location": " Location 999999 ",
        "category": "Category never seen before",
        "subcategory": "Subcategory never seen before",
        "u_symptom": "Symptom never seen before",
        "assignment_group": "Group never seen before",
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["prediction"] in (0, 1)
    assert 0 <= body["probability"] <= 1


def test_extra_request_fields_do_not_change_prediction_contract(
    client: TestClient, valid_payload: dict
):
    response = client.post(
        "/predict",
        json={**valid_payload, "unexpected_client_field": "ignored"},
    )

    assert response.status_code == 200
    assert set(
        ("prediction", "label", "probability", "risk_level", "status")
    ).issubset(response.json())


def test_repeated_identical_requests_are_stable_except_timing(
    client: TestClient, valid_payload: dict
):
    responses = [client.post("/predict", json=valid_payload) for _ in range(5)]

    assert all(response.status_code == 200 for response in responses)
    results = [response.json() for response in responses]
    stable_keys = ("prediction", "label", "probability", "risk_level", "model_name")
    assert [tuple(result[key] for key in stable_keys) for result in results] == [
        tuple(results[0][key] for key in stable_keys)
    ] * len(results)
