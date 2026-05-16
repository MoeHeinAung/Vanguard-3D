from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, TypeVar

T = TypeVar('T')

class BaseRepository(ABC):
    """
    Abstract interface for all data repositories.
    Ensures consistent data access patterns regardless of underlying DB.
    """
    
    @abstractmethod
    def find_all(self, order_by: str = 'created_at DESC') -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def find_by_id(self, entity_id: Any) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create(self, data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def update(self, entity_id: Any, data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def delete(self, entity_id: Any) -> bool:
        pass
