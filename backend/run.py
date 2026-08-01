import os
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    port = int(os.getenv("PORT", settings.API_PORT))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=settings.API_ENV == "development",
    )
