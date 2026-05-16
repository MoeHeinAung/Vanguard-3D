from pydantic import BaseModel, Field, field_validator
from typing import Optional

class CreateAgentRequest(BaseModel):
    id: str = Field(..., min_length=1, max_length=10)
    name: str = Field(..., min_length=1, max_length=100)
    commission: float = Field(..., ge=0, le=100) # 0% to 100%
    jp_factor: float = Field(..., ge=0)
    sp_factor: float = Field(..., ge=0)
    notes: Optional[str] = Field(None, max_length=500)

    @field_validator('id')
    @classmethod
    def validate_id_alphanumeric(cls, v: str) -> str:
        if not v.isalnum():
            raise ValueError('Agent ID must be alphanumeric.')
        return v
