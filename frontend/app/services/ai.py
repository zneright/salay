from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class AbstractAIService(ABC):
    @abstractmethod
    def generate_chat_response(
        self,
        query: str,
        session_id: str,
        history: Optional[List[Dict[str, str]]] = None,
        model: Optional[str] = "llama3-70b",
        dataset_scope: Optional[str] = "All Datasets (Snowflake Hybrid)",
    ) -> Dict[str, Any]:
        pass




