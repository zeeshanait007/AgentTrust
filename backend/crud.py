from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import datetime

def get_agents(db: Session, status: str = None, career_stage: str = None):
    query = db.query(models.Agent)
    if status:
        query = query.filter(models.Agent.status == status)
    if career_stage:
        query = query.filter(models.Agent.career_stage == career_stage)
    return query.all()

def get_agent_by_id(db: Session, agent_id: str):
    return db.query(models.Agent).filter(models.Agent.id == agent_id).first()

def create_agent(db: Session, agent_in: schemas.AgentCreate):
    db_agent = models.Agent(
        id=agent_in.id,
        name=agent_in.name,
        owner=agent_in.owner,
        organization=agent_in.organization,
        status=agent_in.status,
        career_stage=agent_in.career_stage,
        framework=agent_in.framework,
        model_provider=agent_in.model_provider,
        compute_cost_hourly=agent_in.compute_cost_hourly,
        roi_multiplier=agent_in.roi_multiplier
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    
    db_passport = models.AgentPassport(
        agent_id=db_agent.id,
        permissions_json=agent_in.passport.permissions_json,
        mcp_servers_json=agent_in.passport.mcp_servers_json,
        tools_json=agent_in.passport.tools_json,
        deployment_history_json=agent_in.passport.deployment_history_json,
        audit_trail_json=agent_in.passport.audit_trail_json
    )
    db.add(db_passport)
    
    db_trust = models.TrustScore(
        agent_id=db_agent.id,
        trust_score=600,
        reliability=0.6,
        security=0.7,
        compliance=0.8,
        cost_efficiency=0.5,
        human_approval_rate=0.9,
        user_satisfaction=0.7,
        hallucination_rate=0.1,
        production_success_rate=0.7,
        business_outcome_rate=0.7,
        last_recalculated=datetime.utcnow()
    )
    db.add(db_trust)
    db.commit()
    db.refresh(db_agent)
    return db_agent

def update_agent_status(db: Session, agent_id: str, status: str):
    db_agent = get_agent_by_id(db, agent_id)
    if db_agent:
        db_agent.status = status
        db_agent.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_agent)
    return db_agent

def update_agent_career(db: Session, agent_id: str, career_stage: str):
    db_agent = get_agent_by_id(db, agent_id)
    if db_agent:
        db_agent.career_stage = career_stage
        db_agent.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_agent)
    return db_agent

def get_telemetry_logs(db: Session, agent_id: str, limit: int = 50):
    return db.query(models.TelemetryLog)\
             .filter(models.TelemetryLog.agent_id == agent_id)\
             .order_by(models.TelemetryLog.timestamp.desc())\
             .limit(limit).all()

def add_telemetry_log(db: Session, log_in: schemas.TelemetryLogCreate):
    db_log = models.TelemetryLog(
        agent_id=log_in.agent_id,
        reliability=log_in.reliability,
        hallucination_rate=log_in.hallucination_rate,
        cost_efficiency=log_in.cost_efficiency,
        compliance_status=log_in.compliance_status
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_incidents(db: Session, agent_id: str = None, limit: int = 50):
    query = db.query(models.Incident)
    if agent_id:
        query = query.filter(models.Incident.agent_id == agent_id)
    return query.order_by(models.Incident.created_at.desc()).limit(limit).all()

def add_incident(db: Session, incident_in: schemas.IncidentCreate):
    db_incident = models.Incident(
        agent_id=incident_in.agent_id,
        title=incident_in.title,
        severity=incident_in.severity,
        description=incident_in.description,
        reasoning_trace_json=incident_in.reasoning_trace_json
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

def get_verification_reports(db: Session, agent_id: str = None):
    query = db.query(models.VerificationReport)
    if agent_id:
        query = query.filter(models.VerificationReport.agent_id == agent_id)
    return query.order_by(models.VerificationReport.created_at.desc()).all()

def add_verification_report(db: Session, report_in: schemas.VerificationReportCreate):
    db_report = models.VerificationReport(
        agent_id=report_in.agent_id,
        test_type=report_in.test_type,
        status=report_in.status,
        score=report_in.score,
        log_details=report_in.log_details
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_reputation_edges(db: Session):
    return db.query(models.ReputationEdge).all()

def add_reputation_edge(db: Session, edge_in: schemas.ReputationEdgeBase):
    db_edge = models.ReputationEdge(
        source_agent_id=edge_in.source_agent_id,
        target_agent_id=edge_in.target_agent_id,
        interaction_count=edge_in.interaction_count,
        success_rate=edge_in.success_rate,
        trust_weight=edge_in.trust_weight
    )
    db.add(db_edge)
    db.commit()
    db.refresh(db_edge)
    return db_edge
