from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import datetime

CAREER_STAGES = ["intern", "junior", "mid-level", "senior", "principal", "distinguished"]

def promote_agent_career(db: Session, agent_id: str):
    """
    Promotes an agent to the next career progression level
    if their trust score, success rate, and reliability metrics permit.
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent or agent.status == "retired":
        return None
        
    current_index = CAREER_STAGES.index(agent.career_stage)
    if current_index >= len(CAREER_STAGES) - 1:
        return {"status": "maxed", "stage": agent.career_stage, "message": "Agent has reached the peak technical career tier."}
        
    next_stage = CAREER_STAGES[current_index + 1]
    
    # Perform promotion
    agent.career_stage = next_stage
    agent.updated_at = datetime.utcnow()
    
    # Increment credentials/cost to reflect promotion seniority
    agent.compute_cost_hourly = round(agent.compute_cost_hourly * 1.25, 2)
    agent.roi_multiplier = round(agent.roi_multiplier * 1.35, 2)
    
    # Update passport audit log
    if agent.passport:
        audit = list(agent.passport.audit_trail_json)
        audit.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "Career Promotion",
            "actor": "HR Automation Engine",
            "details": f"Promoted agent from {CAREER_STAGES[current_index].upper()} to {next_stage.upper()} tier based on exemplary performance metrics."
        })
        agent.passport.audit_trail_json = audit
        
    db.commit()
    return {
        "status": "success",
        "stage": next_stage,
        "compute_cost_hourly": agent.compute_cost_hourly,
        "roi_multiplier": agent.roi_multiplier,
        "message": f"Successfully promoted {agent.name} to {next_stage.upper()}!"
    }

def decommission_and_retire_agent(db: Session, agent_id: str):
    """
    Gracefully decommissions and retires an obsolete, expensive, or unsafe agent.
    Suspends active operations, sets status to 'retired', and locks permission registry.
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        return None
        
    agent.status = "retired"
    agent.updated_at = datetime.utcnow()
    
    # Archive tools and permissions
    if agent.passport:
        agent.passport.permissions_json = [] # Revoke all permissions
        
        audit = list(agent.passport.audit_trail_json)
        audit.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "Agent Decommission & Retirement",
            "actor": "Corporate Governance Council",
            "details": "Agent officially retired. All tool bindings revoked, operational access severed. Knowledge ledger archived."
        })
        agent.passport.audit_trail_json = audit
        
    db.commit()
    return agent

def get_workforce_organizational_chart(db: Session):
    """
    Generates reporting structures and dependencies between agents and humans.
    Returns hierarchical node tree representing chains of responsibility.
    """
    agents = db.query(models.Agent).filter(models.Agent.status != "retired").all()
    
    # Form a clean reporting structure:
    # 1. Human CEO (Root)
    # 2. Human VP of AI Operations
    # 3. Distinguished/Principal agents report to Human VP
    # 4. Senior/Mid agents report to Distinguished/Principal agents
    # 5. Junior/Intern agents report to Senior agents
    
    principal_agents = [a for a in agents if a.career_stage in ["principal", "distinguished"]]
    senior_agents = [a for a in agents if a.career_stage == "senior"]
    mid_agents = [a for a in agents if a.career_stage == "mid-level"]
    junior_agents = [a for a in agents if a.career_stage in ["junior", "intern"]]
    
    nodes = [
        {"id": "human_ceo", "label": "Marcus Vance", "title": "Chief Executive Officer (Human)", "type": "human", "avatar": "CEO"},
        {"id": "human_vp", "label": "Dr. Sarah Chen", "title": "VP of Autonomous AI Systems (Human)", "type": "human", "avatar": "VP"}
    ]
    
    edges = [
        {"source": "human_ceo", "target": "human_vp"}
    ]
    
    # Connect Principal Agents to Human VP
    for pa in principal_agents:
        nodes.append({
            "id": pa.id,
            "label": pa.name,
            "title": f"{pa.career_stage.upper()} Agent — {pa.framework}",
            "type": "agent",
            "avatar": pa.name[:2].upper()
        })
        edges.append({"source": "human_vp", "target": pa.id})
        
    # Connect Senior Agents to Principal Agents (round robin or framework matches)
    for index, sa in enumerate(senior_agents):
        nodes.append({
            "id": sa.id,
            "label": sa.name,
            "title": f"{sa.career_stage.upper()} Agent",
            "type": "agent",
            "avatar": sa.name[:2].upper()
        })
        if principal_agents:
            parent = principal_agents[index % len(principal_agents)]
            edges.append({"source": parent.id, "target": sa.id})
        else:
            edges.append({"source": "human_vp", "target": sa.id})
            
    # Connect Mid/Junior agents to Senior agents
    sub_agents = mid_agents + junior_agents
    for index, sub in enumerate(sub_agents):
        nodes.append({
            "id": sub.id,
            "label": sub.name,
            "title": f"{sub.career_stage.upper()} Agent",
            "type": "agent",
            "avatar": sub.name[:2].upper()
        })
        if senior_agents:
            parent = senior_agents[index % len(senior_agents)]
            edges.append({"source": parent.id, "target": sub.id})
        elif principal_agents:
            parent = principal_agents[index % len(principal_agents)]
            edges.append({"source": parent.id, "target": sub.id})
        else:
            edges.append({"source": "human_vp", "target": sub.id})
            
    return {"nodes": nodes, "edges": edges}
