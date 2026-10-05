"""Robustness tests for model inputs and prediction invariants.

The suite checks that valid variation in ticket attributes does not break
inference, while invalid values are rejected before reaching the model.
"""

from itertools import product
from math import isfinite

import pytest

from app.backend.services.predictor import (
    EXPECTED_FEATURE_COUNT,
    IMPACT_MAPPING,
    PRIORITY_MAPPING,
    URGENCY_MAPPING,
    get_predictor,
)


@pytest.fixture(scope="module")
def predictor():
    return get_predictor()


@pytest.fixture
def base_ticket() -> dict:
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


def assert_valid_prediction(result: dict) -> None:
    """Assert invariants that must hold for every successful prediction."""
    assert result["status"] == "success"
    assert result["prediction"] in (0, 1)
    assert 0.0 <= result["probability"] <= 1.0
    assert isfinite(result["probability"])
    assert result["risk_level"] in ("low", "medium", "high")
    assert result["decision_threshold"] == 0.5
    assert result["model_name"] == "Random Forest"
    assert result["inference_time_ms"] >= 0

    if result["prediction"] == 1:
        assert result["label"] == "Reassignment Required"
        assert result["risk_level"] == "high"
        assert result["probability"] >= result["decision_threshold"]
    else:
        assert result["label"] == "No Reassignment Required"
        assert result["risk_level"] == "low"
        assert result["probability"] < result["decision_threshold"]


@pytest.mark.parametrize(
    "opened_at",
    [
        "2016-03-01 00:00:00",
        "2016-03-01 09:30:00",
        "2016-03-01 23:59:59",
        "29/2/2016 01:16",
        "2016-04-16T12:00",
    ],
)
def test_supported_timestamp_variations_produce_valid_predictions(
    predictor, base_ticket: dict, opened_at: str
):
    result = predictor.predict({**base_ticket, "opened_at": opened_at})

    assert_valid_prediction(result)


@pytest.mark.parametrize(
    "impact,urgency,priority",
    list(product(
        IMPACT_MAPPING,
        URGENCY_MAPPING,
        PRIORITY_MAPPING,
    )),
)
def test_all_supported_ordinal_combinations_are_model_compatible(
    predictor, base_ticket: dict, impact: str, urgency: str, priority: str
):
    result = predictor.predict(
        {
            **base_ticket,
            "impact": impact,
            "urgency": urgency,
            "priority": priority,
        }
    )

    assert_valid_prediction(result)


@pytest.mark.parametrize(
    "field,values",
    [
        ("opened_by", ["Opened by 8", "Opened by 180", "New caller 99999"]),
        ("contact_type", ["Phone", "Email", "Self-service", "Carrier Pigeon"]),
        ("location", ["Location 143", "Location 108", "Location 99999"]),
        ("category", ["Category 26", "Category 55", "Category never seen"]),
        ("subcategory", ["Subcategory 170", "Subcategory 175", "Unknown subcategory"]),
        ("u_symptom", ["Symptom 72", "Symptom 491", "Unknown symptom"]),
        ("assignment_group", ["Group 56", "Group 70", "Unknown group"]),
    ],
)
def test_seen_and_unseen_categorical_values_remain_inference_safe(
    predictor, base_ticket: dict, field: str, values: list[str]
):
    for value in values:
        result = predictor.predict({**base_ticket, field: value})
        assert_valid_prediction(result)


@pytest.mark.parametrize(
    "field",
    [
        "opened_by",
        "location",
        "category",
        "subcategory",
        "u_symptom",
        "assignment_group",
    ],
)
def test_optional_categorical_missingness_is_supported(
    predictor, base_ticket: dict, field: str
):
    result = predictor.predict({**base_ticket, field: None})

    assert_valid_prediction(result)


def test_nominal_whitespace_is_normalized_without_changing_the_prediction(
    predictor, base_ticket: dict
):
    padded = {
        **base_ticket,
        "opened_by": f"  {base_ticket['opened_by']}  ",
        "location": f" {base_ticket['location']} ",
        "category": f"  {base_ticket['category']}",
    }

    baseline = predictor.predict(base_ticket)
    normalized = predictor.predict(padded)

    assert_valid_prediction(normalized)
    assert normalized["prediction"] == baseline["prediction"]
    assert normalized["probability"] == baseline["probability"]


def test_identical_inputs_are_deterministic(predictor, base_ticket: dict):
    results = [predictor.predict(base_ticket) for _ in range(10)]

    assert all(result["prediction"] == results[0]["prediction"] for result in results)
    assert all(result["probability"] == results[0]["probability"] for result in results)
    assert all(result["label"] == results[0]["label"] for result in results)


def test_engineered_features_keep_expected_model_shape(predictor, base_ticket: dict):
    engineered = predictor.engineer_features(base_ticket)
    transformed = predictor.pipeline.transform(engineered)

    if hasattr(transformed, "toarray"):
        transformed = transformed.toarray()

    assert transformed.shape == (1, EXPECTED_FEATURE_COUNT)
    assert list(engineered.columns) == [
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
