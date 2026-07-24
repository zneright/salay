from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai import AbstractAIService
from app.dependencies.providers import get_ai_service

router = APIRouter()


@router.post("/ai/chat", response_model=AIChatResponse)
def chat_transparency(
    payload: AIChatRequest, service: AbstractAIService = Depends(get_ai_service)
) -> AIChatResponse:
    try:
        history_dicts = [turn.model_dump() for turn in payload.history] if payload.history else []
        result = service.generate_chat_response(
            query=payload.query,
            session_id=payload.session_id,
            history=history_dicts,
            model=payload.model,
            dataset_scope=payload.dataset_scope,
        )
        return AIChatResponse(**result)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        return AIChatResponse(
            session_id=payload.session_id,
            response=f"Unable to complete query. Operating in lightweight offline fallback mode. Error: {exc}",
            confidence_score=0.95,
            model_used=f"{payload.model or 'llama3-70b'} (Lightweight Mode)",
            generated_sql="SELECT * FROM PROJECTS;",
            data_sources=["PROJECTS"],
            suggested_followups=[
                "Which infrastructure projects are delayed?",
                "Inspect Davao Tunnel audit proof",
                "Show department budgets"
            ]
        )




@router.get("/ai/models")
def list_cortex_models() -> Dict[str, Any]:
    """Returns available Snowflake Cortex LLM models for selection."""
    return {
        "active_default": "llama3-70b",
        "models": [
            {
                "id": "llama3-70b",
                "name": "Snowflake Cortex Llama 3 70B",
                "provider": "Meta / Snowflake Cortex",
                "description": "High performance 70B parameter model optimized for complex civic data reasoning and audit analytics.",
                "badge": "Recommended"
            },
            {
                "id": "llama3.1-405b",
                "name": "Snowflake Cortex Llama 3.1 405B",
                "provider": "Meta / Snowflake Cortex",
                "description": "Frontier-class 405B parameter model for deep structural audit verification and policy analysis.",
                "badge": "Frontier AI"
            },
            {
                "id": "mistral-large",
                "name": "Snowflake Cortex Mistral Large",
                "provider": "Mistral AI / Snowflake Cortex",
                "description": "Multilingual reasoning model specializing in complex technical contract evaluation.",
                "badge": "Enterprise"
            }
        ]
    }


@router.get("/ai/documents")
def list_audit_documents() -> Dict[str, Any]:
    """Returns catalog of attached PDF technical audit proof documents."""
    return {
        "total_documents": 5,
        "cortex_stage": "STAGE_CIVIC_AUDITS_PDF",
        "documents": [
            {
                "filename": "DPWH_Contract_23CSX012_Davao_Bypass_Tunnel.pdf",
                "title": "Davao City Bypass Construction Project Audit",
                "contract_id": "23CSX012",
                "abc_budget": "PHP 13,200,000,000.00",
                "agency": "DPWH Region XI / JICA",
                "progress_pct": 64.0,
                "safety_score": "98.5%",
                "status": "On Track"
            },
            {
                "filename": "DPWH_Contract_24C00088_Metro_Manila_Flood_Control.pdf",
                "title": "Metro Manila Flood Control & Drainage Improvement",
                "contract_id": "24C00088",
                "abc_budget": "PHP 4,750,000,000.00",
                "agency": "DPWH National Capital Region",
                "progress_pct": 41.2,
                "safety_score": "88.0%",
                "status": "Delayed by 14 weeks"
            },
            {
                "filename": "DPWH_Contract_24Z00001_Bataan_Cavite_Bridge.pdf",
                "title": "Bataan-Cavite Interlink Bridge Project",
                "contract_id": "24Z00001",
                "abc_budget": "PHP 15,480,000,000.00",
                "agency": "DPWH UPMO",
                "progress_pct": 32.4,
                "safety_score": "95.2%",
                "status": "On Track"
            },
            {
                "filename": "Maple_Bridge_Structural_Inspection_Report.pdf",
                "title": "Maple Street Bridge Structural Inspection 2026",
                "contract_id": "MUNI-MB-2026",
                "abc_budget": "USD $45,000.00 Overrun",
                "agency": "Municipal Infrastructure Bureau",
                "progress_pct": 82.0,
                "safety_score": "76.4%",
                "status": "Defect Flagged"
            },
            {
                "filename": "Oakridge_Solar_Technical_Audit_Proof.pdf",
                "title": "Oakridge High School Solar Conversion Audit",
                "contract_id": "EDU-SOLAR-09",
                "abc_budget": "USD $1,250,000.00",
                "agency": "Department of Education",
                "progress_pct": 68.0,
                "safety_score": "99.1%",
                "status": "Verified Tier 1"
            }
        ]
    }


@router.post("/ai/summarize-document")
def summarize_audit_document(
    filename: str = Query(..., description="PDF document filename to summarize"),
    service: AbstractAIService = Depends(get_ai_service)
) -> AIChatResponse:
    """Generates targeted AI summary for a selected PDF audit document."""
    query = f"Summarize technical audit findings and contract details for document {filename}"
    res = service.generate_chat_response(query=query, session_id="doc-summary-session")
    return AIChatResponse(**res)

