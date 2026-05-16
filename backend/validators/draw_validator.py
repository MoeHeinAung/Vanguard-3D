from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional

class CreateDrawRequest(BaseModel):
    """
    Schema for creating a new Draw.
    Enforces format, range, and logical constraints.
    """
    draw_date: str = Field(..., description="YYYY-MM-DD format")
    cutoff_time: str = Field(..., description="HH:MM:SS format")
    notes: Optional[str] = Field(None, max_length=500)

    @field_validator('draw_date')
    @classmethod
    def validate_date_format_and_future(cls, v: str) -> str:
        try:
            draw_date = datetime.strptime(v, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Invalid date format. Use YYYY-MM-DD.')
        
        if draw_date < date.today():
            raise ValueError('Draw date cannot be in the past.')
        
        return v

    @field_validator('cutoff_time')
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        try:
            datetime.strptime(v, '%H:%M:%S')
        except ValueError:
            raise ValueError('Invalid time format. Use HH:MM:SS.')
        return v

class UpdateDrawRequest(CreateDrawRequest):
    """Inherits all validations from CreateDrawRequest."""
    pass
