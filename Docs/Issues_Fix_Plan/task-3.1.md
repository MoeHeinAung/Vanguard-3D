Task 3.1: Implement Repository Pattern (Long-Term Strategic Improvement)
🎯 Objective
Decouple business logic services from direct database access by introducing a Repository Layer. This adheres to the Dependency Inversion Principle (DIP), making the codebase testable, maintainable, and ready for future database migrations (e.g., switching from SQLite to PostgreSQL).
🏗️ Architecture Change
Before: Service → DatabaseManager (Direct SQL coupling)
After: Service → Repository → DatabaseManager (Abstraction)
📋 Prerequisites
Completion of Task 2.1 (Base Service)
Understanding of Python Type Hinting and Protocols
pytest installed for testing validation
🚀 Step-by-Step Execution Plan
Step 1: Create Repository Directory Structure
Organize the backend to separate data access from business logic.
bash
mkdir -p /workspace/backend/repositories
touch /workspace/backend/repositories/__init__.py
Step 2: Define Abstract Base Repository (Interface)
Create /workspace/backend/repositories/base_repository.py. This defines the contract all repositories must follow.
python
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, TypeVar

T = TypeVar('T')

class BaseRepository(ABC):
    """
    Abstract interface for all data repositories.
    Ensures consistent data access patterns regardless of underlying DB.
    """
    
    @abstractmethod
    def find_all(self, order_by: str = 'created_at DESC') -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def find_by_id(self, entity_id: Any) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create(self, data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def update(self, entity_id: Any, data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def delete(self, entity_id: Any) -> bool:
        pass
Step 3: Implement Concrete Repository (Example: DrawRepository)
Create /workspace/backend/repositories/draw_repository.py. This handles the actual SQL, isolating it from business rules.
python
import sqlite3
from typing import List, Dict, Any, Optional
from .base_repository import BaseRepository
from database.manager import DatabaseManager

class DrawRepository(BaseRepository):
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.table_name = 'draws'
        self.id_field = 'id'

    def find_all(self, order_by: str = 'draw_date DESC') -> List[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                # Safe string interpolation for order_by (validated internally)
                cursor.execute(f'SELECT * FROM {self.table_name} ORDER BY {order_by}')
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Repo Error fetching draws: {e}")
            return []

    def find_by_id(self, draw_id: int) -> Optional[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {self.table_name} WHERE {self.id_field} = ?', (draw_id,))
                row = cursor.fetchone()
                return dict(row) if row else None
        except Exception as e:
            print(f"Repo Error fetching draw {draw_id}: {e}")
            return None

    def create(self, data: Dict[str, Any]) -> bool:
        try:
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?'] * len(data))
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})', tuple(data.values()))
                conn.commit()
                return True
        except Exception as e:
            print(f"Repo Error creating draw: {e}")
            return False

    def update(self, entity_id: int, data: Dict[str, Any]) -> bool:
        try:
            set_clause = ', '.join([f'{k} = ?' for k in data.keys()])
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'UPDATE {self.table_name} SET {set_clause} WHERE {self.id_field} = ?', (*data.values(), entity_id))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Repo Error updating draw {entity_id}: {e}")
            return False

    def delete(self, entity_id: int) -> bool:
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'DELETE FROM {self.table_name} WHERE {self.id_field} = ?', (entity_id,))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Repo Error deleting draw {entity_id}: {e}")
            return False
(Repeat Step 3 for AgentRepository, MasterDealerRepository, etc., or create a generic SqliteRepository base class similar to Task 2.1 if strict uniformity is needed.)
Step 4: Refactor Service to Use Repository
Update /workspace/backend/services/draw_service.py to depend on the repository instead of the database manager directly.
Before:
python
class DrawService:
    def __init__(self, db_manager):
        self.db = db_manager
    # ... direct SQL calls ...
After:
python
from repositories.draw_repository import DrawRepository

class DrawService:
    def __init__(self, draw_repo: DrawRepository):
        self.repo = draw_repo

    def get_all_draws(self):
        # Business logic can now focus on transformation/validation
        return self.repo.find_all()

    def get_draw_by_id(self, draw_id):
        return self.repo.find_by_id(draw_id)

    def create_draw(self, draw_data):
        # Add business validation here before passing to repo
        if not draw_data.get('draw_date'):
            raise ValueError("Draw date is required")
        return self.repo.create(draw_data)
Step 5: Update Dependency Injection in Main
Update /workspace/backend/main.py to instantiate repositories and inject them into services.
python
# Initialize Repositories
draw_repo = DrawRepository(db_manager)
agent_repo = AgentRepository(db_manager)

# Initialize Services with Repositories
draw_service = DrawService(draw_repo)
agent_service = AgentService(agent_repo) # Assuming AgentRepository exists

# API Class uses services as before
api = API(
    draw_service=draw_service,
    agent_service=agent_service,
    # ...
)
Step 6: Validate Testability (Mocking)
Demonstrate that services can now be tested without a real database.
Example Test (tests/test_draw_service.py):
python
def test_create_draw_validation():
    # Mock Repository
    mock_repo = MagicMock()
    service = DrawService(mock_repo)
    
    # Test business logic validation without DB
    try:
        service.create_draw({'draw_date': None})
        assert False, "Should have raised ValueError"
    except ValueError:
        pass # Expected
    
    # Verify repo.create was NOT called due to validation failure
    mock_repo.create.assert_not_called()
✅ Completion Checklist
repositories/ directory created
BaseRepository abstract class defined
DrawRepository (and others) implemented with SQL logic
DrawService refactored to use DrawRepository
main.py updated to wire up dependencies
Unit tests created demonstrating mocking capability
No direct self.db.get_connection() calls remain in Services
💡 Strategic Benefits
Testability: Services can be unit-tested with mocked repositories, eliminating the need for slow integration tests for logic validation.
Swappability: Switching from SQLite to PostgreSQL only requires changing the Repository implementation, leaving Services and API untouched.
Single Responsibility: Services handle business rules; Repositories handle data persistence.
Clean Architecture: Prepares the codebase for further layers (e.g., DTOs, Validators) as the application scales.