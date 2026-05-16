import sqlite3
from datetime import datetime
from backend.utils.ticket_parser import TicketParser
from backend.repositories.draw_repository import DrawRepository

class SaleService:
    def __init__(self, db, draw_repo: DrawRepository = None):
        self.db = db
        self.draw_repo = draw_repo

    def parse_tickets(self, input_text, notes=None):
        """
        Parses input text using the centralized TicketParser.
        Returns a list of dictionaries ready for database insertion.
        """
        entries = TicketParser.parse(input_text, notes)
        
        # Convert dataclass objects to dictionaries for the service layer
        return [
            {'ticket': entry.ticket, 'amount': entry.amount, 'notes': entry.notes}
            for entry in entries
        ]

    def create_sales(self, draw_id, agent_id, input_text, notes=None):
        if self.draw_repo:
            draw = self.draw_repo.find_by_id(draw_id)
            if not draw or draw.get('status') != 'Open':
                raise ValueError("Cannot add sales to a closed or settled draw.")

        sales_data = self.parse_tickets(input_text, notes)
        created_at = datetime.now().isoformat()
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            for sale in sales_data:
                cursor.execute('''
                    INSERT INTO sales (draw_id, agent_id, ticket, amount, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (draw_id, agent_id, sale['ticket'], sale['amount'], sale['notes'], created_at))
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
