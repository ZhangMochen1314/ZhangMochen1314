import pytest
from fastapi.testclient import TestClient
from app.gateway.app import app

def test_metrics_endpoint_returns_200():
    with TestClient(app) as client:
        response = client.get("/metrics")
        assert response.status_code == 200
