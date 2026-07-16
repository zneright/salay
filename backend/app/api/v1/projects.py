from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.projects import ProjectResponse
from app.services.projects import AbstractProjectService
from app.dependencies.providers import get_project_service

router = APIRouter()


@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(
    department: str = None,
    service: AbstractProjectService = Depends(get_project_service),
) -> List[ProjectResponse]:
    return service.retrieve_projects(department)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str, service: AbstractProjectService = Depends(get_project_service)
) -> ProjectResponse:
    project = service.retrieve_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' could not be resolved.",
        )
    return project
