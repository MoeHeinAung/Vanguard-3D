from backend.repositories.agent_repository import AgentRepository

class AgentService:
    def __init__(self, agent_repo: AgentRepository):
        self.repo = agent_repo

    def get_all_agents(self, order_by='created_at DESC'):
        return self.repo.find_all(order_by=order_by)

    def create_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        data = {
            'id': id,
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        }
        return self.repo.create(data)

    def update_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        data = {
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        }
        return self.repo.update(id, data)

    def delete_agent(self, id):
        return self.repo.delete(id)
