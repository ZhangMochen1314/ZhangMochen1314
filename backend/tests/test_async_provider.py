import pytest
from unittest.mock import AsyncMock, patch

from deerflow.config.stream_bridge_config import StreamBridgeConfig
from deerflow.runtime.stream_bridge.async_provider import make_stream_bridge
from deerflow.runtime.stream_bridge.redis import RedisStreamBridge

@pytest.mark.anyio
async def test_make_stream_bridge_redis():
    config = StreamBridgeConfig(type="redis", redis_url="redis://localhost:6379/0")
    with patch("redis.asyncio.from_url") as mock_from_url:
        mock_redis = AsyncMock()
        mock_from_url.return_value = mock_redis
        
        async with make_stream_bridge(config) as bridge:
            assert isinstance(bridge, RedisStreamBridge)
