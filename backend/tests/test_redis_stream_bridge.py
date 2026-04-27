import pytest
from unittest.mock import AsyncMock, patch

from deerflow.runtime.stream_bridge.redis import RedisStreamBridge
from deerflow.runtime import HEARTBEAT_SENTINEL, END_SENTINEL

@pytest.mark.anyio
async def test_redis_stream_bridge_publish():
    with patch("redis.asyncio.from_url") as mock_from_url:
        mock_redis = AsyncMock()
        mock_from_url.return_value = mock_redis
        
        bridge = RedisStreamBridge("redis://localhost:6379/0")
        await bridge.publish("run-1", "test_event", {"key": "value"})
        
        mock_redis.xadd.assert_called_once_with(
            "run-1", 
            {"event": "test_event", "data": '{"key": "value"}'}
        )

@pytest.mark.anyio
async def test_redis_stream_bridge_publish_end():
    with patch("redis.asyncio.from_url") as mock_from_url:
        mock_redis = AsyncMock()
        mock_from_url.return_value = mock_redis
        
        bridge = RedisStreamBridge("redis://localhost:6379/0")
        await bridge.publish_end("run-1")
        
        mock_redis.xadd.assert_called_once_with(
            "run-1", 
            {"event": "__end__", "data": "null"}
        )
