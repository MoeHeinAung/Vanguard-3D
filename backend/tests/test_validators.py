import pytest
from pydantic import ValidationError
from backend.validators.draw_validator import CreateDrawRequest
from datetime import date

def test_create_draw_valid():
    data = {
        "draw_date": "2026-12-31",
        "cutoff_time": "20:00:00",
        "notes": "Special draw"
    }
    request = CreateDrawRequest(**data)
    assert request.draw_date == "2026-12-31"

def test_create_draw_past_date():
    data = {
        "draw_date": "2020-01-01", # Past
        "cutoff_time": "20:00:00"
    }
    with pytest.raises(ValidationError) as exc_info:
        CreateDrawRequest(**data)
    
    assert "cannot be in the past" in str(exc_info.value)

def test_create_draw_invalid_format():
    data = {
        "draw_date": "01-01-2025", # Wrong format
        "cutoff_time": "20:00:00"
    }
    with pytest.raises(ValidationError):
        CreateDrawRequest(**data)
