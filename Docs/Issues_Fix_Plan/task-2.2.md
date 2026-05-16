Task 2.2: Extract Ticket Parser Utility (DRY Refactoring)
🎯 Objective
Eliminate duplicated ticket parsing logic between SaleService and OffloadService by creating a standalone, reusable TicketParser utility class. This ensures consistent validation rules across the entire application.
📋 Prerequisites
Completion of Task 1.4 (Input Validation)
Access to /workspace/backend/utils/
Understanding of Python Dataclasses and Static Methods
🏗️ Architecture Change
Before: Parsing logic duplicated in two services (~40 lines total). Changing validation rules requires editing multiple files.
After: Single source of truth in utils/ticket_parser.py. Validation rules are centralized and reusable.
🚀 Step-by-Step Execution Plan
Step 1: Create Utils Directory (if missing)
Ensure the utilities directory exists:
bash
mkdir -p /workspace/backend/utils
touch /workspace/backend/utils/__init__.py
Step 2: Create the Ticket Parser Module
Create /workspace/backend/utils/ticket_parser.py with the following robust implementation:
python
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
Step 3: Refactor SaleService
Update /workspace/backend/services/sale_service.py to use the new utility.
1. Add Import:
python
from ..utils.ticket_parser import TicketParser
2. Replace parse_tickets Method:
Replace the old manual parsing logic with this cleaner version:
python
def parse_tickets(self, input_text: str, notes: str = None) -> List[Dict]:
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
Step 4: Refactor OffloadService
Update /workspace/backend/services/offload_service.py identically.
1. Add Import:
python
from ..utils.ticket_parser import TicketParser
2. Replace parse_tickets Method:
python
def parse_tickets(self, input_text: str, notes: str = None) -> List[Dict]:
    """
    Parses input text using the centralized TicketParser.
    Returns a list of dictionaries ready for database insertion.
    """
    entries = TicketParser.parse(input_text, notes)
    
    return [
        {'ticket': entry.ticket, 'amount': entry.amount, 'notes': entry.notes}
        for entry in entries
    ]
Step 5: Verify Logic Consistency
Ensure both services now rely entirely on TicketParser.
Delete any leftover parsing code (e.g., manual split('='), float() conversion) from the service files.
Confirm that MIN_AMOUNT, MAX_AMOUNT, and TICKET_LENGTH are no longer hardcoded in the services.
Step 6: Test the Refactor
Run the same test cases as in Task 1.4 to ensure behavior hasn't changed:
Input
Expected Output
123 = 5000
✅ Valid Entry
123 = -100
❌ Skipped
abc = 500
❌ Skipped
12 = 500
❌ Skipped
Advanced Test: Verify that passing notes="Test" attaches the note to all valid entries in the list.
✅ Completion Checklist
utils/ticket_parser.py created with TicketParser class
TicketEntry dataclass defined
SaleService refactored to import and use TicketParser
OffloadService refactored to import and use TicketParser
Duplicate parsing logic removed from both services
Validation rules (min/max amount) centralized
All tests pass with identical results to pre-refactor state
💡 Benefits
Single Source of Truth: Changing the max ticket amount now requires editing only one file.
Type Safety: Using dataclass ensures consistent data structure throughout the app.
Readability: Service methods are now concise and focused on business logic, not string manipulation.
Testability: The parser can now be unit-tested in isolation without mocking database connections.