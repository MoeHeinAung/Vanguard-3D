from .base_service import BaseEntityService

class AgentService(BaseEntityService):
    def __init__(self, db_manager):
        super().__init__(db_manager, table_name='agents', id_field='id')

    def get_all_agents(self, order_by='created_at DESC'):
        return self.get_all(order_by=order_by)

    def create_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        return self.create({
            'id': id,
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        })

    def update_agent(self, id, name, commission, jp_factor, sp_factor, notes=None):
        return self.update(id, {
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        })

    def delete_agent(self, id):
        return self.delete(id)
