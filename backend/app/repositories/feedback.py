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


class MockFeedbackRepository(AbstractFeedbackRepository):
    def __init__(self) -> None:
        self._feedbacks = [
            {
                "id": "TCK-2201",
                "type": "Transit Delay / Traffic Control",
                "location": "Oakridge Blvd & 5th Ave Intersection",
                "description": "The traffic signal timing is causing massive backups during construction of the high school solar installation.",
                "submittedAt": "2026-07-16",
                "status": "Under Investigation",
            },
            {
                "id": "TCK-1982",
                "type": "Road Maintenance / Pothole",
                "location": "124 Maple Street, East Ward",
                "description": "Huge pothole in front of the bridge crossing causing safety hazards for cycling commuters.",
                "submittedAt": "2026-07-12",
                "status": "Resolved",
            },
        ]

    def save_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        ticket_id = f"TCK-{len(self._feedbacks) + 1000 + 1}"
        new_entry = {
            "id": ticket_id,
            "type": feedback_data["report_type"],
            "location": feedback_data["address"],
            "description": feedback_data["description"],
            "submittedAt": datetime.date.today().isoformat(),
            "status": "Open",
        }
        self._feedbacks.insert(0, new_entry)
        return new_entry

    def get_all_feedback(self) -> List[Dict[str, Any]]:
        return self._feedbacks
