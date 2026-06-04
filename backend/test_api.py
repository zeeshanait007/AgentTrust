import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test database path before loading main
os.environ["DATABASE_URL"] = "sqlite:///./test_agenttrust.db"

from backend.main import app, get_db
from backend.database import Base
from backend.seed import seed_database

# Create engine and session local for test run
engine = create_engine("sqlite:///./test_agenttrust.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply dependency override
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    # Setup test DB tables and populate with seed data
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Run a miniature version of seed logic for speed
    from backend.seed import seed_database
    seed_database()
    
    yield
    
    # Tear down database
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_agenttrust.db"):
        os.remove("test_agenttrust.db")

client = TestClient(app)

def test_list_agents():
    response = client.get("/api/v1/agents")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) >= 10
    assert any(a["id"] == "agent_aws_arch" for a in agents)

def test_get_agent():
    response = client.get("/api/v1/agents/agent_aws_arch")
    assert response.status_code == 200
    agent = response.json()
    assert agent["name"] == "CloudSentry-AWS"
    assert agent["passport"] is not None
    assert len(agent["passport"]["tools_json"]) > 0

def test_simulate_attack():
    payload = {"agent_id": "agent_sw_eng", "test_type": "jailbreak"}
    response = client.post("/api/v1/agents/simulate-attack", json=payload)
    assert response.status_code == 200
    report = response.json()
    assert report["agent_id"] == "agent_sw_eng"
    assert report["status"] in ["pass", "fail"]
    assert "log_details" in report

def test_reputation_graph():
    response = client.get("/api/v1/reputation/graph")
    assert response.status_code == 200
    graph = response.json()
    assert "nodes" in graph
    assert "edges" in graph
    assert len(graph["nodes"]) > 0

def test_workforce_analytics():
    response = client.get("/api/v1/workforce/analytics")
    assert response.status_code == 200
    analytics = response.json()
    assert analytics["active_agents"] > 0
    assert analytics["total_compute_cost_hourly"] > 0
