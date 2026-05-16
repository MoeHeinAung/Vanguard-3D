import sqlite3
import sys
from typing import List, Dict, Any, Optional
from .base_repository import BaseRepository
from backend.database.manager import DatabaseManager

class AgentRepository(BaseRepository):
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.table_name = 'agents'
        self.id_field = 'id'

    def find_all(self, order_by: str = 'created_at DESC') -> List[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {self.table_name} ORDER BY {order_by}')
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Error in AgentRepository.find_all: {e}", file=sys.stderr)
            raise e

    def find_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {self.table_name} WHERE {self.id_field} = ?', (entity_id,))
                row = cursor.fetchone()
                return dict(row) if row else None
        except Exception as e:
            print(f"Error in AgentRepository.find_by_id: {e}", file=sys.stderr)
            raise e

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
            print(f"Error in AgentRepository.create: {e}", file=sys.stderr)
            raise e

    def update(self, entity_id: str, data: Dict[str, Any]) -> bool:
        try:
            set_clause = ', '.join([f'{k} = ?' for k in data.keys()])
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'UPDATE {self.table_name} SET {set_clause} WHERE {self.id_field} = ?', (*data.values(), entity_id))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error in AgentRepository.update: {e}", file=sys.stderr)
            raise e

    def delete(self, entity_id: str) -> bool:
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'DELETE FROM {self.table_name} WHERE {self.id_field} = ?', (entity_id,))
                conn.commit()
                return cursor.rowcount > 0
        except sqlite3.IntegrityError as e:
            if 'FOREIGN KEY constraint failed' in str(e):
                raise ValueError(f"Cannot delete agent '{entity_id}' as it is referenced by other records.")
            raise e
        except Exception as e:
            print(f"Error in AgentRepository.delete: {e}", file=sys.stderr)
            raise e
