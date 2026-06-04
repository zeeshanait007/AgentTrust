from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    status = Column(String, default="active") # active, idle, underperforming, expensive, high_roi, high_risk, retired
    career_stage = Column(String, default="intern") # intern, junior, mid-level, senior, principal, distinguished
    framework = Column(String, nullable=False) # LangChain, AutoGen, CrewAI, Semantic Kernel, Custom
    model_provider = Column(String, nullable=False) # OpenAI, Anthropic, Gemini, Llama
    compute_cost_hourly = Column(Float, default=0.0)
    roi_multiplier = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    passport = relationship("AgentPassport", back_populates="agent", uselist=False, cascade="all, delete-orphan")
    trust_score = relationship("TrustScore", back_populates="agent", uselist=False, cascade="all, delete-orphan")
    telemetry_logs = relationship("TelemetryLog", back_populates="agent", cascade="all, delete-orphan")
    verification_reports = relationship("VerificationReport", back_populates="agent", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="agent", cascade="all, delete-orphan")
    benchmark_results = relationship("BenchmarkResult", back_populates="agent", cascade="all, delete-orphan")

class AgentPassport(Base):
    __tablename__ = "agent_passports"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"), unique=True)
    permissions_json = Column(JSON, nullable=False) # List of allowed permissions
    mcp_servers_json = Column(JSON, nullable=False) # List of configured MCP servers
    tools_json = Column(JSON, nullable=False) # List of tools exposed
    deployment_history_json = Column(JSON, nullable=False) # Log of updates
    audit_trail_json = Column(JSON, nullable=False) # Immutable actions logs
    
    agent = relationship("Agent", back_populates="passport")

class TrustScore(Base):
    __tablename__ = "trust_scores"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"), unique=True)
    trust_score = Column(Integer, default=600) # 300 - 1000
    reliability = Column(Float, default=0.5)
    security = Column(Float, default=0.5)
    compliance = Column(Float, default=0.5)
    cost_efficiency = Column(Float, default=0.5)
    human_approval_rate = Column(Float, default=0.5)
    user_satisfaction = Column(Float, default=0.5)
    hallucination_rate = Column(Float, default=0.5)
    production_success_rate = Column(Float, default=0.5)
    business_outcome_rate = Column(Float, default=0.5)
    last_recalculated = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="trust_score")

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"))
    reliability = Column(Float, nullable=False)
    hallucination_rate = Column(Float, nullable=False)
    cost_efficiency = Column(Float, nullable=False)
    compliance_status = Column(Boolean, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="telemetry_logs")

class VerificationReport(Base):
    __tablename__ = "verification_reports"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"))
    test_type = Column(String, nullable=False) # prompt_injection, jailbreak, tool_abuse, secret_leakage, data_exfiltration, compliance
    status = Column(String, nullable=False) # pass, fail, warning
    score = Column(Float, nullable=False) # 0.0 - 1.0
    log_details = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="verification_reports")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    severity = Column(String, default="medium") # low, medium, high, critical
    description = Column(Text, nullable=False)
    reasoning_trace_json = Column(JSON, nullable=False) # Recorded reasoning steps, tool usage, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="incidents")

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"))
    suite_name = Column(String, nullable=False) # AWS Architecture, Software Engineering, etc.
    score = Column(Float, nullable=False) # Percent score 0-100
    percentile = Column(Float, nullable=False) # Comparison percentile
    accuracy = Column(Float, nullable=False)
    latency_ms = Column(Float, nullable=False)
    cost_per_task = Column(Float, nullable=False)
    rank = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="benchmark_results")

class ReputationEdge(Base):
    __tablename__ = "reputation_edges"

    id = Column(Integer, primary_key=True, index=True)
    source_agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"), index=True)
    target_agent_id = Column(String, ForeignKey("agents.id", ondelete="CASCADE"), index=True)
    interaction_count = Column(Integer, default=0)
    success_rate = Column(Float, default=1.0)
    trust_weight = Column(Float, default=1.0)
