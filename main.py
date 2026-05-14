import webview
import os
from backend.database.manager import DatabaseManager
from backend.services.draw_service import DrawService

class API:
    def __init__(self):
        self.db = DatabaseManager()
        self.draw_service = DrawService(self.db)

    def hello(self):
        return "Hello from Python!"

    def get_draws(self):
        # Refresh statuses before returning
        self.draw_service.update_statuses()
        return self.draw_service.get_all_draws()

    def create_draw(self, data):
        return self.draw_service.create_draw(
            data['draw_date'], 
            data['cutoff_time'], 
            data.get('notes')
        )
    
    def settle_draw(self, draw_id):
        return self.draw_service.settle_draw(draw_id)

def main():
    api = API()
    # In development, we load the Vite dev server
    # In production, we would load the index.html from dist
    window = webview.create_window(
        'Vanguard 3D',
        'http://localhost:5173',
        js_api=api
    )
    webview.start()

if __name__ == '__main__':
    main()
