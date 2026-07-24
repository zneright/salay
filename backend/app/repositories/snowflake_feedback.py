import datetime
import random
from typing import List, Dict, Any
from app.repositories.feedback import AbstractFeedbackRepository
from app.db.snowflake import execute_snowflake_query, execute_snowflake_write


class SnowflakeFeedbackRepository(AbstractFeedbackRepository):
    def save_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        ticket_id = f"TCK-{random.randint(2300, 9999)}"
        submitted_at = datetime.date.today().isoformat()

        query = (
            "INSERT INTO FEEDBACK_REPORTS (ID, REPORT_TYPE, LOCATION, DESCRIPTION, STATUS, SUBMITTED_AT) "
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )
        params = (
            ticket_id,
            feedback_data.get("report_type", ""),
            feedback_data.get("address", ""),
            feedback_data.get("description", ""),
            "Open",
            submitted_at,
        )

        execute_snowflake_write(query, params)

        return {
            "id": ticket_id,
            "type": feedback_data.get("report_type", ""),
            "location": feedback_data.get("address", ""),
            "description": feedback_data.get("description", ""),
            "submittedAt": submitted_at,
            "status": "Open",
        }

    def get_all_feedback(self) -> List[Dict[str, Any]]:
        query = (
            "SELECT ID, REPORT_TYPE, LOCATION, DESCRIPTION, STATUS, SUBMITTED_AT "
            "FROM FEEDBACK_REPORTS ORDER BY CREATED_AT DESC"
        )
        rows = execute_snowflake_query(query)

        feedbacks: List[Dict[str, Any]] = []
        for row in rows:
            feedbacks.append(
                {
                    "id": row.get("id", ""),
                    "type": row.get("report_type", ""),
                    "location": row.get("location", ""),
                    "description": row.get("description", ""),
                    "submittedAt": str(row.get("submitted_at", "")),
                    "status": row.get("status", "Open"),
                }
            )

        return feedbacks
