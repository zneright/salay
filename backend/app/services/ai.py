from abc import ABC, abstractmethod
from typing import Dict, Any

class AbstractAIService(ABC):
    @abstractmethod
    def generate_chat_response(self, query: str, session_id: str) -> Dict[str, Any]:
        pass

class MockAIService(AbstractAIService):
    def __init__(self) -> None:
        pass

    def generate_chat_response(self, query: str, session_id: str) -> Dict[str, Any]:
        query_lower = query.lower()
        confidence = 0.92
        
        if "solar" in query_lower or "oakridge" in query_lower:
            response = (
                "The 'Oakridge High School Solar Retrofit' is located in Ward 4 (North Metro) "
                "under the Energy & Environment department. It has a budget of $1,250,000.00 "
                "and is currently 68% complete."
            )
            confidence = 0.98
        elif "feedback" in query_lower or "pothole" in query_lower:
            response = (
                "Our citizen reports registry records 2 active tickets. This includes 1 open "
                "road maintenance ticket at 124 Maple Street, East Ward. Sentiment analysis "
                "maps to negative due to delay reports."
            )
            confidence = 0.89
        elif "projects" in query_lower or "works" in query_lower:
            response = (
                "There are currently 4 recorded Public Works projects in Metro City. "
                "1 is Completed, 2 are In Progress or Delayed, and 1 is Planned."
            )
            confidence = 0.95
        else:
            response = (
                f"Regarding '{query}': Active database records do not match this query parameters. "
                "Overall municipal budget registry contains $45,000,000 allocated for FY-2026. "
                "Please specify department, project name, or region details."
            )
            
        return {
            "session_id": session_id,
            "response": response,
            "confidence_score": confidence
        }
