from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.auth_utils import decode_access_token
import asyncio

class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, exclude_paths: list[str] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or []

    async def dispatch(self, request: Request, call_next):
        # Allow OPTIONS request for CORS
        if request.method == "OPTIONS":
            return await call_next(request)

        # Exclude paths like docs, openapi, auth
        path = request.url.path
        if any(path.startswith(p) for p in self.exclude_paths):
            return await call_next(request)

        # Check authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid authorization header"}
            )

        token = auth_header.split(" ")[1]
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"}
            )

        # Set user_id in request state
        request.state.user_id = int(payload["sub"])

        response = await call_next(request)
        return response

class TenantRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware per tenant to prevent abuse.
    Limits the number of concurrent requests per user_id.
    """
    def __init__(self, app, max_concurrent: int = 5):
        super().__init__(app)
        self.max_concurrent = max_concurrent
        self._tenant_semaphores: dict[int, asyncio.Semaphore] = {}
        self._lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next):
        if not hasattr(request.state, "user_id"):
            return await call_next(request)
            
        user_id = request.state.user_id
        
        async with self._lock:
            if user_id not in self._tenant_semaphores:
                self._tenant_semaphores[user_id] = asyncio.Semaphore(self.max_concurrent)
            semaphore = self._tenant_semaphores[user_id]
            
        if semaphore.locked():
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many concurrent requests. Rate limit exceeded."}
            )
            
        async with semaphore:
            return await call_next(request)
