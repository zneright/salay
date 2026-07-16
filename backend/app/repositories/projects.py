from abc import ABC, abstractmethod
from typing import List, Dict, Any


class AbstractProjectRepository(ABC):
    @abstractmethod
    def get_all_projects(self, department: str = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        pass


class MockProjectRepository(AbstractProjectRepository):
    def __init__(self) -> None:
        # Mock database collection representing Public Works Projects
        self._projects = [
            {
                "id": "PRJ-8812",
                "title": "Oakridge High School Solar Retrofit",
                "department": "Energy & Environment",
                "budget": 1250000.00,
                "status": "In Progress",
                "location": "Ward 4 (North Metro)",
                "timeline": "Mar 2025 - Nov 2026",
                "progress": 68,
            },
            {
                "id": "PRJ-1024",
                "title": "Metro Transit Line-C Bus Lane Expansion",
                "department": "Infrastructure & Transit",
                "budget": 3400000.00,
                "status": "Completed",
                "location": "Downtown Core",
                "timeline": "Jan 2024 - Jun 2025",
                "progress": 100,
            },
            {
                "id": "PRJ-9904",
                "title": "Maple Street Bridge Safety Reconstruction",
                "department": "Public Works & Engineering",
                "budget": 4800000.00,
                "status": "Delayed",
                "location": "East Ward District",
                "timeline": "Sep 2024 - Dec 2026",
                "progress": 42,
            },
            {
                "id": "PRJ-7711",
                "title": "District 3 Smart Water Valve Integration",
                "department": "Utilities & Sanitation",
                "budget": 850000.00,
                "status": "Planned",
                "location": "District 3 Subdivisions",
                "timeline": "Aug 2026 - Mar 2027",
                "progress": 0,
            },
        ]

    def get_all_projects(self, department: str = None) -> List[Dict[str, Any]]:
        if department:
            return [
                p
                for p in self._projects
                if department.lower() in p["department"].lower()
            ]
        return self._projects

    def get_project_by_id(self, project_id: str) -> Dict[str, Any] | None:
        for p in self._projects:
            if p["id"].lower() == project_id.lower():
                return p
        return None
