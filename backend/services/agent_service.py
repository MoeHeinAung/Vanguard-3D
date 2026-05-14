import sqlite3

class AgentService:
    def __init__(self, db_manager):
        self.db = db_manager

    def get_all_agents(self):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM agents ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def create_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO agents (id, name, commission, jp_factor, sp_factor, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (id, name, commission, jp_factor, sp_factor, notes))
            conn.commit()
            return True

    def update_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE agents 
                SET name = ?, commission = ?, jp_factor = ?, sp_factor = ?, notes = ?
                WHERE id = ?
            ''', (name, commission, jp_factor, sp_factor, notes, id))
            conn.commit()
            return cursor.rowcount > 0

    def delete_agent(self, id):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM agents WHERE id = ?', (id,))
            conn.commit()
            return cursor.rowcount > 0
