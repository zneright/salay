import datetime
import random
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, EmailStr
from app.db.snowflake import execute_snowflake_query, execute_snowflake_write

logger = logging.getLogger("civic_api")
router = APIRouter()

# In-memory session cache
USER_DB: Dict[str, Dict[str, Any]] = {}


def _save_user_to_snowflake(user: Dict[str, Any]) -> None:
    """Writes user entry into Snowflake USERS table."""
    try:
        conn = get_snowflake_connection()
        if not conn:
            logger.warning("Could not persist user to Snowflake: Connection failed")
            return

        cursor = conn.cursor()

        # Create USERS table if it doesn't exist
        create_sql = (
            "CREATE TABLE IF NOT EXISTS USERS ("
            "ID VARCHAR(64) PRIMARY KEY, "
            "FULL_NAME VARCHAR(255) NOT NULL, "
            "EMAIL VARCHAR(255) NOT NULL UNIQUE, "
            "PASSWORD VARCHAR(255) NOT NULL, "
            "ROLE VARCHAR(64) NOT NULL DEFAULT 'Citizen', "
            "ORGANIZATION VARCHAR(255) DEFAULT 'Metro City Municipality', "
            "ACCOUNT_STATUS VARCHAR(64) DEFAULT 'Active', "
            "CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()"
            ")"
        )
        cursor.execute(create_sql)

        # Delete existing row if exists then insert
        del_sql = "DELETE FROM USERS WHERE LOWER(EMAIL) = %s"
        cursor.execute(del_sql, (user.get("email", "").lower().strip(),))

        insert_sql = (
            "INSERT INTO USERS (ID, FULL_NAME, EMAIL, PASSWORD, ROLE, ORGANIZATION, ACCOUNT_STATUS) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        params = (
            user.get("id"),
            user.get("fullName"),
            user.get("email"),
            user.get("password", "password123"),
            user.get("role", "Citizen"),
            user.get("organization", "Metro City Municipality"),
            user.get("account_status", "Active"),
        )
        cursor.execute(insert_sql, params)
        conn.commit()

        cursor.close()
        conn.close()
        logger.info(f"User {user.get('email')} successfully saved to Snowflake USERS table.")
    except Exception as exc:
        logger.warning(f"Could not persist user to Snowflake USERS table: {exc}")


def _get_user_from_snowflake(email: str) -> Optional[Dict[str, Any]]:
    """Retrieves user row from Snowflake USERS table."""
    try:
        query = "SELECT ID, FULL_NAME, EMAIL, PASSWORD, ROLE, ORGANIZATION, ACCOUNT_STATUS, CREATED_AT FROM USERS WHERE LOWER(EMAIL) = %s"
        rows = execute_snowflake_query(query, (email.lower().strip(),))
        if rows:
            row = rows[0]
            return {
                "id": row.get("id", ""),
                "fullName": row.get("full_name", ""),
                "email": row.get("email", ""),
                "password": row.get("password", ""),
                "role": row.get("role", "Citizen"),
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                "organization": row.get("organization", "Metro City Municipality"),
                "account_status": row.get("account_status", "Active"),
                "createdAt": str(row.get("created_at", "")),
            }
    except Exception as exc:
        logger.warning(f"Could not fetch user from Snowflake: {exc}")
    return None


class RegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: Optional[str] = None
    role: Optional[str] = "Citizen"
    organization: Optional[str] = "Metro City Municipality"


class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = None


class OnboardingRequest(BaseModel):
    email: EmailStr
    role: str
    organization: str


class ApproveUserRequest(BaseModel):
    email: EmailStr
    action: str  # "approve" or "reject"


@router.get("/auth/register")
def register_get():
    return {"message": "Please submit a POST request to /api/v1/auth/register with JSON body {'fullName': '...', 'email': '...', 'password': '...'}"}


