import random
from typing import List, Dict, Any
from app.repositories.projects import AbstractProjectRepository
from app.db.snowflake import execute_snowflake_query, execute_snowflake_write


class SnowflakeProjectRepository(AbstractProjectRepository):
    def get_all_projects(self, department: str = None) -> List[Dict[str, Any]]:
        query = "SELECT ID, TITLE, DEPARTMENT, BUDGET, STATUS, LOCATION, TIMELINE, PROGRESS FROM PROJECTS"
        params = ()

        if department:
            query += " WHERE LOWER(DEPARTMENT) LIKE %s"
            params = (f"%{department.lower()}%",)

        query += " ORDER BY ID ASC"

        rows = execute_snowflake_query(query, params)
        projects: List[Dict[str, Any]] = []

        for row in rows:
            projects.append(
                {
                    "id": row.get("id", ""),
                    "title": row.get("title", ""),
                    "department": row.get("department", ""),
                    "budget": float(row.get("budget", 0.0)),
                    "status": row.get("status", ""),
                    "location": row.get("location", ""),
                    "timeline": row.get("timeline", ""),
                    "progress": int(row.get("progress", 0)),
                }
            )

        return projects

    def get_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        query = (
            "SELECT ID, TITLE, DEPARTMENT, BUDGET, STATUS, LOCATION, TIMELINE, PROGRESS "
            "FROM PROJECTS WHERE LOWER(ID) = %s"
        )
        rows = execute_snowflake_query(query, (project_id.lower(),))

        if not rows:
            return None

        row = rows[0]
        return {
            "id": row.get("id", ""),
            "title": row.get("title", ""),
            "department": row.get("department", ""),
            "budget": float(row.get("budget", 0.0)),
            "status": row.get("status", ""),
            "location": row.get("location", ""),
            "timeline": row.get("timeline", ""),
            "progress": int(row.get("progress", 0)),
        }

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        project_id = project_data.get("id") or f"PRJ-{random.randint(1000, 9999)}"
        query = (
            "INSERT INTO PROJECTS (ID, TITLE, DEPARTMENT, BUDGET, STATUS, LOCATION, TIMELINE, PROGRESS) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        )
        params = (
            project_id,
            project_data.get("title", ""),
            project_data.get("department", "Public Works & Engineering"),
            float(project_data.get("budget", 0.0)),
            project_data.get("status", "Planned"),
            project_data.get("location", "Ward 4"),
            project_data.get("timeline", "2026"),
            int(project_data.get("progress", 0)),
        )

        execute_snowflake_write(query, params)

        return {
            "id": project_id,
            "title": project_data.get("title", ""),
            "department": project_data.get("department", "Public Works & Engineering"),
            "budget": float(project_data.get("budget", 0.0)),
            "status": project_data.get("status", "Planned"),
            "location": project_data.get("location", "Ward 4"),
            "timeline": project_data.get("timeline", "2026"),
            "progress": int(project_data.get("progress", 0)),
        }

