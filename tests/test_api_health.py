from fastapi.testclient import TestClient

from backend.app import app


def test_health_endpoint_returns_ok():
    client = TestClient(app)
    response = client.get("/api/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "services" in payload
