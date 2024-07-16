from fastapi import Request
from logger import logger


async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Error: {e}")
        raise e
    return response
