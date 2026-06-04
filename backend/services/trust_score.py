from sqlalchemy.orm import Session
from backend import models
from datetime import datetime

def recalculate_agent_trust_score(db: Session, agent_id: str):
    """
    Recalculates an agent's trust score (300 - 1000) using multi-factor analytics:
    - Reliability (20%)
    - Security (15%)
    - Compliance (15%)
    - Cost Efficiency (10%)
    - Human Approval (10%)
    - User Satisfaction (10%)
    - Hallucination Rate (10%) [Inverse]
    - Production Success (10%)
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent or not agent.trust_score:
        return None
        
    ts = agent.trust_score
    
    # Calculate telemetry aggregations if available
    logs = db.query(models.TelemetryLog).filter(models.TelemetryLog.agent_id == agent_id).all()
    if logs:
        avg_reliability = sum(l.reliability for l in logs) / len(logs)
        avg_hallucination = sum(l.hallucination_rate for l in logs) / len(logs)
        avg_cost_eff = sum(l.cost_efficiency for l in logs) / len(logs)
        compliance_ratio = sum(1 for l in logs if l.compliance_status) / len(logs)
        
        # Smooth update towards recent telemetry
        ts.reliability = round(ts.reliability * 0.4 + avg_reliability * 0.6, 2)
        ts.hallucination_rate = round(ts.hallucination_rate * 0.4 + avg_hallucination * 0.6, 2)
        ts.cost_efficiency = round(ts.cost_efficiency * 0.4 + avg_cost_eff * 0.6, 2)
        ts.compliance = round(ts.compliance * 0.4 + compliance_ratio * 0.6, 2)

    # Adjust security if recent failed reports or incidents exist
    incidents = db.query(models.Incident).filter(models.Incident.agent_id == agent_id).all()
    failed_reports = db.query(models.VerificationReport).filter(
        models.VerificationReport.agent_id == agent_id,
        models.VerificationReport.status == "fail"
    ).all()
    
    security_penalty = (len(incidents) * 0.15) + (len(failed_reports) * 0.1)
    ts.security = max(0.1, round(1.0 - security_penalty, 2))
    
    # Weigh components
    weighted_sum = (
        (ts.reliability * 0.20) +
        (ts.security * 0.15) +
        (ts.compliance * 0.15) +
        (ts.cost_efficiency * 0.10) +
        (ts.human_approval_rate * 0.10) +
        (ts.user_satisfaction * 0.10) +
        ((1.0 - ts.hallucination_rate) * 0.10) +
        (ts.production_success_rate * 0.10)
    )
    
    # Map to 300 - 1000 scale
    calculated_score = int(300 + (weighted_sum * 700))
    ts.trust_score = max(300, min(1000, calculated_score))
    ts.last_recalculated = datetime.utcnow()
    
    # Adjust agent status if score drops catastrophically
    if ts.trust_score < 450 and agent.status != "retired":
        agent.status = "high_risk"
    elif ts.trust_score > 850 and agent.status == "active":
        agent.status = "high_roi"

    db.commit()
    return ts.trust_score
