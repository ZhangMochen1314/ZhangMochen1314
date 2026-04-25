from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class CodeExecution(BaseModel):
    code: str
    output: Optional[str] = None
    error: Optional[str] = None
    execution_time: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SessionState(BaseModel):
    """
    Session metadata structure (session ID, user ID, associated sandbox ID, last active time, user variables, code execution history, etc.)
    """
    session_id: str
    user_id: int
    sandbox_id: Optional[str] = None
    status: str = "active"
    last_active_at: datetime = Field(default_factory=datetime.utcnow)
    user_variables: Dict[str, Any] = Field(default_factory=dict)
    code_execution_history: List[CodeExecution] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    def update_activity(self):
        self.last_active_at = datetime.utcnow()
