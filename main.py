import webview
import os
import sys
from backend.database.manager import DatabaseManager
from backend.services.draw_service import DrawService
from backend.services.agent_service import AgentService
from backend.services.master_dealer_service import MasterDealerService
from backend.services.sale_service import SaleService

class API:
    def __init__(self):
        self.db = DatabaseManager()
        self.draw_service = DrawService(self.db)
        self.agent_service = AgentService(self.db)
        self.md_service = MasterDealerService(self.db)
        self.sale_service = SaleService(self.db)

    # Draws
    def hello(self):
        return "Hello from Python!"

    def get_draws(self):
        try:
            self.draw_service.update_statuses()
            return self.draw_service.get_all_draws()
        except Exception as e:
            print(f"Error in get_draws: {e}", file=sys.stderr)
            raise e

    def create_draw(self, data):
        try:
            return self.draw_service.create_draw(
                data['draw_date'], 
                data['cutoff_time'], 
                data.get('notes')
            )
        except Exception as e:
            print(f"Error in create_draw: {e}", file=sys.stderr)
            raise e
    
    def settle_draw(self, draw_id):
        try:
            return self.draw_service.settle_draw(draw_id)
        except Exception as e:
            print(f"Error in settle_draw: {e}", file=sys.stderr)
            raise e

    # Agents
    def get_agents(self):
        try:
            return self.agent_service.get_all_agents()
        except Exception as e:
            print(f"Error in get_agents: {e}", file=sys.stderr)
            raise e

    def create_agent(self, data):
        try:
            return self.agent_service.create_agent(
                data['id'], data['name'], data['commission'], 
                data['jp_factor'], data['sp_factor'], data.get('notes')
            )
        except Exception as e:
            print(f"Error in create_agent: {e}", file=sys.stderr)
            raise e

    def update_agent(self, data):
        try:
            return self.agent_service.update_agent(
                data['id'], data['name'], data['commission'], 
                data['jp_factor'], data['sp_factor'], data.get('notes')
            )
        except Exception as e:
            print(f"Error in update_agent: {e}", file=sys.stderr)
            raise e

    def delete_agent(self, agent_id):
        try:
            return self.agent_service.delete_agent(agent_id)
        except Exception as e:
            print(f"Error in delete_agent: {e}", file=sys.stderr)
            raise e

    # Master Dealers
    def get_master_dealers(self):
        try:
            return self.md_service.get_all_master_dealers()
        except Exception as e:
            print(f"Error in get_master_dealers: {e}", file=sys.stderr)
            raise e

    def create_master_dealer(self, data):
        try:
            return self.md_service.create_master_dealer(
                data['id'], data['name'], data['commission'], 
                data['jp_factor'], data['sp_factor'], data.get('notes')
            )
        except Exception as e:
            print(f"Error in create_master_dealer: {e}", file=sys.stderr)
            raise e

    def update_master_dealer(self, data):
        try:
            return self.md_service.update_master_dealer(
                data['id'], data['name'], data['commission'], 
                data['jp_factor'], data['sp_factor'], data.get('notes')
            )
        except Exception as e:
            print(f"Error in update_master_dealer: {e}", file=sys.stderr)
            raise e

    def delete_master_dealer(self, md_id):
        try:
            return self.md_service.delete_master_dealer(md_id)
        except Exception as e:
            print(f"Error in delete_master_dealer: {e}", file=sys.stderr)
            raise e

    # Sales
    def get_sales(self):
        try:
            return self.sale_service.get_sales()
        except Exception as e:
            print(f"Error in get_sales: {e}", file=sys.stderr)
            raise e

    def create_sales(self, data):
        try:
            return self.sale_service.create_sales(
                data['draw_id'], data['agent_id'], data['input_text'], data.get('notes')
            )
        except Exception as e:
            print(f"Error in create_sales: {e}", file=sys.stderr)
            raise e

def main():
    api = API()
    # In development, we load the Vite dev server
    # In production, we would load the index.html from dist
    window = webview.create_window(
        'Vanguard 3D',
        'http://localhost:5173',
        js_api=api
    )
    webview.start(debug=True)

if __name__ == '__main__':
    main()
