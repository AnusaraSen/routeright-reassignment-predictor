"""Resilience tests for the predictor service below the HTTP layer."""

import pandas as pd
import pytest

from app.backend.services.predictor import get_predictor


@pytest.fixture(scope="module")
def predictor():
    return get_predictor()


@pytest.fixture
def valid_input() -> dict:
    return {
        "opened_at": "2016-03-01T09:30",
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


@pytest.mark.parametrize("bad_input", [None, [], "ticket", 123])
def test_engineer_features_rejects_unsupported_input_types(predictor, bad_input):
    with pytest.raises(TypeError, match="Expected dict or DataFrame"):
        predictor.engineer_features(bad_input)


def test_engineer_features_rejects_empty_dataframe(predictor):
    with pytest.raises(ValueError, match="Input DataFrame is empty"):
        predictor.engineer_features(pd.DataFrame())


@pytest.mark.parametrize(
    "field,value",
    [
        ("opened_at", None),
        ("opened_at", " "),
        ("opened_at", "2024-13-40"),
        ("impact", "4 - Extreme"),
        ("urgency", "0 - None"),
        ("priority", "5 - Lowest"),
    ],
)
def test_feature_engineering_rejects_invalid_values_without_partial_output(
    predictor, valid_input: dict, field: str, value
):
    with pytest.raises(ValueError):
        predictor.engineer_features({**valid_input, field: value})


def test_missing_nominal_values_are_imputed_by_the_pipeline(predictor, valid_input: dict):
    nominal_fields = (
        "opened_by",
        "location",
        "category",
        "subcategory",
        "u_symptom",
        "assignment_group",
    )
    result = predictor.predict(
        {**valid_input, **{field: None for field in nominal_fields}}
    )

    assert result["status"] == "success"
    assert result["prediction"] in (0, 1)


def test_dataframe_input_uses_first_row_and_returns_normal_contract(
    predictor, valid_input: dict
):
    frame = pd.DataFrame([valid_input, {**valid_input, "priority": "1 - Critical"}])

    result = predictor.predict(frame)

    assert result["status"] == "success"
    assert result["prediction"] in (0, 1)
    assert 0 <= result["probability"] <= 1


def test_prediction_result_has_finite_values(predictor, valid_input: dict):
    result = predictor.predict(valid_input)

    assert result["inference_time_ms"] >= 0
    assert result["decision_threshold"] == 0.5
    assert result["probability"] == pytest.approx(
        round(result["probability"], 4)
    )
