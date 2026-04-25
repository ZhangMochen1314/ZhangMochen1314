"""Middleware for logging LLM token usage."""

import asyncio
import logging
from typing import override

from langchain.agents import AgentState
from langchain.agents.middleware import AgentMiddleware
from langgraph.runtime import Runtime
from langgraph.config import get_config

logger = logging.getLogger(__name__)


async def _deduct_credits_async(user_id: int, total_tokens: int) -> None:
    try:
        from app.gateway.deps import async_session_maker
        from app.auth.models import User
        from sqlalchemy.future import select

        async with async_session_maker() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user and total_tokens > 0:
                user.credits = max(0, user.credits - total_tokens)
                await session.commit()
                logger.info("Deducted %d credits from user_id=%s. Remaining credits: %d", total_tokens, user_id, user.credits)
    except Exception as e:
        logger.error("Failed to deduct credits for user_id=%s: %s", user_id, e)


class TokenUsageMiddleware(AgentMiddleware):
    """Logs token usage from model response usage_metadata and deducts user credits."""

    @override
    def after_model(self, state: AgentState, runtime: Runtime) -> dict | None:
        self._log_usage(state)
        return None

    @override
    async def aafter_model(self, state: AgentState, runtime: Runtime) -> dict | None:
        self._log_usage(state)
        return None

    def _log_usage(self, state: AgentState) -> None:
        messages = state.get("messages", [])
        if not messages:
            return None
        last = messages[-1]
        usage = getattr(last, "usage_metadata", None)
        if usage:
            total_tokens = usage.get("total_tokens", 0)
            logger.info(
                "LLM token usage: input=%s output=%s total=%s",
                usage.get("input_tokens", "?"),
                usage.get("output_tokens", "?"),
                total_tokens,
            )
            
            # Deduct credits if user_id is found in the current config
            try:
                config = get_config()
                user_id = config.get("metadata", {}).get("user_id")
                if user_id and total_tokens > 0:
                    try:
                        loop = asyncio.get_running_loop()
                        loop.create_task(_deduct_credits_async(user_id, total_tokens))
                    except RuntimeError:
                        asyncio.run(_deduct_credits_async(user_id, total_tokens))
            except Exception as e:
                logger.error("Error initiating credit deduction: %s", e)
                
        return None
