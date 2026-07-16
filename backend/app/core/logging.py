import logging
import sys

def setup_logging() -> None:
    # Setup root logger configurations
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Minimize noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
