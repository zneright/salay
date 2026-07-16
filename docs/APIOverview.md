# API Endpoint Overview & Specifications

This document outlines the REST API contracts, routes, and JSON schemas implemented by the FastAPI backend (Version 1).

---

## 🟢 1. System Endpoints

### Health Check
*   **Path**: `/api/v1/health`
*   **Method**: `GET`
*   **Description**: Verifies API operational status and system diagnostics.
*   **Response (`200 OK`)**:
    ```json
    {
      "status": "OK",
      "timestamp": "2026-07-17T02:15:47Z",
      "environment": "development"
    }
    ```

### System Version
*   **Path**: `/api/v1/version`
*   **Method**: `GET`
*   **Description**: Returns active software release and git commits references.
*   **Response (`200 OK`)**:
    ```json
    {
      "version": "0.1.0",
      "roadmap_phase": "Phase 2 - Scaffolding"
    }
    ```

---

## 🏗️ 2. Public Works Projects Endpoints

### List Public Projects
*   **Path**: `/api/v1/projects`
*   **Method**: `GET`
*   **Description**: Retrieves civic infrastructure projects. Can filter by department or status.
*   **Response (`200 OK`)**:
    ```json
    [
      {
        "id": "PRJ-8812",
        "title": "Oakridge High School Solar Retrofit",
        "department": "Public Works & Infrastructure",
        "budget": 1250000.00,
        "status": "In Progress",
        "start_date": "2025-03-01",
        "completion_date": "2026-11-15"
      }
    ]
    ```

---

## 💰 3. Municipal Budget Endpoints

### Get Budget Allocations
*   **Path**: `/api/v1/budgets/summary`
*   **Method**: `GET`
*   **Description**: Aggregates budget numbers by municipal department for dashboard visualizations.
*   **Response (`200 OK`)**:
    ```json
    {
      "fiscal_year": 2026,
      "total_budget": 45000000.00,
      "allocations": [
        { "department": "Education", "allocated": 18000000.00, "spent": 12400000.00 },
        { "department": "Public Safety", "allocated": 12000000.00, "spent": 8100000.00 },
        { "department": "Infrastructure & Transit", "allocated": 10000000.00, "spent": 9500000.00 }
      ]
    }
    ```

---

## 💬 4. Citizen Feedback & Complaints Endpoints

### Submit Citizen Report
*   **Path**: `/api/v1/feedback/submit`
*   **Method**: `POST`
*   **Description**: Accepts geotagged citizen complaints or reviews regarding public services.
*   **Request Payload**:
    ```json
    {
      "report_type": "Pothole",
      "address": "452 Pine Street, Metro City",
      "description": "Deep pothole blocking the southbound bicycle lane.",
      "citizen_contact": "citizen@gmail.com"
    }
    ```
*   **Response (`201 Created`)**:
    ```json
    {
      "ticket_id": "TCK-9903",
      "status": "Open",
      "submitted_at": "2026-07-17T02:15:47Z"
    }
    ```

---

## 🧠 5. AI Cortex transparency Chat Endpoints

### Send Message
*   **Path**: `/api/v1/ai/chat`
*   **Method**: `POST`
*   **Description**: Resolves questions regarding civic transparency reports using Snowflake Cortex search indexes.
*   **Request Payload**:
    ```json
    {
      "session_id": "sess-4401",
      "query": "Where was the 2025 education budget spent?"
    }
    ```
*   **Response (`200 OK`)**:
    ```json
    {
      "session_id": "sess-4401",
      "response": "According to the municipal budget log, $18,000,000 was allocated to Education. Major expenditures included the Oakridge School renovation and upgrades to school transportation networks.",
      "confidence_score": 0.94
    }
    ```

---

## ❌ 6. Global Error Specifications

When a route encounters an error, the API returns a structured error object.

### Validation Failure (`400 Bad Request`)
```json
{
  "error_code": "VALIDATION_FAILED",
  "message": "Invalid input formatting detected.",
  "details": [
    { "field": "citizen_contact", "issue": "Must be a valid email address." }
  ]
}
```

### Entity Not Found (`404 Not Found`)
```json
{
  "error_code": "ENTITY_NOT_FOUND",
  "message": "Project PRJ-9999 could not be resolved."
}
```

### Server Error (`500 Internal Server Error`)
```json
{
  "error_code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected server condition occurred."
}
```
