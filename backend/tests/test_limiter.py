import pytest
from fastapi.testclient import TestClient
from app.gateway.app import app

client = TestClient(app)

def test_rate_limit():
    url = "/api/runs/wait"
    body = {"assistant_id": "test", "input": {"messages": []}}
    
    responses = []
    # Sending 15 requests to ensure we hit the rate limit (10/minute)
    for _ in range(15):
        responses.append(client.post(url, json=body))
        
    status_codes = [r.status_code for r in responses]
    assert 429 in status_codes
    assert status_codes.count(429) >= 1
