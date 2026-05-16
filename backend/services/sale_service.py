import sqlite3
from datetime import datetime

class SaleService:
    def __init__(self, db):
        self.db = db

    def parse_tickets(self, input_text):
        """Parses input format: '123 = 5000\n456 = 10000'"""
        sales = []
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
                
                sales.append({'ticket': ticket, 'amount': amount_val})
        return sales

    def create_sales(self, draw_id, agent_id, input_text, notes=None):
        sales_data = self.parse_tickets(input_text)
        created_at = datetime.now().isoformat()
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            for sale in sales_data:
                cursor.execute('''
                    INSERT INTO sales (draw_id, agent_id, ticket, amount, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (draw_id, agent_id, sale['ticket'], sale['amount'], notes, created_at))
            conn.commit()
        return True

    def get_sales(self):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT s.*, d.draw_date, a.name as agent_name 
                FROM sales s
                JOIN draws d ON s.draw_id = d.id
                JOIN agents a ON s.agent_id = a.id
                ORDER BY s.created_at DESC
            ''')
            return [dict(row) for row in cursor.fetchall()]
