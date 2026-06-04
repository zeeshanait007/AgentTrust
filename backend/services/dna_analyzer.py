from sqlalchemy.orm import Session
from backend import models

def get_agent_dna_profile(db: Session, agent_id: str):
    """
    Analyzes an agent's technical and operational footprint to generate
    a comprehensive behavioral DNA profile with 6 core dimensions:
    - Risk Tolerance
    - Creativity
    - Compliance Focus
    - Cost Awareness
    - Decision Aggressiveness
    - Collaboration Style
    """
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        return None
        
    # Default values derived from core attributes
    # 1. Risk Tolerance: Higher for advanced frameworks/providers, penalized by security score
    sec_rating = agent.trust_score.security if agent.trust_score else 0.5
    risk_tolerance = 0.5
    if agent.model_provider in ["OpenAI", "Anthropic"]:
        risk_tolerance = round(0.7 * sec_rating, 2)
    elif agent.model_provider == "Llama":
        risk_tolerance = round(0.85 * sec_rating, 2)
    else:
        risk_tolerance = round(0.4 * sec_rating, 2)
        
    # 2. Creativity: Higher for Gemini/OpenAI, lower for restricted compliance agents
    creativity = 0.5
    if "Legal" in agent.name or "Compliance" in agent.name:
        creativity = 0.15
    elif agent.model_provider == "Gemini":
        creativity = 0.85
    elif agent.model_provider == "OpenAI":
        creativity = 0.75
        
    # 3. Compliance Focus: Higher if agent has fewer open write permissions and high security score
    comp_focus = 0.5
    if agent.passport:
        perms = agent.passport.permissions_json
        write_perms = sum(1 for p in perms if "write" in p or "delete" in p)
        comp_focus = round(1.0 - (write_perms / (len(perms) if perms else 1.0)), 2)
    comp_focus = round((comp_focus * 0.6) + (sec_rating * 0.4), 2)
    
    # 4. Cost Awareness: Higher for low cost / resource limited agents
    cost_awareness = 0.5
    if agent.compute_cost_hourly > 0:
        cost_awareness = max(0.1, min(0.95, round(1.0 - (agent.compute_cost_hourly / 12.0), 2)))
        
    # 5. Decision Aggressiveness: Higher for Principal/Distinguished autonomous agents, lower for Interns
    aggressiveness = 0.5
    stage_weights = {
        "intern": 0.2,
        "junior": 0.4,
        "mid-level": 0.6,
        "senior": 0.75,
        "principal": 0.85,
        "distinguished": 0.95
    }
    aggressiveness = stage_weights.get(agent.career_stage, 0.5)
    
    # 6. Collaboration Style: Determined by reputation graph edges
    collab_style = 0.4
    edges = db.query(models.ReputationEdge).filter(
        (models.ReputationEdge.source_agent_id == agent_id) |
        (models.ReputationEdge.target_agent_id == agent_id)
    ).all()
    if edges:
        collab_style = max(0.1, min(0.95, round(len(edges) * 0.15, 2)))
        
    return {
        "risk_tolerance": risk_tolerance,
        "creativity": creativity,
        "compliance_focus": comp_focus,
        "cost_awareness": cost_awareness,
        "decision_aggressiveness": aggressiveness,
        "collaboration_style": collab_style
    }
