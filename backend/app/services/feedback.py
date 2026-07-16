from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.repositories.feedback import AbstractFeedbackRepository


class AbstractFeedbackService(ABC):
    @abstractmethod
    def create_report(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def retrieve_all_reports(self) -> List[Dict[str, Any]]:
        pass


class MockFeedbackService(AbstractFeedbackService):
    def __init__(self, repository: AbstractFeedbackRepository) -> None:
        self._repository = repository

    def create_report(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        return self._repository.save_feedback(feedback_data)

    def retrieve_all_reports(self) -> List[Dict[str, Any]]:
        return self._repository.get_all_feedback()
