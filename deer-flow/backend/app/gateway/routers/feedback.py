from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.gateway.deps import get_current_user, get_db_session
from app.auth.models import User, Feedback

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

class FeedbackCreate(BaseModel):
    type: str # "bug" or "suggestion"
    content: str

@router.post("")
async def create_feedback(feedback: FeedbackCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_session)):
    new_feedback = Feedback(
        user_id=current_user.id,
        type=feedback.type,
        content=feedback.content
    )
    db.add(new_feedback)
    await db.commit()
    return {"message": "Feedback received"}
