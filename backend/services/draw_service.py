from datetime import datetime
from backend.repositories.draw_repository import DrawRepository

class DrawService:
    def __init__(self, draw_repo: DrawRepository):
        self.repo = draw_repo

    def create_draw(self, draw_date, cutoff_time, notes=None):
        """
        Creates a new draw. Initial status is 'Open'.
        """
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

    def settle_draw(self, draw_id):
        """Sets a draw status to 'Settled'."""
        return self.repo.update_draw_status(draw_id, 'Settled')
