import sys
import os

try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)
    backend_dir = os.path.join(root_dir, "backend")

    for path in [backend_dir, root_dir, current_dir]:
        if path and os.path.exists(path) and path not in sys.path:
            sys.path.insert(0, path)

    from app.main import app
except Exception as init_err:
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI()

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"])
    def vercel_init_error_fallback(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "VERCEL_FUNCTION_INITIALIZATION_ERROR",
                "message": f"Vercel Python serverless initialization failed: {str(init_err)}",
                "path": path,
            },
        )
