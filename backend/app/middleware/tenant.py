import jwt
from typing import Optional
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        tenant_id = self.extract_tenant_id(request)
        request.state.tenant_id = tenant_id
        response = await call_next(request)
        return response

    def extract_tenant_id(self, request: Request) -> Optional[str]:
        # Try to get from header first
        tenant_id = request.headers.get("x-tenant-id")
        if tenant_id:
            return tenant_id
            
        # Try to extract from Authorization Bearer token
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.lower().startswith("bearer "):
            token = auth_header[7:]
            try:
                # Assuming the token is a JWT, we decode it without verification 
                # just to extract tenant_id. Verification should happen in auth dependency.
                payload = jwt.decode(token, options={"verify_signature": False})
                return payload.get("tenant_id")
            except Exception:
                pass
                
        return None
