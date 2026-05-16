from backend.repositories.master_dealer_repository import MasterDealerRepository

class MasterDealerService:
    def __init__(self, md_repo: MasterDealerRepository):
        self.repo = md_repo

    def get_all_master_dealers(self, order_by='created_at DESC'):
        return self.repo.find_all(order_by=order_by)

    def create_master_dealer(self, id, name, commission, jp_factor, sp_factor, notes=None):
        data = {
            'id': id,
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        }
        return self.repo.create(data)

    def update_master_dealer(self, id, name, commission, jp_factor, sp_factor, notes=None):
        data = {
            'name': name,
            'commission': commission,
            'jp_factor': jp_factor,
            'sp_factor': sp_factor,
            'notes': notes
        }
        return self.repo.update(id, data)

    def delete_master_dealer(self, id):
        return self.repo.delete(id)
