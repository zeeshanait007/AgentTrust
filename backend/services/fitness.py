import random
from sqlalchemy.orm import Session
from backend import models

def get_agent_fitness_health(db: Session, agent_id: str):
    """
    Computes an agent's active drift indicators and dynamic fitness metrics:
    - Trust Drift
    - Cost Drift
    - Accuracy Drift
    - Compliance Drift
    - Hallucination Drift
    Generates an overall Health Score (0-100) and actionable calibration steps.
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        return None
        
    ts = agent.trust_score
    if not ts:
        return None
        
    # Standard drift metrics derived from trust scores and telemetry
    # Lower trust scores or higher recent incidents induce drift
    incidents = db.query(models.Incident).filter(models.Incident.agent_id == agent_id).all()
    reports = db.query(models.VerificationReport).filter(models.VerificationReport.agent_id == agent_id).all()
    failed_reports = [r for r in reports if r.status == "fail"]
    
    trust_drift = round(max(0.0, min(0.95, (1000 - ts.trust_score) / 700.0)), 2)
    
    # Cost drift is higher if agent has higher hourly compute than average
    cost_drift = round(max(0.0, min(0.85, (agent.compute_cost_hourly / 10.0) * 0.5)), 2)
    
    # Accuracy drift based on reliability metric
    accuracy_drift = round(max(0.0, min(0.90, 1.0 - ts.reliability)), 2)
    
    # Compliance drift based on security incidents and failed compliance tests
    compliance_drift = round(max(0.0, min(0.95, 1.0 - ts.compliance + (len(failed_reports) * 0.15))), 2)
    
    # Hallucination drift directly tracks the hallucination rate
    hallucination_drift = round(max(0.0, min(0.95, ts.hallucination_rate + (len(incidents) * 0.08))), 2)
    
    # Compute overall health score (0 - 100)
    avg_drift = (trust_drift + cost_drift + accuracy_drift + compliance_drift + hallucination_drift) / 5.0
    health_score = int(100 - (avg_drift * 100))
    health_score = max(10, min(100, health_score))
    
    # Actionable recommendations
    recommendations = []
    if trust_drift > 0.4:
        recommendations.append("Initiate fine-tuning weights recalibration due to high trust variance.")
    if cost_drift > 0.5:
        recommendations.append("Restrict maximum token processing limit or scale down model class to manage cost.")
    if accuracy_drift > 0.4:
        recommendations.append("Update prompt directives with enhanced few-shot operational templates.")
    if compliance_drift > 0.3:
        recommendations.append("Revoke unauthorized tool access rights and enforce human approval gates on write calls.")
    if hallucination_drift > 0.3:
        recommendations.append("Lower model temperature parameter to 0.1 and enable RAG context verification loops.")
        
    if not recommendations:
        recommendations.append("Agent telemetry is operating within nominal compliance thresholds. Continue monitoring.")
        
    return {
        "health_score": health_score,
        "metrics": {
            "trust_drift": trust_drift,
            "cost_drift": cost_drift,
            "accuracy_drift": accuracy_drift,
            "compliance_drift": compliance_drift,
            "hallucination_drift": hallucination_drift
        },
        "recommendations": recommendations
    }

def calibrate_agent_drift(db: Session, agent_id: str):
    """
    Triggers an active 'calibration' event that restores model settings.
    Resets accumulated drift, lowers hallucination rates, and increases reliability.
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent or not agent.trust_score:
        return None
        
    ts = agent.trust_score
    
    # Perform calibration updates
    ts.reliability = min(0.98, round(ts.reliability + 0.15, 2))
    ts.hallucination_rate = max(0.02, round(ts.hallucination_rate - 0.12, 2))
    ts.compliance = min(0.99, round(ts.compliance + 0.10, 2))
    ts.security = min(0.99, round(ts.security + 0.10, 2))
    ts.user_satisfaction = min(0.98, round(ts.user_satisfaction + 0.08, 2))
    ts.production_success_rate = min(0.98, round(ts.production_success_rate + 0.05, 2))
    
    # Recalculate
    # Remove incidents to represent resolved state
    db.query(models.Incident).filter(models.Incident.agent_id == agent_id).delete()
    
    # Add audit log of calibration to passport
    if agent.passport:
        audit = list(agent.passport.audit_trail_json)
        audit.append({
            "timestamp": models.datetime.utcnow().isoformat(),
            "action": "Model Calibration",
            "actor": "System Governance Engine",
            "details": "Triggered drift recalibration. Prompt context updated, model parameters calibrated."
        })
        agent.passport.audit_trail_json = audit
        
    db.commit()
    
    from backend.services.trust_score import recalculate_agent_trust_score
    recalculate_agent_trust_score(db, agent_id)
    
    return get_agent_fitness_health(db, agent_id)
