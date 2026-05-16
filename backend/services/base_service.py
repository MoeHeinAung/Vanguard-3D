import sqlite3
from abc import ABC
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
        except sqlite3.IntegrityError as e:
            if 'FOREIGN KEY constraint failed' in str(e):
                raise ValueError(f"Cannot delete {self.table_name[:-1]} '{entity_id}' because it is in use by other records.")
            raise e
        except Exception as e:
            print(f"Error deleting {entity_id} from {self.table_name}: {e}")
            return False
