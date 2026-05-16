import sqlite3
import sys
from typing import List, Dict, Any, Optional
from .base_repository import BaseRepository
from backend.database.manager import DatabaseManager

class DrawRepository(BaseRepository):
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.table_name = 'draws'
        self.id_field = 'id'

    def find_all(self, order_by: str = 'draw_date DESC, cutoff_time DESC') -> List[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {self.table_name} ORDER BY {order_by}')
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Error in DrawRepository.find_all: {e}", file=sys.stderr)
            raise e

    def find_by_id(self, draw_id: int) -> Optional[Dict[str, Any]]:
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {self.table_name} WHERE {self.id_field} = ?', (draw_id,))
                row = cursor.fetchone()
                return dict(row) if row else None
        except Exception as e:
            print(f"Error in DrawRepository.find_by_id: {e}", file=sys.stderr)
            raise e

    def create(self, data: Dict[str, Any]) -> bool:
        try:
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?'] * len(data))
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})', tuple(data.values()))
                conn.commit()
                return cursor.lastrowid is not None
        except Exception as e:
            print(f"Error in DrawRepository.create: {e}", file=sys.stderr)
            raise e

    def update(self, entity_id: int, data: Dict[str, Any]) -> bool:
        try:
            set_clause = ', '.join([f'{k} = ?' for k in data.keys()])
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'UPDATE {self.table_name} SET {set_clause} WHERE {self.id_field} = ?', (*data.values(), entity_id))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error in DrawRepository.update: {e}", file=sys.stderr)
            raise e

    def delete(self, entity_id: int) -> bool:
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'DELETE FROM {self.table_name} WHERE {self.id_field} = ?', (entity_id,))
                conn.commit()
                return cursor.rowcount > 0
        except sqlite3.IntegrityError as e:
            if 'FOREIGN KEY constraint failed' in str(e):
                raise ValueError(f"Cannot delete draw '{entity_id}' as it is referenced by other records.")
            raise e
        except Exception as e:
            print(f"Error in DrawRepository.delete: {e}", file=sys.stderr)
            raise e

    def update_draw_status(self, draw_id: int, status: str) -> bool:
        """Specific method to update draw status."""
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'UPDATE {self.table_name} SET status = ? WHERE {self.id_field} = ?', (status, draw_id))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error in DrawRepository.update_draw_status: {e}", file=sys.stderr)
            raise e

    def get_draws_needing_status_update(self, current_date, current_time):
        """Retrieves draws that need status update to 'Closed'."""
        try:
            with self.db.get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT * FROM draws 
                    WHERE status = 'Open' 
                    AND (draw_date < ? OR (draw_date = ? AND cutoff_time <= ?))
                ''', (current_date, current_date, current_time))
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Error in DrawRepository.get_draws_needing_status_update: {e}", file=sys.stderr)
            raise e

    def bulk_close_draws(self, current_date, current_time) -> int:
        """Closes all eligible draws."""
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE draws 
                    SET status = 'Closed' 
                    WHERE status = 'Open' 
                    AND (draw_date < ? OR (draw_date = ? AND cutoff_time <= ?))
                ''', (current_date, current_date, current_time))
                conn.commit()
                return cursor.rowcount
        except Exception as e:
            print(f"Error in DrawRepository.bulk_close_draws: {e}", file=sys.stderr)
            raise e
