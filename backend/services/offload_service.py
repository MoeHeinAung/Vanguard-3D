import sqlite3
from datetime import datetime
from ..utils.ticket_parser import TicketParser

class OffloadService:
    def __init__(self, db):
        self.db = db

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

    def create_offload(self, draw_id, master_dealer_id, input_text, notes=None):
        offload_data = self.parse_tickets(input_text, notes)
        created_at = datetime.now().isoformat()
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            for offload in offload_data:
                cursor.execute('''
                    INSERT INTO offloaded_tickets (draw_id, master_dealer_id, ticket, amount, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (draw_id, master_dealer_id, offload['ticket'], offload['amount'], offload['notes'], created_at))
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
