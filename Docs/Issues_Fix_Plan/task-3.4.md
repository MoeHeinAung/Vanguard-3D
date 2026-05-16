Task 3.4: Add Integration Tests (Quality Assurance Foundation)
🎯 Objective
Establish a robust automated testing suite using pytest to prevent regressions, validate complex business logic (especially Settlement calculations), and ensure data integrity across the repository and service layers.
🏗️ Architecture Change
Before: Manual testing via UI; high risk of silent regressions in financial logic.
After: Automated test suite running on every code change; immediate feedback on broken logic.
📋 Prerequisites
Completion of Task 3.1 (Repository Pattern) - Makes mocking easy
Completion of Task 3.2 (Pydantic Validators)
Python 3.8+
🚀 Step-by-Step Execution Plan
Step 1: Install Testing Dependencies
Install pytest and pytest-cov (for coverage reports).
bash
cd /workspace/backend
pip install pytest pytest-cov
Add to requirements.txt:
text
pytest>=7.0.0
pytest-cov>=4.0.0
Step 2: Configure Pytest
Create /workspace/backend/pytest.ini to define test discovery and options.
ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --cov=. --cov-report=term-missing
Step 3: Create Test Directory Structure
bash
mkdir -p /workspace/backend/tests
touch /workspace/backend/tests/__init__.py
Step 4: Create Conftest (Test Fixtures)
Create /workspace/backend/tests/conftest.py. This sets up a temporary in-memory database for every test run, ensuring tests are isolated and don't corrupt real data.
python
import pytest
import sqlite3
import os
from database.manager import DatabaseManager
from repositories.draw_repository import DrawRepository
from services.draw_service import DrawService

@pytest.fixture(scope='function')
def temp_db():
    """
    Creates a temporary in-memory SQLite database for each test.
    Ensures tests are isolated and fast.
    """
    # Use ':memory:' for pure RAM DB, or a temp file if file persistence needed within test
    db_path = ':memory:'
    db_manager = DatabaseManager(db_path, max_connections=5)
    
    # Initialize Schema (Run your schema SQL here)
    with db_manager.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE draws (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                draw_date TEXT NOT NULL,
                cutoff_time TEXT NOT NULL,
                notes TEXT,
                status TEXT DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Add other tables (agents, sales, etc.) as needed for specific tests
        conn.commit()
    
    yield db_manager
    
    # Cleanup happens automatically when memory DB goes out of scope

@pytest.fixture
def draw_repo(temp_db):
    return DrawRepository(temp_db)

@pytest.fixture
def draw_service(draw_repo):
    return DrawService(draw_repo)
Step 5: Write Integration Test (Settlement Logic)
Create /workspace/backend/tests/test_settlement_service.py. This validates the complex financial math identified in the audit.
python
import pytest
from decimal import Decimal
from services.settlement_service import SettlementService
from repositories.draw_repository import DrawRepository
from repositories.agent_repository import AgentRepository
from repositories.sale_repository import SaleRepository
# Import other necessary repositories...

@pytest.fixture
def settlement_service(temp_db):
    # Initialize all required repos and the service
    draw_repo = DrawRepository(temp_db)
    agent_repo = AgentRepository(temp_db)
    sale_repo = SaleRepository(temp_db)
    # ... init other repos
    return SettlementService(draw_repo, agent_repo, sale_repo, ...)

def test_settlement_calculation_basic(settlement_service, temp_db):
    """
    Verify basic settlement math: Sales - Commission = Net
    """
    # 1. Setup Data (Using repositories directly)
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        # Create Draw
        cursor.execute("INSERT INTO draws (draw_date, cutoff_time) VALUES ('2024-01-01', '12:00:00')")
        draw_id = cursor.lastrowid
        
        # Create Agent (10% commission)
        cursor.execute("INSERT INTO agents (id, name, commission) VALUES ('A01', 'Test Agent', 10.0)")
        
        # Create Sale (1000 USD)
        cursor.execute("INSERT INTO sales (draw_id, agent_id, ticket, amount) VALUES (?, 'A01', '123', 1000)", (draw_id,))
        conn.commit()

    # 2. Execute Settlement
    report = settlement_service.calculate_settlement(draw_id)

    # 3. Assert Results
    assert report is not None
    assert report['global_sales'] == 1000.0
    assert report['global_agent_comms'] == 100.0  # 10% of 1000
    assert report['net_house_raw'] == 900.0

def test_settlement_with_blacklist(settlement_service, temp_db):
    """
    Verify that blacklisted tickets reduce agent payout correctly.
    """
    # 1. Setup Data with a blacklisted ticket
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        # ... (Create Draw, Agent, Sale as above)
        
        # Add Blacklist Entry
        cursor.execute("INSERT INTO blacklists (draw_id, ticket, reason) VALUES (?, '123', 'Fraud')", (1,))
        conn.commit()

    # 2. Execute Settlement
    report = settlement_service.calculate_settlement(1)

    # 3. Assert Payout is Reduced/Zero for blacklisted ticket
    # (Adjust assertion based on specific business rule: full void vs partial)
    assert 'blacklisted_deductions' in report
    assert report['blacklisted_deductions'] > 0
Step 6: Write Unit Test (Validator Logic)
Create /workspace/backend/tests/test_validators.py. Fast, no DB required.
python
import pytest
from pydantic import ValidationError
from validators.draw_validator import CreateDrawRequest
from datetime import date

def test_create_draw_valid():
    data = {
        "draw_date": "2025-12-31",
        "cutoff_time": "20:00:00",
        "notes": "Special draw"
    }
    request = CreateDrawRequest(**data)
    assert request.draw_date == "2025-12-31"

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
Step 7: Run Tests and Generate Coverage
Execute the test suite from the backend directory:
bash
cd /workspace/backend
pytest
Expected Output:
text
tests/test_validators.py::test_create_draw_valid PASSED
tests/test_validators.py::test_create_draw_past_date PASSED
tests/test_settlement_service.py::test_settlement_calculation_basic PASSED
...
---------- coverage: platform linux, python 3.x.x ----------
Name                             Stmts   Miss  Cover   Missing
--------------------------------------------------------------
services/settlement_service.py     135      10    93%   140-145
validators/draw_validator.py        25       0   100%
--------------------------------------------------------------
TOTAL                              500      50    90%
Step 8: Integrate into Development Workflow
Add a script to package.json (if using npm scripts for backend) or a Makefile:
makefile
# Makefile
test:
	cd backend && pytest

lint:
	cd backend && flake8 .
✅ Completion Checklist
pytest and pytest-cov installed
pytest.ini configured
tests/conftest.py created with in-memory DB fixture
test_validators.py written (Unit Tests)
test_settlement_service.py written (Integration Tests)
All tests pass (pytest returns exit code 0)
Code coverage report generated (>80% target for critical services)
💡 Strategic Benefits
Regression Prevention: Catch bugs introduced by refactoring (e.g., Task 2.1 or 3.1) immediately.
Documentation: Tests serve as executable examples of how the system should behave.
Confidence: Enables aggressive refactoring and feature additions without fear of breaking financial logic.
CI/CD Ready: This structure is directly compatible with GitHub Actions, GitLab CI, etc., for automated deployment pipelines.
Troubleshooting
"No module named...": Ensure PYTHONPATH includes the backend root or run pytest from the backend directory.
Database Locked in Tests: Ensure :memory: is used in fixtures or that temp files are cleaned up in teardown.
Import Errors: Check __init__.py files exist in all directories.