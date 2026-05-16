from typing import List, Optional
from dataclasses import dataclass

@dataclass
class TicketEntry:
    """Structured representation of a parsed ticket line."""
    ticket: str
    amount: float
    notes: Optional[str] = None

class TicketParser:
    """
    Centralized utility for parsing ticket input strings.
    Enforces consistent validation rules across Sales and Offloads.
    """
    
    # Configuration Constants
    MAX_AMOUNT = 1_000_000.0
    MIN_AMOUNT = 0.01
    TICKET_LENGTH = 3

    @classmethod
    def parse(cls, input_text: str, notes: Optional[str] = None) -> List[TicketEntry]:
        """
        Parse multi-line input string into a list of TicketEntry objects.
        Expected format per line: '123 = 5000'
        
        Args:
            input_text: Raw string from frontend textarea
            notes: Optional global notes to attach to all entries
            
        Returns:
            List of valid TicketEntry objects (invalid lines are silently skipped)
        """
        entries = []
        
        if not input_text or not isinstance(input_text, str):
            return entries
        
        lines = input_text.strip().split('\n')
        
        for line in lines:
            entry = cls._parse_line(line, notes)
            if entry:
                entries.append(entry)
        
        return entries

    @classmethod
    def _parse_line(cls, line: str, notes: Optional[str] = None) -> Optional[TicketEntry]:
        """
        Parse a single line of input.
        Returns None if the line is invalid.
        """
        # Check for separator
        if '=' not in line:
            return None
        
        parts = line.split('=', 1)  # Split only on first '='
        if len(parts) != 2:
            return None
        
        ticket_str, amount_str = parts
        ticket_str = ticket_str.strip()
        amount_str = amount_str.strip()
        
        # Validate Ticket Number
        if not ticket_str.isdigit() or len(ticket_str) != cls.TICKET_LENGTH:
            return None
        
        # Validate Amount
        try:
            amount = float(amount_str)
            if not (cls.MIN_AMOUNT <= amount <= cls.MAX_AMOUNT):
                return None
        except (ValueError, TypeError):
            return None
        
        return TicketEntry(ticket=ticket_str, amount=amount, notes=notes)
