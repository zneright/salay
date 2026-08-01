import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("civic_api")

try:
    import snowflake.connector

    HAS_SNOWFLAKE_CONNECTOR = True
except Exception as exc:
    logger.warning(f"snowflake.connector import failed: {exc}")
    HAS_SNOWFLAKE_CONNECTOR = False


import time

_LAST_CONNECTION_FAILURE_TIME = 0.0
_FAILURE_CACHE_TTL = 30.0


def is_snowflake_configured() -> bool:
    """Check whether mandatory Snowflake environment configuration keys are provided."""
    return bool(
        settings.SNOWFLAKE_ACCOUNT
        and settings.SNOWFLAKE_USER
        and settings.SNOWFLAKE_PASSWORD
    )


def get_snowflake_connection() -> Optional[Any]:
    """Establishes and returns a live Snowflake connection if configured, or None."""
    global _LAST_CONNECTION_FAILURE_TIME

    if not HAS_SNOWFLAKE_CONNECTOR:
        logger.warning("snowflake-connector-python package is not installed.")
        return None

    if not is_snowflake_configured():
        logger.warning("Snowflake credentials unconfigured.")
        return None

    # Skip repeated connection attempts if a failure occurred recently
    if time.time() - _LAST_CONNECTION_FAILURE_TIME < _FAILURE_CACHE_TTL:
        return None

    try:
        conn = snowflake.connector.connect(
            user=settings.SNOWFLAKE_USER,
            password=settings.SNOWFLAKE_PASSWORD,
            account=settings.SNOWFLAKE_ACCOUNT,
            warehouse=settings.SNOWFLAKE_WAREHOUSE or "COMPUTE_WH",
            database=settings.SNOWFLAKE_DATABASE or "CIVIC_TRANSPARENCY_DB",
            schema=settings.SNOWFLAKE_SCHEMA or "PUBLIC",
            role=settings.SNOWFLAKE_ROLE or None,
            connect_timeout=2,
        )
        return conn
    except Exception as exc:
        _LAST_CONNECTION_FAILURE_TIME = time.time()
        logger.error(f"Failed to connect to Snowflake: {exc}")
        return None



def execute_snowflake_query(
    query: str, params: Optional[Any] = None
) -> List[Dict[str, Any]]:
    """Executes a SQL query against Snowflake and returns rows as a list of dicts."""
    conn = get_snowflake_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(snowflake.connector.DictCursor)
        cursor.execute(query, params or ())
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert uppercase Snowflake column keys to lowercase for dictionary mapping
        results: List[Dict[str, Any]] = []
        for row in rows:
            mapped_row = {str(k).lower(): v for k, v in row.items()}
            results.append(mapped_row)
        return results
    except Exception as exc:
        logger.error(f"Error executing Snowflake query: {exc}")
        if conn:
            conn.close()
        return []


def execute_snowflake_write(query: str, params: Optional[Any] = None) -> bool:
    """Executes an INSERT / UPDATE query against Snowflake."""
    conn = get_snowflake_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        cursor.execute(query, params or ())
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as exc:
        logger.error(f"Error executing Snowflake write: {exc}")
        if conn:
            conn.close()
        return False
