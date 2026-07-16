from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.repositories.projects import AbstractProjectRepository

class AbstractProjectService(ABC):
    @abstractmethod
    def retrieve_projects(self, department: str = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def retrieve_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        pass

class MockProjectService(AbstractProjectService):
    def __init__(self, repository: AbstractProjectRepository) -> None:
        self._repository = repository

    def retrieve_projects(self, department: str = None) -> List[Dict[str, Any]]:
        return self._repository.get_all_projects(department)

    def retrieve_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        return self._repository.get_project_by_id(project_id)
