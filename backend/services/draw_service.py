from datetime import datetime
from backend.repositories.draw_repository import DrawRepository

class DrawService:
    def __init__(self, draw_repo: DrawRepository):
        self.repo = draw_repo

    def create_draw(self, draw_date, cutoff_time, notes=None):
        """
        Creates a new draw. Initial status is 'Open'.
        Enforces that only one draw can be 'Open' at a time.
        """
        if self.repo.get_open_draw_count() > 0:
            raise ValueError("An open draw already exists. Please close or settle it before creating a new one.")

        data = {
            'draw_date': draw_date,
            'cutoff_time': cutoff_time,
            'status': 'Open',
            'notes': notes
        }
        return self.repo.create(data)

    def get_all_draws(self):
        """Retrieves all draws from the repository."""
        return self.repo.find_all()

    def update_statuses(self):
        """
        Updates 'Open' draws to 'Closed' if the current time has passed the cutoff.
        """
        now = datetime.now()
        current_date = now.strftime('%Y-%m-%d')
        current_time = now.strftime('%H:%M:%S')
        
        return self.repo.bulk_close_draws(current_date, current_time)

    def edit_draw(self, draw_id, data):
        """Updates an existing draw. Validates that the draw exists."""
        draw = self.repo.find_by_id(draw_id)
        if not draw:
            raise ValueError("Draw not found.")
        
        # Only allow editing if not settled
        if draw.get('status') == 'Settled':
            raise ValueError("Cannot edit a settled draw.")
            
        return self.repo.update(draw_id, data)

    def delete_draw(self, draw_id):
        """Deletes a draw. Only allowed if not 'Closed' or 'Settled'."""
        draw = self.repo.find_by_id(draw_id)
        if not draw:
            raise ValueError("Draw not found.")
        
        if draw.get('status') in ['Closed', 'Settled']:
            raise ValueError(f"Cannot delete a draw with status '{draw.get('status')}'.")
            
        return self.repo.delete(draw_id)

    def update_status(self, draw_id, new_status):
        """Manually updates draw status with basic validation."""
        draw = self.repo.find_by_id(draw_id)
        if not draw:
            raise ValueError("Draw not found.")
        
        # Prevent manual changes to Settled status (must use settle_draw)
        if new_status == 'Settled':
            raise ValueError("Use settle_draw() to change status to Settled.")
        
        return self.repo.update_draw_status(draw_id, new_status)

    def settle_draw(self, draw_id):
        """Sets a draw status to 'Settled'. Only allowed if current status is 'Closed'."""
        draw = self.repo.find_by_id(draw_id)
        if not draw:
            raise ValueError("Draw not found.")
        
        if draw.get('status') != 'Closed':
            raise ValueError(f"Cannot settle draw with status '{draw.get('status')}'. Only 'Closed' draws can be settled.")

        return self.repo.update_draw_status(draw_id, 'Settled')
