from datetime import datetime
import sqlite3

class DrawService:
    def __init__(self, db_manager):
        self.db = db_manager

    def create_draw(self, draw_date, cutoff_time, notes=None):
        """
        Creates a new draw. Initial status is 'Open'.
        draw_date: YYYY-MM-DD
        cutoff_time: HH:MM:SS
        """
        status = 'Open'
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO draws (draw_date, cutoff_time, status, notes)
                VALUES (?, ?, ?, ?)
            ''', (draw_date, cutoff_time, status, notes))
            conn.commit()
            return cursor.lastrowid

    def get_all_draws(self):
        """Retrieves all draws from the database."""
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM draws ORDER BY draw_date DESC, cutoff_time DESC')
            return [dict(row) for row in cursor.fetchall()]

    def update_statuses(self):
        """
        Updates 'Open' draws to 'Closed' if the current time has passed the cutoff.
        Returns the number of rows updated.
        """
        now = datetime.now()
        current_date = now.strftime('%Y-%m-%d')
        current_time = now.strftime('%H:%M:%S')

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Close draws where (date < today) OR (date == today AND time >= cutoff)
            cursor.execute('''
                UPDATE draws 
                SET status = 'Closed' 
                WHERE status = 'Open' 
                AND (
                    draw_date < ? 
                    OR (draw_date = ? AND cutoff_time <= ?)
                )
            ''', (current_date, current_date, current_time))
            conn.commit()
            return cursor.rowcount

    def settle_draw(self, draw_id):
        """Sets a draw status to 'Settled'."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE draws SET status = 'Settled' WHERE id = ?
            ''', (draw_id,))
            conn.commit()
            return cursor.rowcount > 0
