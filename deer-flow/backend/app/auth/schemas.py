from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    invite_code: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    credits: int
    is_active: bool
    role: str
    my_invite_code: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
