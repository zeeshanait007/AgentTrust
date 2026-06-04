from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional

# Telemetry Log
class TelemetryLogBase(BaseModel):
    reliability: float
    hallucination_rate: float
    cost_efficiency: float
    compliance_status: bool

class TelemetryLogCreate(TelemetryLogBase):
    agent_id: str

class TelemetryLog(TelemetryLogBase):
    id: int
    agent_id: str
    timestamp: datetime
    class Config:
        from_attributes = True

# Verification Report
class VerificationReportBase(BaseModel):
    test_type: str
    status: str
    score: float
    log_details: str

class VerificationReportCreate(VerificationReportBase):
    agent_id: str

class VerificationReport(VerificationReportBase):
    id: int
    agent_id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Incidents (Black Box Flight Recorder)
class IncidentBase(BaseModel):
    title: str
    severity: str
    description: str
    reasoning_trace_json: Dict[str, Any]

class IncidentCreate(IncidentBase):
    agent_id: str

class Incident(IncidentBase):
    id: int
    agent_id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Benchmark Result
class BenchmarkResultBase(BaseModel):
    suite_name: str
    score: float
    percentile: float
    accuracy: float
    latency_ms: float
    cost_per_task: float
    rank: int

class BenchmarkResult(BenchmarkResultBase):
    id: int
    agent_id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Trust Score
class TrustScoreBase(BaseModel):
    trust_score: int
    reliability: float
    security: float
    compliance: float
    cost_efficiency: float
    human_approval_rate: float
    user_satisfaction: float
    hallucination_rate: float
    production_success_rate: float
    business_outcome_rate: float

class TrustScore(TrustScoreBase):
    id: int
    agent_id: str
    last_recalculated: datetime
    class Config:
        from_attributes = True

# Agent Passport
class AgentPassportBase(BaseModel):
    permissions_json: List[str]
    mcp_servers_json: List[str]
    tools_json: List[str]
    deployment_history_json: List[Dict[str, Any]]
    audit_trail_json: List[Dict[str, Any]]

class AgentPassport(AgentPassportBase):
    id: int
    agent_id: str
    class Config:
        from_attributes = True

# Agent
class AgentBase(BaseModel):
    id: str
    name: str
    owner: str
    organization: str
    status: str
    career_stage: str
    framework: str
    model_provider: str
    compute_cost_hourly: float
    roi_multiplier: float

    model_config = {"protected_namespaces": ()}

class AgentCreate(AgentBase):
    passport: AgentPassportBase

class Agent(AgentBase):
    created_at: datetime
    updated_at: datetime
    passport: Optional[AgentPassport] = None
    trust_score: Optional[TrustScore] = None
    
    class Config:
        from_attributes = True

# Reputation Edge
class ReputationEdgeBase(BaseModel):
    source_agent_id: str
    target_agent_id: str
    interaction_count: int
    success_rate: float
    trust_weight: float

class ReputationEdge(ReputationEdgeBase):
    id: int
    class Config:
        from_attributes = True

# Reputation Network Output
class GraphNode(BaseModel):
    id: str
    label: str
    status: str
    trust_score: int
    career_stage: str
    framework: str
    influence: float # PageRank score

class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float
    success_rate: float

class ReputationGraphSchema(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# UI Actions / Simulation Requests
class SimulatedAttackRequest(BaseModel):
    agent_id: str
    test_type: str # prompt_injection, jailbreak, tool_abuse, secret_leakage, data_exfiltration

class DriftTriggerRequest(BaseModel):
    agent_id: str
    metric: str # trust, cost, accuracy, compliance, hallucination
    amount: float # degree of drift

class CalibrateRequest(BaseModel):
    agent_id: str

class PromotionRequest(BaseModel):
    agent_id: str

class RetirementRequest(BaseModel):
    agent_id: str

class CloneAgentRequest(BaseModel):
    agent_id: str
    new_name: str
    new_owner: str
    new_organization: str

