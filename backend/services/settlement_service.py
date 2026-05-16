import sqlite3

class SettlementService:
    def __init__(self, db):
        self.db = db

    def add_blacklist_ticket(self, draw_id, ticket, type):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO blacklist_tickets (draw_id, ticket, type)
                VALUES (?, ?, ?)
            ''', (draw_id, ticket, type))
            conn.commit()
        return True

    def get_blacklist_tickets(self, draw_id=None):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            if draw_id:
                cursor.execute('SELECT * FROM blacklist_tickets WHERE draw_id = ? ORDER BY created_at DESC', (draw_id,))
            else:
                cursor.execute('SELECT * FROM blacklist_tickets ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def add_winning_ticket(self, draw_id, ticket, type):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO winning_tickets (draw_id, ticket, type)
                VALUES (?, ?, ?)
            ''', (draw_id, ticket, type))
            conn.commit()
        return True

    def get_winning_tickets(self, draw_id=None):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            if draw_id:
                cursor.execute('SELECT * FROM winning_tickets WHERE draw_id = ? ORDER BY created_at DESC', (draw_id,))
            else:
                cursor.execute('SELECT * FROM winning_tickets ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def calculate_settlement(self, draw_id):
        # This method will be expanded with full business logic in future tasks
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Fetch all sales for this draw
            cursor.execute('SELECT * FROM sales WHERE draw_id = ?', (draw_id,))
            sales = [dict(row) for row in cursor.fetchall()]
            
            # Fetch blacklists
            cursor.execute('SELECT * FROM blacklist_tickets WHERE draw_id = ?', (draw_id,))
            blacklists = {row['ticket']: row['type'] for row in cursor.fetchall()}
            
            # Fetch winners
            cursor.execute('SELECT * FROM winning_tickets WHERE draw_id = ?', (draw_id,))
            winners = {row['ticket']: row['type'] for row in cursor.fetchall()}
            
            return {"status": "success", "message": "Settlement logic initialized", "winners_count": len(winners)}
