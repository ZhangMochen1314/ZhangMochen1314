"""Redis stream bridge backed by Redis Streams."""

from __future__ import annotations

import asyncio
import json
import logging
from collections.abc import AsyncIterator
from typing import Any

import redis.asyncio as redis

from .base import END_SENTINEL, HEARTBEAT_SENTINEL, StreamBridge, StreamEvent

logger = logging.getLogger(__name__)


class RedisStreamBridge(StreamBridge):
    """Redis Streams implementation of StreamBridge.
    
    Uses Redis Streams (XADD, XREAD) to buffer events for a run.
    """

    def __init__(self, redis_url: str) -> None:
        self._redis = redis.from_url(redis_url, decode_responses=True)
        self._redis_url = redis_url

    async def publish(self, run_id: str, event: str, data: Any) -> None:
        """Enqueue a single event for *run_id*."""
        payload = {
            "event": event,
            "data": json.dumps(data)
        }
        await self._redis.xadd(run_id, payload)

    async def publish_end(self, run_id: str) -> None:
        """Signal that no more events will be produced for *run_id*."""
        payload = {
            "event": "__end__",
            "data": "null"
        }
        await self._redis.xadd(run_id, payload)

    async def subscribe(
        self,
        run_id: str,
        *,
        last_event_id: str | None = None,
        heartbeat_interval: float = 15.0,
    ) -> AsyncIterator[StreamEvent]:
        """Async iterator that yields events for *run_id*."""
        last_id = last_event_id or "0-0"
        
        while True:
            # XREAD blocks until there is a new event or it times out
            # block expects milliseconds
            block_ms = int(heartbeat_interval * 1000)
            try:
                streams = {run_id: last_id}
                response = await self._redis.xread(streams, count=1, block=block_ms)
            except Exception as e:
                logger.error("Error reading from Redis stream %s: %s", run_id, e)
                yield HEARTBEAT_SENTINEL
                continue

            if not response:
                # Timeout reached without any events
                yield HEARTBEAT_SENTINEL
                continue
                
            # response format: [[stream_name, [(msg_id, {key: val, ...}), ...]]]
            stream_name, messages = response[0]
            if not messages:
                yield HEARTBEAT_SENTINEL
                continue
                
            msg_id, msg_data = messages[0]
            last_id = msg_id
            
            event = msg_data.get("event")
            data_str = msg_data.get("data")
            
            if event == "__end__":
                yield END_SENTINEL
                return
                
            try:
                data = json.loads(data_str) if data_str is not None else None
            except json.JSONDecodeError:
                logger.warning("Failed to decode JSON data from stream %s event %s", run_id, msg_id)
                data = data_str
                
            yield StreamEvent(id=msg_id, event=event, data=data)

    async def cleanup(self, run_id: str, *, delay: float = 0) -> None:
        """Release resources associated with *run_id*."""
        if delay > 0:
            await asyncio.sleep(delay)
        await self._redis.delete(run_id)

    async def close(self) -> None:
        """Release backend resources."""
        await self._redis.aclose()