@router.post("/auth/register")
def register_user(req: RegisterRequest, background_tasks: BackgroundTasks):

    email = req.email.lower().strip()
    role = req.role or "Citizen"
    
    needs_approval = role in ["Government Official", "Auditor"]
    account_status = "Pending Approval" if needs_approval else "Active"

    existing_user = _get_user_from_snowflake(email) or USER_DB.get(email)

    if existing_user:
        user = existing_user
        user["fullName"] = req.fullName
        user["role"] = role
        if req.organization:
            user["organization"] = req.organization
        user["account_status"] = account_status
        USER_DB[email] = user
        background_tasks.add_task(_save_user_to_snowflake, user)
        return {
            "user": user,
            "token": f"bearer-{user['id']}",
            "requires_approval": needs_approval and user["account_status"] == "Pending Approval",
            "message": "Account updated in Snowflake DB. Pending Administrator approval." if needs_approval else "Account updated in Snowflake DB.",
        }

    new_user = {
        "id": f"USR-{random.randint(1000, 9999)}",
        "fullName": req.fullName,
        "email": email,
        "password": req.password or "password123",
        "role": role,
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        "organization": req.organization or "Metro City Municipality",
        "account_status": account_status,
        "createdAt": datetime.date.today().isoformat(),
    }
    USER_DB[email] = new_user
    background_tasks.add_task(_save_user_to_snowflake, new_user)

    return {
        "user": new_user,
        "token": f"bearer-{new_user['id']}",
        "requires_approval": needs_approval,
        "message": f"Registration saved to Snowflake USERS table! Role '{role}' requires Administrator approval before login." if needs_approval else "Registration successful and saved to Snowflake DB!",
    }


@router.get("/auth/login")
def login_get():
    return {"message": "Please submit a POST request to /api/v1/auth/login with JSON body {'email': '...', 'password': '...'}"}


@router.post("/auth/login")
def login_user(req: LoginRequest):
    email = req.email.lower().strip()
    user = _get_user_from_snowflake(email) or USER_DB.get(email)

    if user:
        USER_DB[email] = user
        if (
            req.password
            and user.get("password")
            and req.password != user.get("password")
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password for this registered account.",
            )

        if user.get("account_status") == "Pending Approval":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Your account (Role: {user['role']}) is pending Administrator approval.",
            )

        if user.get("account_status") == "Rejected":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: Your account request was rejected by Administrator.",
            )

        return {"user": user, "token": f"bearer-{user['id']}"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Account not found. Please register your account first.",
    )



@router.get("/auth/pending-users")
def get_pending_users():
    """Retrieve all accounts requiring Administrator approval."""
    try:
        query = "SELECT ID, FULL_NAME, EMAIL, ROLE, ORGANIZATION, ACCOUNT_STATUS, CREATED_AT FROM USERS"
        rows = execute_snowflake_query(query)
        if rows:
            all_users = [
                {
                    "id": r.get("id", ""),
                    "fullName": r.get("full_name", ""),
                    "email": r.get("email", ""),
                    "role": r.get("role", "Citizen"),
                    "organization": r.get("organization", "Metro City Municipality"),
                    "account_status": r.get("account_status", "Active"),
                    "createdAt": str(r.get("created_at", "")),
                }
                for r in rows
            ]
            pending = [u for u in all_users if u.get("account_status") == "Pending Approval"]
            return {
                "pending_count": len(pending),
                "pending_users": pending,
                "all_users": all_users,
            }
    except Exception:
        pass

    pending = [u for u in USER_DB.values() if u.get("account_status") == "Pending Approval"]
    all_users = list(USER_DB.values())
    return {
        "pending_count": len(pending),
        "pending_users": pending,
        "all_users": all_users,
    }


@router.post("/auth/approve-user")
def approve_or_reject_user(req: ApproveUserRequest, background_tasks: BackgroundTasks):
    """Administrator endpoint to approve or reject Official & Auditor account requests."""
    email = req.email.lower().strip()
    user = _get_user_from_snowflake(email) or USER_DB.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target user account not found.",
        )

    if req.action.lower() == "approve":
        user["account_status"] = "Active"
        action_text = "Approved"
    else:
        user["account_status"] = "Rejected"
        action_text = "Rejected"

    USER_DB[email] = user
    background_tasks.add_task(_save_user_to_snowflake, user)

    return {
        "message": f"User account {email} ({user['role']}) has been {action_text} in Snowflake DB.",
        "user": user,
    }


@router.post("/auth/onboarding")
def update_onboarding(req: OnboardingRequest, background_tasks: BackgroundTasks):
    email = req.email.lower().strip()
    user = _get_user_from_snowflake(email) or USER_DB.get(email)
    if user:
        user["role"] = req.role
        user["organization"] = req.organization
        USER_DB[email] = user
        background_tasks.add_task(_save_user_to_snowflake, user)
        return {"user": user}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
