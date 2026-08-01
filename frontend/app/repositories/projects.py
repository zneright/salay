from abc import ABC, abstractmethod
from typing import List, Dict, Any


class AbstractProjectRepository(ABC):
    @abstractmethod
    def get_all_projects(self, department: str = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        pass

    @abstractmethod
    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

