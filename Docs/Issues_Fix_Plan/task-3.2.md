Task 3.2: Add Request Validation Layer (Pydantic Integration)
🎯 Objective
Implement a robust request validation layer using Pydantic to enforce data integrity before it reaches the service layer. This prevents malformed data from causing runtime errors or corrupting the database, adhering to the "Fail Fast" principle.
🏗️ Architecture Change
Before: API → Service → (Manual if/else checks inside logic)
After: API → Pydantic Validator → Service → Repository
📋 Prerequisites
Completion of Task 3.1 (Repository Pattern) - Optional but recommended
pydantic library installed
🚀 Step-by-Step Execution Plan
Step 1: Install Pydantic
Install the latest version of Pydantic (v2 recommended).
bash
cd /workspace/backend
pip install pydantic
Add pydantic to requirements.txt.
Step 2: Create Validators Directory
Organize validation schemas separately from business logic.
bash
mkdir -p /workspace/backend/validators
touch /workspace/backend/validators/__init__.py
Step 3: Define Validation Schemas (Models)
Create /workspace/backend/validators/draw_validator.py. This defines the "Contract" for API inputs.
python
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
    # Additional fields specific to updates can be added here if needed
    pass
Create /workspace/backend/validators/agent_validator.py:
python
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
Step 4: Refactor API Layer to Use Validators
Update /workspace/backend/main.py. The API class now validates input immediately upon receiving it from the frontend.
Before:
python
def create_draw(self, data):
    # Manual checks scattered in service or missing
    return self.draw_service.create_draw(data)
After:
python
from validators.draw_validator import CreateDrawRequest
from pydantic import ValidationError

class API:
    def __init__(self, draw_service, agent_service, ...):
        self.draw_service = draw_service
        self.agent_service = agent_service
        # ...

    def create_draw(self,  dict):
        try:
            # 1. Validate Input against Schema
            validated_data = CreateDrawRequest(**data)
            
            # 2. Pass validated model (or dict) to service
            # validated_data.model_dump() converts Pydantic model back to dict
            return self.draw_service.create_draw(validated_data.model_dump())
            
        except ValidationError as e:
            # 3. Return structured error to frontend
            error_msg = "; ".join([f"{err['loc'][0]}: {err['msg']}" for err in e.errors()])
            raise ValueError(f"Validation Failed: {error_msg}")
        except Exception as e:
            # Re-raise unexpected errors
            raise e

    def create_agent(self, data: dict):
        try:
            from validators.agent_validator import CreateAgentRequest
            validated_data = CreateAgentRequest(**data)
            return self.agent_service.create_agent(**validated_data.model_dump())
        except ValidationError as e:
            error_msg = "; ".join([f"{err['loc'][0]}: {err['msg']}" for err in e.errors()])
            raise ValueError(f"Validation Failed: {error_msg}")
Step 5: Handle Validation Errors in Frontend (Optional but Recommended)
Ensure the frontend displays the specific validation errors returned by Pydantic.
In frontend/src/utils/bridge.js or the calling component:
javascript
try {
  await callPython('create_draw', formData);
} catch (error) {
  if (error.message.includes("Validation Failed")) {
    // Display specific field errors to user
    notifyError(error.message); 
  } else {
    notifyError("An unexpected error occurred");
  }
}
Step 6: Test Validation Rules
Verify the system rejects invalid data immediately.
Input Data
Expected Result
Error Message
draw_date: "2023-01-01" (Past)
❌ Rejected
"Draw date cannot be in the past."
draw_date: "01-01-2024" (Wrong Format)
❌ Rejected
"Invalid date format..."
commission: 150 (>100)
❌ Rejected
"commission: Input should be less than or equal to 100"
id: "A@B" (Special chars)
❌ Rejected
"Agent ID must be alphanumeric."
Valid Data
✅ Accepted
Proceeds to Service/DB
✅ Completion Checklist
pydantic installed and added to requirements
validators/ directory created
CreateDrawRequest schema defined with custom validators
CreateAgentRequest schema defined with field constraints
main.py (API class) updated to wrap calls in try...except ValidationError
Invalid inputs rejected with clear error messages
Valid inputs successfully processed
💡 Strategic Benefits
Security: Prevents injection attacks or logic bypasses via malformed inputs.
Clarity: Validation rules are declarative and located in one place, not scattered across if statements.
Auto-Documentation: Pydantic models serve as living documentation of expected API payloads.
Type Safety: Ensures data types (e.g., float, date) are correct before logic execution, reducing TypeError risks.
Frontend Feedback: Provides specific, actionable error messages to users (e.g., "Date cannot be in the past" vs. "Database Error").