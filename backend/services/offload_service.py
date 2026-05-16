import sqlite3
from datetime import datetime

class OffloadService:
    def __init__(self, db):
        self.db = db

    def parse_tickets(self, input_text):
        """Parses input format: '123 = 5000\n456 = 10000'"""
        offloads = []
        lines = input_text.strip().split('\n')
        for line in lines:
            if '=' in line:
                parts = line.split('=')
                if len(parts) != 2:
                    continue
                ticket, amount = parts
                ticket = ticket.strip()
                amount = amount.strip()
                
                if not (ticket.isdigit() and len(ticket) == 3):
                    continue
                
                try:
                    amount_val = float(amount)
                    if amount_val <= 0 or amount_val > 1000000:
                        continue
                except (ValueError, TypeError):
                    continue
                
                offloads.append({'ticket': ticket, 'amount': amount_val})
        return offloads

    def create_offload(self, draw_id, master_dealer_id, input_text, notes=None):
        offload_data = self.parse_tickets(input_text)
        created_at = datetime.now().isoformat()
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            for offload in offload_data:
                cursor.execute('''
                    INSERT INTO offloaded_tickets (draw_id, master_dealer_id, ticket, amount, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (draw_id, master_dealer_id, offload['ticket'], offload['amount'], notes, created_at))
            conn.commit()
        return True

    def get_offloads(self):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT o.*, d.draw_date, md.name as master_dealer_name 
                FROM offloaded_tickets o
                JOIN draws d ON o.draw_id = d.id
                JOIN master_dealers md ON o.master_dealer_id = md.id
                ORDER BY o.created_at DESC
            ''')
            return [dict(row) for row in cursor.fetchall()]
