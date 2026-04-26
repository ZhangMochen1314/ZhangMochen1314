from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ...database import get_db
from ...models import UserFeedback

router = APIRouter()

class FeedbackCreate(BaseModel):
    content: str
    type: str = "bug"

@router.post("")
def create_feedback(feedback: FeedbackCreate, request: Request, db: Session = Depends(get_db)):
    if not hasattr(request.state, "user") or request.state.user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    current_user = request.state.user

    if not feedback.content or len(feedback.content.strip()) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Feedback content cannot be empty")
    
    new_feedback = UserFeedback(
        user_id=current_user.id,
        content=feedback.content.strip(),
        type=feedback.type
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return {"message": "Feedback submitted successfully", "id": new_feedback.id}
