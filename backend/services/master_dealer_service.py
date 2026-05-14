import sqlite3

class MasterDealerService:
    def __init__(self, db_manager):
        self.db = db_manager

    def get_all_master_dealers(self):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM master_dealers ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def create_master_dealer(self, id, name, commission, jp_factor, sp_factor, notes=None):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO master_dealers (id, name, commission, jp_factor, sp_factor, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (id, name, commission, jp_factor, sp_factor, notes))
            conn.commit()
            return True

    def update_master_dealer(self, id, name, commission, jp_factor, sp_factor, notes=None):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE master_dealers 
                SET name = ?, commission = ?, jp_factor = ?, sp_factor = ?, notes = ?
                WHERE id = ?
            ''', (name, commission, jp_factor, sp_factor, notes, id))
            conn.commit()
            return cursor.rowcount > 0

    def delete_master_dealer(self, id):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM master_dealers WHERE id = ?', (id,))
            conn.commit()
            return cursor.rowcount > 0
