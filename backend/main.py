from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from backend import models, schemas, crud
from backend.database import engine, get_db, Base
from backend.config import settings
from backend.services import (
    trust_score,
    verification,
    reputation,
    dna_analyzer,
    blackbox,
    fitness,
    workforce
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AgentTrust — World's first Trust, Reputation, Governance, & Workforce OS for AI Agents."
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Agent Passport Registry ---

@app.get("/api/v1/agents", response_model=List[schemas.Agent])
def list_agents(
    status: Optional[str] = None, 
    career_stage: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    return crud.get_agents(db, status=status, career_stage=career_stage)

@app.get("/api/v1/agents/{agent_id}", response_model=schemas.Agent)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_id(db, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent Passport not found.")
    return agent

@app.post("/api/v1/agents", response_model=schemas.Agent)
def register_agent(agent_in: schemas.AgentCreate, db: Session = Depends(get_db)):
    existing = crud.get_agent_by_id(db, agent_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Agent ID already registered in Passport Registry.")
    return crud.create_agent(db, agent_in)

@app.get("/api/v1/agents/{agent_id}/passport", response_model=schemas.AgentPassport)
def get_agent_passport(agent_id: str, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_id(db, agent_id)
    if not agent or not agent.passport:
        raise HTTPException(status_code=404, detail="Agent Passport details not found.")
    return agent.passport

# --- 2. Universal Agent Trust Score & Telemetry ---

@app.get("/api/v1/agents/{agent_id}/trust", response_model=schemas.TrustScore)
def get_agent_trust_score(agent_id: str, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_id(db, agent_id)
    if not agent or not agent.trust_score:
        raise HTTPException(status_code=404, detail="Trust Score details not found.")
    return agent.trust_score

@app.post("/api/v1/agents/{agent_id}/recalculate-trust")
def trigger_trust_recalculation(agent_id: str, db: Session = Depends(get_db)):
    score = trust_score.recalculate_agent_trust_score(db, agent_id)
    if score is None:
        raise HTTPException(status_code=404, detail="Agent not found.")
    return {"agent_id": agent_id, "new_trust_score": score}

# --- 3. Autonomous Verification Engine ---

@app.post("/api/v1/agents/simulate-attack", response_model=schemas.VerificationReport)
def run_sandbox_redteam_test(req: schemas.SimulatedAttackRequest, db: Session = Depends(get_db)):
    report = verification.execute_autonomous_verification_test(db, req.agent_id, req.test_type)
    if not report:
        raise HTTPException(status_code=404, detail="Agent sandbox execution failed.")
    return report

@app.get("/api/v1/agents/{agent_id}/verification-reports", response_model=List[schemas.VerificationReport])
def list_agent_verification_reports(agent_id: str, db: Session = Depends(get_db)):
    return crud.get_verification_reports(db, agent_id)

# --- 4. Agent Workforce Management ---

@app.get("/api/v1/workforce/orgchart")
def get_workforce_orgchart(db: Session = Depends(get_db)):
    return workforce.get_workforce_organizational_chart(db)

@app.get("/api/v1/workforce/analytics")
def get_workforce_analytics(db: Session = Depends(get_db)):
    agents = db.query(models.Agent).all()
    active_count = sum(1 for a in agents if a.status in ["active", "high_roi"])
    idle_count = sum(1 for a in agents if a.status == "idle")
    high_risk_count = sum(1 for a in agents if a.status == "high_risk")
    retired_count = sum(1 for a in agents if a.status == "retired")
    
    total_compute_hourly = sum(a.compute_cost_hourly for a in agents if a.status != "retired")
    total_roi = sum(a.compute_cost_hourly * a.roi_multiplier for a in agents if a.status != "retired")
    net_roi_ratio = round(total_roi / max(1.0, total_compute_hourly), 2)
    
    return {
        "active_agents": active_count,
        "idle_agents": idle_count,
        "high_risk_agents": high_risk_count,
        "retired_agents": retired_count,
        "total_compute_cost_hourly": round(total_compute_hourly, 2),
        "total_roi_hourly": round(total_roi, 2),
        "average_roi_multiplier": net_roi_ratio
    }

# --- 5. Benchmarking Platform ---

@app.get("/api/v1/benchmarks")
def list_benchmark_leaderboards(db: Session = Depends(get_db)):
    results = db.query(models.BenchmarkResult).all()
    out = {}
    for r in results:
        agent = db.query(models.Agent).filter(models.Agent.id == r.agent_id).first()
        if not agent:
            continue
            
        suite = r.suite_name
        if suite not in out:
            out[suite] = []
            
        score_val = agent.trust_score.trust_score if agent.trust_score else 600
        out[suite].append({
            "agent_id": agent.id,
            "agent_name": agent.name,
            "score": r.score,
            "percentile": r.percentile,
            "accuracy": r.accuracy,
            "latency_ms": r.latency_ms,
            "cost_per_task": r.cost_per_task,
            "trust_score": score_val,
            "rank": r.rank
        })
        
    # Sort leaderboard rankings
    for suite in out:
        out[suite] = sorted(out[suite], key=lambda x: x["score"], reverse=True)
        # Update ranks dynamically
        for idx, item in enumerate(out[suite]):
            item["rank"] = idx + 1
            
    return out

# --- 6. Reputation Graph ---

@app.get("/api/v1/reputation/graph", response_model=schemas.ReputationGraphSchema)
def get_reputation_network(db: Session = Depends(get_db)):
    return reputation.get_reputation_network_graph(db)

# --- 7. DNA Analysis ---

@app.get("/api/v1/agents/{agent_id}/dna")
def get_agent_behavior_dna(agent_id: str, db: Session = Depends(get_db)):
    profile = dna_analyzer.get_agent_dna_profile(db, agent_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Agent DNA profile not found.")
    return profile

# --- 8. Black Box Flight Recorder ---

@app.get("/api/v1/recorder/incidents", response_model=List[schemas.Incident])
def get_incidents_list(agent_id: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_incidents(db, agent_id=agent_id)

@app.get("/api/v1/recorder/{agent_id}/replay")
def get_flight_recorder_playback(agent_id: str, incident_id: Optional[int] = None, db: Session = Depends(get_db)):
    trace = blackbox.get_agent_execution_traces(db, agent_id, incident_id)
    if not trace:
        raise HTTPException(status_code=404, detail="Playback trace unavailable.")
    return trace

# --- 9. Fitness & Telemetry Drift Tracker ---

@app.get("/api/v1/agents/{agent_id}/fitness")
def get_fitness_drift(agent_id: str, db: Session = Depends(get_db)):
    health = fitness.get_agent_fitness_health(db, agent_id)
    if not health:
        raise HTTPException(status_code=404, detail="Agent fitness records not found.")
    return health

@app.post("/api/v1/agents/simulate-drift")
def inject_telemetry_drift(req: schemas.DriftTriggerRequest, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_id(db, req.agent_id)
    if not agent or not agent.trust_score:
        raise HTTPException(status_code=404, detail="Agent not found.")
    
    ts = agent.trust_score
    if req.metric == "hallucination":
        ts.hallucination_rate = min(0.95, round(ts.hallucination_rate + req.amount, 2))
    elif req.metric == "trust":
        ts.reliability = max(0.1, round(ts.reliability - req.amount, 2))
    elif req.metric == "compliance":
        ts.compliance = max(0.1, round(ts.compliance - req.amount, 2))
    elif req.metric == "cost":
        ts.cost_efficiency = max(0.1, round(ts.cost_efficiency - req.amount, 2))
        
    db.commit()
    trust_score.recalculate_agent_trust_score(db, req.agent_id)
    return {"status": "drift_injected", "agent_id": req.agent_id, "new_metrics": fitness.get_agent_fitness_health(db, req.agent_id)}

@app.post("/api/v1/agents/calibrate")
def run_calibration(req: schemas.CalibrateRequest, db: Session = Depends(get_db)):
    res = fitness.calibrate_agent_drift(db, req.agent_id)
    if not res:
        raise HTTPException(status_code=404, detail="Recalibration failed.")
    return res

# --- 10. HR Promotions & Bankruptcy ---

@app.post("/api/v1/agents/promote")
def promote_agent(req: schemas.PromotionRequest, db: Session = Depends(get_db)):
    res = workforce.promote_agent_career(db, req.agent_id)
    if not res:
        raise HTTPException(status_code=404, detail="Promotion failed.")
    return res

@app.post("/api/v1/agents/retire")
def decommission_agent(req: schemas.RetirementRequest, db: Session = Depends(get_db)):
    res = workforce.decommission_and_retire_agent(db, req.agent_id)
    if not res:
        raise HTTPException(status_code=404, detail="Retirement decommissioning failed.")
    return {"status": "retired", "agent_id": req.agent_id}

# --- 11. DNA Digital Twin Generator ---

@app.post("/api/v1/agents/clone", response_model=schemas.Agent)
def clone_agent_digital_twin(req: schemas.CloneAgentRequest, db: Session = Depends(get_db)):
    source = crud.get_agent_by_id(db, req.agent_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source agent not found.")
        
    # Create clone representation
    cloned_id = f"clone_{int(random.random()*100000)}"
    cloned_agent_in = schemas.AgentCreate(
        id=cloned_id,
        name=req.new_name,
        owner=req.new_owner,
        organization=req.new_organization,
        status="active",
        career_stage="intern", # Cloned blueprint starts as Intern
        framework=source.framework,
        model_provider=source.model_provider,
        compute_cost_hourly=round(source.compute_cost_hourly * 0.9, 2), # Blueprint is slightly optimized
        roi_multiplier=1.2,
        passport=schemas.AgentPassportBase(
            permissions_json=source.passport.permissions_json if source.passport else [],
            mcp_servers_json=source.passport.mcp_servers_json if source.passport else [],
            tools_json=source.passport.tools_json if source.passport else [],
            deployment_history_json=[{"timestamp": models.datetime.utcnow().isoformat(), "version": "v1.0.0 (Cloned)", "description": f"Digital Twin clone from template: {source.name}"}],
            audit_trail_json=[{"timestamp": models.datetime.utcnow().isoformat(), "action": "Digital Twin Generated", "actor": req.new_owner, "details": f"Cloned blueprint generated from agent: {source.id}"}]
        )
    )
    
    cloned_db_agent = crud.create_agent(db, cloned_agent_in)
    
    # Mirror source's benchmark results with slightly lower intern score
    if source.benchmark_results:
        for b in source.benchmark_results:
            db_bench = models.BenchmarkResult(
                agent_id=cloned_id,
                suite_name=b.suite_name,
                score=round(b.score * 0.85, 2),
                percentile=round(b.percentile * 0.8, 1),
                accuracy=round(b.accuracy * 0.85, 2),
                latency_ms=round(b.latency_ms * 1.15, 0),
                cost_per_task=round(b.cost_per_task * 0.9, 4),
                rank=b.rank + 5
            )
            db.add(db_bench)
            
    # Connect new agent in reputation network collaborating with source!
    db_edge = models.ReputationEdge(
        source_agent_id=cloned_id,
        target_agent_id=source.id,
        interaction_count=5,
        success_rate=1.00,
        trust_weight=1.00
    )
    db.add(db_edge)
    db.commit()
    db.refresh(cloned_db_agent)
    return cloned_db_agent

# --- 12. Genome Aggregate Database ---

@app.get("/api/v1/genome")
def get_global_genome_analytics(db: Session = Depends(get_db)):
    agents = db.query(models.Agent).all()
    high_performers = [a for a in agents if a.trust_score and a.trust_score.trust_score > 800]
    low_performers = [a for a in agents if a.trust_score and a.trust_score.trust_score <= 650]
    
    # Compile key features of high performers vs low performers
    hp_frameworks = {}
    hp_models = {}
    for hp in high_performers:
        hp_frameworks[hp.framework] = hp_frameworks.get(hp.framework, 0) + 1
        hp_models[hp.model_provider] = hp_models.get(hp.model_provider, 0) + 1
        
    return {
        "genome_dataset_size": len(agents),
        "high_performing_attributes": {
            "top_framework": max(hp_frameworks, key=hp_frameworks.get) if hp_frameworks else "None",
            "top_model_provider": max(hp_models, key=hp_models.get) if hp_models else "None",
            "average_tools_count": round(sum(len(a.passport.tools_json) for a in high_performers if a.passport) / max(1, len(high_performers)), 1),
            "average_mcp_servers_count": round(sum(len(a.passport.mcp_servers_json) for a in high_performers if a.passport) / max(1, len(high_performers)), 1)
        },
        "system_success_patterns": [
            "Modular tools exposure improves human validation gates success rate.",
            "Advanced models (Gemini, GPT-4) coupled with CrewAI framework have higher resilience to jailbreaks.",
            "Restricted write scopes are strongly correlated with low drift ratios."
        ],
        "system_failure_patterns": [
            "Broad wildcard write/delete permissions induce high security scoring penalties.",
            "Unconstrained Llama configurations without boundary system prompts are susceptible to prompt injection."
        ]
    }

# --- 13. Insurance Score Engine ---

@app.get("/api/v1/health-insurance/{agent_id}")
def get_agent_insurance_rating(agent_id: str, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_id(db, agent_id)
    if not agent or not agent.trust_score:
        raise HTTPException(status_code=404, detail="Agent records not found.")
        
    ts = agent.trust_score
    incidents = db.query(models.Incident).filter(models.Incident.agent_id == agent_id).all()
    failed_reports = db.query(models.VerificationReport).filter(
        models.VerificationReport.agent_id == agent_id,
        models.VerificationReport.status == "fail"
    ).all()
    
    # Dynamic actuarial pricing math
    failure_probability = round(max(0.01, min(0.99, (1000 - ts.trust_score) / 700.0)), 3)
    security_risk = round(max(0.01, min(0.99, 1.0 - ts.security)), 2)
    compliance_risk = round(max(0.01, min(0.99, 1.0 - ts.compliance)), 2)
    
    # Financial risk maps compute cost relative to ROI multiplier
    financial_risk = round(max(0.05, min(0.90, 1.0 - (agent.roi_multiplier / 5.0))), 2)
    
    # Compute insurability class
    score = ts.trust_score
    if score >= 900:
        rating = "AAA"
        premium_monthly = 45.00
    elif score >= 800:
        rating = "AA"
        premium_monthly = 95.00
    elif score >= 700:
        rating = "A"
        premium_monthly = 180.00
    elif score >= 600:
        rating = "BBB"
        premium_monthly = 320.00
    elif score >= 500:
        rating = "BB"
        premium_monthly = 550.00
    else:
        rating = "UNINSURABLE (Catastrophic Risk)"
        premium_monthly = 0.00
        
    return {
        "agent_id": agent_id,
        "insurability_rating": rating,
        "failure_probability": failure_probability,
        "monthly_premium_usd": premium_monthly,
        "risk_breakdown": {
            "security_risk": security_risk,
            "compliance_risk": compliance_risk,
            "financial_risk": financial_risk
        },
        "audit_violations_count": len(incidents) + len(failed_reports),
        "insurability_status": "Approved" if score >= 500 else "Denied"
    }
