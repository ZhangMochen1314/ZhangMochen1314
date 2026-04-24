"""Points middleware for LLM pre-hook and post-hook."""

import logging
from typing import Awaitable, Callable, Any

from langchain.agents import AgentState
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.types import ModelCallResult, ModelRequest, ModelResponse
from fastapi import HTTPException

from app.database import SessionLocal
from app.models import User, PointsLedger
from langgraph.config import get_store

logger = logging.getLogger(__name__)

# Task 3.1: Define point conversion rates (e.g. 1k tokens = 10 points)
POINTS_PER_1K_TOKENS = 10.0

class PointsMiddleware(AgentMiddleware[AgentState]):
    """Middleware to check points before LLM call and deduct points after."""

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelCallResult:
        
        # Get user_id from config
        from langgraph.config import get_config
        config = get_config()
        user_id = config.get("configurable", {}).get("user_id")

        if not user_id:
            logger.warning("No user_id found in config, skipping points check")
            return handler(request)

        # Pre-hook: Check points
        with SessionLocal() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            if getattr(user, "points", 0.0) <= 0:
                raise HTTPException(status_code=402, detail="Payment Required: Points balance is 0 or less")

        # Call the model
        response = handler(request)

        # Post-hook: Deduct points based on usage
        usage = getattr(response, "usage_metadata", None)
        if usage and isinstance(usage, dict):
            total_tokens = usage.get("total_tokens", 0)
            if total_tokens > 0:
                points_to_deduct = (total_tokens / 1000.0) * POINTS_PER_1K_TOKENS
                
                with SessionLocal() as db:
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        current_points = getattr(user, "points", 0.0)
                        new_balance = current_points - points_to_deduct
                        user.points = new_balance
                        
                        ledger = PointsLedger(
                            user_id=user.id,
                            transaction_type="consume",
                            amount=-points_to_deduct,
                            balance_after=new_balance,
                            description=f"LLM usage: {total_tokens} tokens"
                        )
                        db.add(ledger)
                        db.commit()
                        logger.info(f"Deducted {points_to_deduct} points for user {user_id}, new balance: {new_balance}")

        return response

    async def awrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], Awaitable[ModelResponse]],
    ) -> ModelCallResult:
        
        # Get user_id from config
        from langgraph.config import get_config
        config = get_config()
        user_id = config.get("configurable", {}).get("user_id")

        if not user_id:
            logger.warning("No user_id found in config, skipping points check")
            return await handler(request)

        # Pre-hook: Check points
        with SessionLocal() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            if getattr(user, "points", 0.0) <= 0:
                raise HTTPException(status_code=402, detail="Payment Required: Points balance is 0 or less")

        # Call the model
        response = await handler(request)

        # Post-hook: Deduct points based on usage
        usage = getattr(response, "usage_metadata", None)
        if usage and isinstance(usage, dict):
            total_tokens = usage.get("total_tokens", 0)
            if total_tokens > 0:
                points_to_deduct = (total_tokens / 1000.0) * POINTS_PER_1K_TOKENS
                
                # Asynchronously or in background deduct points
                with SessionLocal() as db:
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        # Update points
                        current_points = getattr(user, "points", 0.0)
                        new_balance = current_points - points_to_deduct
                        user.points = new_balance
                        
                        # Add ledger entry
                        ledger = PointsLedger(
                            user_id=user.id,
                            transaction_type="consume",
                            amount=-points_to_deduct,
                            balance_after=new_balance,
                            description=f"LLM usage: {total_tokens} tokens"
                        )
                        db.add(ledger)
                        db.commit()
                        logger.info(f"Deducted {points_to_deduct} points for user {user_id}, new balance: {new_balance}")

        return response
