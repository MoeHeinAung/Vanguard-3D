Task 2.1: Extract Base Entity Service (DRY Refactoring)
🎯 Objective
Eliminate code duplication between AgentService, MasterDealerService, and future entity services by creating a reusable BaseEntityService class. This adheres to the DRY (Don't Repeat Yourself) principle and prepares the architecture for scalability.
📋 Prerequisites
Completion of Task 1.3 (Foreign Key enforcement) to ensure base operations are safe.
Access to /workspace/backend/services/.
Basic understanding of Python Class Inheritance.
🗺️ Architecture Change
Before:
AgentService: Contains get_all, get_by_id, create, update, delete (50+ lines).
MasterDealerService: Contains identical logic, just different table name (50+ lines).
Total: ~100+ lines of duplicated code.
After:
BaseEntityService: Contains generic logic once.
AgentService: Inherits base, defines only table_name = 'agents'.
Total: ~60 lines (40% reduction).
🚀 Step-by-Step Execution Plan
Step 1: Create the Base Service File
Create a new file at /workspace/backend/services/base_service.py.
Content to Write:
python
import sqlite3
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseEntityService(ABC):
    """
    Abstract base class for all entity services.
    Provides standard CRUD operations to eliminate duplication.
    """
    
    def __init__(self, db_manager, table_name: str, id_field: str = 'id'):
        self.db = db_manager
        self.table_name = table_name
        self.id_field = id_field

    def get_all(self, order_by: str = 'created_at DESC') -> List[Dict[str, Any]]:
        """Fetch all records ordered by specified column."""
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                # Sanitize order_by to prevent SQL injection (simple whitelist check could be added here)
                cursor.execute(f'SELECT * FROM {self.table_name} ORDER BY {order_by}')
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Error fetching all from {self.table_name}: {e}")
            return []

    def get_by_id(self, entity_id: Any) -> Optional[Dict[str, Any]]:
        """Fetch a single record by ID."""
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(
                    f'SELECT * FROM {self.table_name} WHERE {self.id_field} = ?',
                    (entity_id,)
                )
                row = cursor.fetchone()
                return dict(row) if row else None
        except Exception as e:
            print(f"Error fetching {entity_id} from {self.table_name}: {e}")
            return None

    def create(self, data: Dict[str, Any]) -> bool:
        """Insert a new record. Data keys must match column names."""
        try:
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?'] * len(data))
            
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f'INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})',
                    tuple(data.values())
                )
                conn.commit()
                return True
        except Exception as e:
            print(f"Error creating record in {self.table_name}: {e}")
            return False

    def update(self, entity_id: Any, data: Dict[str, Any]) -> bool:
        """Update an existing record by ID."""
        try:
            set_clause = ', '.join([f'{k} = ?' for k in data.keys()])
            
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f'UPDATE {self.table_name} SET {set_clause} WHERE {self.id_field} = ?',
                    (*data.values(), entity_id)
                )
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating {entity_id} in {self.table_name}: {e}")
            return False

    def delete(self, entity_id: Any) -> bool:
        """Delete a record by ID."""
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f'DELETE FROM {self.table_name} WHERE {self.id_field} = ?',
                    (entity_id,)
                )
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error deleting {entity_id} from {self.table_name}: {e}")
            return False
Step 2: Refactor AgentService
Open /workspace/backend/services/agent_service.py.
Action:
Import BaseEntityService.
Change class definition to inherit from BaseEntityService.
Remove duplicated methods (get_all, get_by_id, etc.).
Keep domain-specific methods (if any) or simplify initialization.
Before:
python
class AgentService:
    def __init__(self, db_manager):
        self.db = db_manager

    def get_all(self):
        # ... 10 lines of SQL ...
    
    def create_agent(self, id, name, ...):
        # ... 15 lines of SQL ...
After:
python
from .base_service import BaseEntityService

class AgentService(BaseEntityService):
    def __init__(self, db_manager):
        # Initialize parent with table name
        super().__init__(db_manager, table_name='agents', id_field='id')

    def create_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        """Domain-specific wrapper for create"""
        return self.create({
            'id': id,
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        })

    def update_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        """Domain-specific wrapper for update"""
        return self.update(id, {
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        })
Step 3: Refactor MasterDealerService
Open /workspace/backend/services/master_dealer_service.py.
Action:
Apply the exact same pattern as Step 2, but change the table name to 'master_dealers'.
Code Snippet:
python
from .base_service import BaseEntityService

class MasterDealerService(BaseEntityService):
    def __init__(self, db_manager):
        super().__init__(db_manager, table_name='master_dealers', id_field='id')

    def create_master_dealer(self, id, name, commission, jp_factor, sp_factor, notes=None):
        return self.create({
            'id': id,
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        })
    
    # ... similar update method ...
Step 4: Verify Imports in main.py
Ensure main.py (or wherever services are instantiated) still imports the concrete classes correctly. No changes should be needed there since the class names (AgentService, MasterDealerService) remain the same, only their internal implementation changed.
Step 5: Test Functionality
Run the application and perform these checks:
List: Navigate to Agents page. Do agents load?
Create: Add a new Agent. Does it appear in the list?
Update: Edit an Agent's commission. Does it save?
Delete: Delete an Agent. Is it removed?
Repeat: Perform steps 1-4 for Master Dealers.
Step 6: Future-Proofing (Optional but Recommended)
If you have a DrawService or UserService that follows similar patterns, refactor them now using the same approach. The time saved per service increases with each adoption.
✅ Completion Checklist
base_service.py created with generic CRUD logic.
AgentService refactored to inherit BaseEntityService.
MasterDealerService refactored to inherit BaseEntityService.
Duplicated SQL code removed from both child classes.
Application tested: Create, Read, Update, Delete work for both entities.
Code coverage maintained (logic paths unchanged, just moved).
💡 Why This Matters
Maintainability: If we need to add logging or error handling to all database reads, we now only edit one file (base_service.py) instead of ten.
Consistency: Eliminates risk of one service having a bug fix while another retains the bug.
Scalability: Adding a new entity (e.g., RetailerService) now takes ~10 lines of code instead of ~100.