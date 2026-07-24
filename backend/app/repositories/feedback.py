import datetime
from abc import ABC, abstractmethod
from typing import List, Dict, Any


class AbstractFeedbackRepository(ABC):
    @abstractmethod
    def save_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_all_feedback(self) -> List[Dict[str, Any]]:
        pass

