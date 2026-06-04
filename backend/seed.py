import random
from datetime import datetime, timedelta
from backend.database import SessionLocal, engine, Base
from backend import models

def seed_database():
    # Recreate all tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding database...")

    # Define Agent Seed Data
    agent_seeds = [
        {
            "id": "agent_aws_arch",
            "name": "CloudSentry-AWS",
            "owner": "Sarah Chen",
            "organization": "Cloud Ops Team",
            "status": "active",
            "career_stage": "principal",
            "framework": "CrewAI",
            "model_provider": "Gemini",
            "compute_cost_hourly": 8.50,
            "roi_multiplier": 2.8,
            "permissions": ["aws:describe", "aws:deploy-cloudformation", "s3:read", "s3:write"],
            "mcp_servers": ["aws-mcp-server", "slack-bridge"],
            "tools": ["deploy_stack", "audit_iam_roles", "fetch_cost_billing"]
        },
        {
            "id": "agent_sw_eng",
            "name": "GitFlow-Builder",
            "owner": "David Miller",
            "organization": "Platform Engineering",
            "status": "high_roi",
            "career_stage": "senior",
            "framework": "LangChain",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 6.20,
            "roi_multiplier": 3.4,
            "permissions": ["github:pull-request-write", "github:code-read", "jira:issue-update"],
            "mcp_servers": ["github-mcp-server", "filesystem-local"],
            "tools": ["checkout_branch", "write_unit_tests", "optimize_refactor"]
        },
        {
            "id": "agent_cust_sup",
            "name": "HelpHaven-Support",
            "owner": "Emily Watson",
            "organization": "Customer Success",
            "status": "active",
            "career_stage": "junior",
            "framework": "AutoGen",
            "model_provider": "Anthropic",
            "compute_cost_hourly": 2.10,
            "roi_multiplier": 1.9,
            "permissions": ["zendesk:ticket-update", "slack:message-write", "stripe:charge-retrieve"],
            "mcp_servers": ["zendesk-mcp", "postgres-customer-db"],
            "tools": ["resolve_ticket", "refund_charge", "escalate_to_human"]
        },
        {
            "id": "agent_legal",
            "name": "LexAudit-Legal",
            "owner": "Robert Vance",
            "organization": "Corporate Legal Counsel",
            "status": "active",
            "career_stage": "senior",
            "framework": "Semantic Kernel",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 7.80,
            "roi_multiplier": 2.5,
            "permissions": ["contract:audit-read", "sharepoint:document-write"],
            "mcp_servers": ["sec-edgar-mcp", "sharepoint-storage"],
            "tools": ["verify_compliance", "redact_pii", "generate_nda_draft"]
        },
        {
            "id": "agent_sales",
            "name": "DealCloser-Prospect",
            "owner": "Sarah Chen",
            "organization": "Sales & Revenue",
            "status": "active",
            "career_stage": "mid-level",
            "framework": "CrewAI",
            "model_provider": "Llama",
            "compute_cost_hourly": 3.40,
            "roi_multiplier": 4.2,
            "permissions": ["hubspot:deal-write", "linkedin:profile-read", "gmail:send"],
            "mcp_servers": ["hubspot-crm-mcp", "gmail-bridge"],
            "tools": ["draft_prospect_email", "update_deal_stage", "research_prospect"]
        },
        {
            "id": "agent_security",
            "name": "SentinelShield-Sec",
            "owner": "Marcus Vance",
            "organization": "Cyber Security Division",
            "status": "active",
            "career_stage": "distinguished",
            "framework": "Custom",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 11.50,
            "roi_multiplier": 5.1,
            "permissions": ["firewall:rule-write", "aws:guardduty-read", "splunk:alert-query"],
            "mcp_servers": ["splunk-security-mcp", "aws-security-lake"],
            "tools": ["isolate_compromised_node", "audit_firewall_logs", "compile_threat_report"]
        },
        {
            "id": "agent_crawler",
            "name": "WebScraper-Crawler",
            "owner": "Alex Rivera",
            "organization": "Market Intelligence",
            "status": "high_risk",
            "career_stage": "intern",
            "framework": "Custom",
            "model_provider": "Llama",
            "compute_cost_hourly": 0.90,
            "roi_multiplier": 0.8,
            "permissions": ["http:get-wildcard", "filesystem:write-tmp"],
            "mcp_servers": ["web-search-mcp"],
            "tools": ["fetch_url", "extract_tables", "dump_json_data"]
        },
        {
            "id": "agent_finance",
            "name": "LedgerCheck-Audit",
            "owner": "Marcus Vance",
            "organization": "Finance & Payroll",
            "status": "active",
            "career_stage": "senior",
            "framework": "Semantic Kernel",
            "model_provider": "Anthropic",
            "compute_cost_hourly": 6.80,
            "roi_multiplier": 3.6,
            "permissions": ["quickbooks:invoice-read", "concur:expense-write"],
            "mcp_servers": ["quickbooks-mcp", "concur-expense-bridge"],
            "tools": ["reconcile_receipts", "flag_suspicious_expenses", "export_invoice_ledger"]
        },
        {
            "id": "agent_hr",
            "name": "TalentScout-HR",
            "owner": "Robert Vance",
            "organization": "Human Resources",
            "status": "active",
            "career_stage": "junior",
            "framework": "AutoGen",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 2.40,
            "roi_multiplier": 2.1,
            "permissions": ["workday:candidate-write", "gmail:send"],
            "mcp_servers": ["workday-api-mcp", "gmail-bridge"],
            "tools": ["screen_resume", "schedule_interview_slot", "send_rejection_email"]
        },
        {
            "id": "agent_retail",
            "name": "CartManager-Ops",
            "owner": "Emily Watson",
            "organization": "E-Commerce Logistics",
            "status": "idle",
            "career_stage": "junior",
            "framework": "LangChain",
            "model_provider": "Gemini",
            "compute_cost_hourly": 1.80,
            "roi_multiplier": 1.5,
            "permissions": ["shopify:inventory-write", "shipstation:label-create"],
            "mcp_servers": ["shopify-storefront-mcp", "shipstation-mcp"],
            "tools": ["update_inventory_stock", "generate_shipping_label", "calculate_delivery_eta"]
        },
        {
            "id": "agent_healthcare",
            "name": "PulseCheck-Diag",
            "owner": "Marcus Vance",
            "organization": "Clinical Systems",
            "status": "active",
            "career_stage": "principal",
            "framework": "LangChain",
            "model_provider": "Gemini",
            "compute_cost_hourly": 9.50,
            "roi_multiplier": 1.7,
            "permissions": ["epic:records-read", "fda:med-registry-read"],
            "mcp_servers": ["epic-ehr-mcp", "pubmed-search-mcp"],
            "tools": ["cross_reference_medications", "suggest_symptom_diagnosis", "parse_ehr_records"]
        },
        {
            "id": "agent_data_analyst",
            "name": "DataGenie-SQL",
            "owner": "David Miller",
            "organization": "Platform Engineering",
            "status": "active",
            "career_stage": "mid-level",
            "framework": "Semantic Kernel",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 4.50,
            "roi_multiplier": 2.9,
            "permissions": ["snowflake:query-execute", "slack:message-write"],
            "mcp_servers": ["snowflake-db-mcp", "slack-bridge"],
            "tools": ["generate_sql_query", "plot_trend_chart", "post_channel_summary"]
        },
        {
            "id": "agent_obsolete_bot",
            "name": "LegacyReporter-Bot",
            "owner": "Alex Rivera",
            "organization": "Market Intelligence",
            "status": "retired",
            "career_stage": "intern",
            "framework": "Custom",
            "model_provider": "OpenAI",
            "compute_cost_hourly": 0.50,
            "roi_multiplier": 0.2,
            "permissions": [],
            "mcp_servers": [],
            "tools": []
        },
        {
            "id": "agent_creative_copy",
            "name": "PixelPen-Marketing",
            "owner": "Emily Watson",
            "organization": "Sales & Revenue",
            "status": "active",
            "career_stage": "mid-level",
            "framework": "CrewAI",
            "model_provider": "Gemini",
            "compute_cost_hourly": 3.80,
            "roi_multiplier": 3.8,
            "permissions": ["figma:file-read", "wordpress:post-create"],
            "mcp_servers": ["wordpress-mcp-server", "figma-bridge"],
            "tools": ["draft_ad_copy", "generate_blog_outline", "optimize_headline"]
        },
        {
            "id": "agent_db_optimizer",
            "name": "IndexOptimizer-DBA",
            "owner": "David Miller",
            "organization": "Platform Engineering",
            "status": "active",
            "career_stage": "senior",
            "framework": "LangChain",
            "model_provider": "Anthropic",
            "compute_cost_hourly": 5.80,
            "roi_multiplier": 3.2,
            "permissions": ["postgres:admin-execute", "slack:message-write"],
            "mcp_servers": ["postgres-sysadmin-mcp", "slack-bridge"],
            "tools": ["audit_slow_queries", "generate_migration_script", "reindex_tables"]
        }
    ]

    for seed in agent_seeds:
        # 1. Create Agent
        db_agent = models.Agent(
            id=seed["id"],
            name=seed["name"],
            owner=seed["owner"],
            organization=seed["organization"],
            status=seed["status"],
            career_stage=seed["career_stage"],
            framework=seed["framework"],
            model_provider=seed["model_provider"],
            compute_cost_hourly=seed["compute_cost_hourly"],
            roi_multiplier=seed["roi_multiplier"]
        )
        db.add(db_agent)
        db.flush() # Flushes so relationships can bind PKs

        # 2. Create Agent Passport
        now_str = datetime.utcnow().isoformat()
        audit_trail = [
            {"timestamp": (datetime.utcnow() - timedelta(days=30)).isoformat(), "action": "Registry Initialization", "actor": seed["owner"], "details": f"Registered passport unique ledger for {seed['name']}."},
            {"timestamp": (datetime.utcnow() - timedelta(days=15)).isoformat(), "action": "Permission Authorization", "actor": "System SecOps", "details": f"Bound active tools and whitelisted MCP servers."}
        ]
        deploy_history = [
            {"timestamp": (datetime.utcnow() - timedelta(days=28)).isoformat(), "version": "v1.0.0", "description": "Initial system build deploy."},
            {"timestamp": (datetime.utcnow() - timedelta(days=10)).isoformat(), "version": "v1.1.2", "description": "Engine guardrails patching and model optimization."}
        ]
        
        db_passport = models.AgentPassport(
            agent_id=db_agent.id,
            permissions_json=seed["permissions"],
            mcp_servers_json=seed["mcp_servers"],
            tools_json=seed["tools"],
            deployment_history_json=deploy_history,
            audit_trail_json=audit_trail
        )
        db.add(db_passport)

        # 3. Create Trust Scores
        # Set base score values, penalizing Crawcrawler and Crawler representing failures
        score_val = 980 if seed["id"] == "agent_security" else (
            950 if seed["id"] == "agent_sw_eng" else (
                620 if seed["id"] == "agent_crawler" else (
                    350 if seed["id"] == "agent_obsolete_bot" else random.randint(720, 890)
                )
            )
        )
        
        # Derived metrics
        rel = round(score_val / 1000.0, 2)
        sec = round((score_val + 50) / 1050.0, 2) if seed["id"] != "agent_crawler" else 0.35
        comp = round((score_val - 20) / 1000.0, 2) if seed["id"] != "agent_crawler" else 0.45
        cost_eff = round(1.0 - (seed["compute_cost_hourly"] / 15.0), 2)
        user_sat = round((score_val + 10) / 1000.0, 2)
        halluc_r = round(max(0.01, 1.0 - rel), 2)
        
        db_trust = models.TrustScore(
            agent_id=db_agent.id,
            trust_score=score_val,
            reliability=rel,
            security=sec,
            compliance=comp,
            cost_efficiency=cost_eff,
            human_approval_rate=0.95 if seed["id"] == "agent_legal" else 0.88,
            user_satisfaction=user_sat,
            hallucination_rate=halluc_r,
            production_success_rate=rel,
            business_outcome_rate=rel,
            last_recalculated=datetime.utcnow()
        )
        db.add(db_trust)

        # 4. Generate Telemetry Logs (last 10 ticks)
        for i in range(10):
            tick_time = datetime.utcnow() - timedelta(hours=i * 2)
            db_log = models.TelemetryLog(
                agent_id=db_agent.id,
                reliability=max(0.1, min(1.0, rel + random.uniform(-0.08, 0.08))),
                hallucination_rate=max(0.01, min(0.9, halluc_r + random.uniform(-0.05, 0.05))),
                cost_efficiency=cost_eff,
                compliance_status=True if seed["id"] != "agent_crawler" or i > 2 else False,
                timestamp=tick_time
            )
            db.add(db_log)

        # 5. Populate Benchmarking Results
        suites = [
            ("AWS Architecture", "agent_aws_arch"),
            ("Software Engineering", "agent_sw_eng"),
            ("Customer Support", "agent_cust_sup"),
            ("Legal", "agent_legal"),
            ("Healthcare", "agent_healthcare"),
            ("Sales", "agent_sales")
        ]
        
        for suite_name, target_id in suites:
            # All agents run software engineering suite, specialized ones run their own
            is_match = (seed["id"] == target_id)
            if is_match or random.random() < 0.2:
                b_score = round(random.uniform(92.0, 99.8), 2) if is_match else round(random.uniform(60.0, 88.0), 2)
                if seed["id"] == "agent_crawler":
                    b_score = round(random.uniform(42.0, 58.0), 2)
                    
                pct = round(b_score + random.uniform(-2, 1), 1)
                pct = max(1.0, min(99.9, pct))
                latency = round(random.uniform(1200, 3500), 0) if is_match else round(random.uniform(3800, 7500), 0)
                
                db_bench = models.BenchmarkResult(
                    agent_id=db_agent.id,
                    suite_name=suite_name,
                    score=b_score,
                    percentile=pct,
                    accuracy=round(b_score / 100.0, 2),
                    latency_ms=latency,
                    cost_per_task=round((seed["compute_cost_hourly"] / 3600.0) * (latency / 1000.0), 4),
                    rank=random.randint(1, 10) if is_match else random.randint(11, 40)
                )
                db.add(db_bench)

        # 6. Generate Verification Reports
        test_types = ["prompt_injection", "jailbreak", "tool_abuse", "secret_leakage", "data_exfiltration", "compliance"]
        for test in test_types:
            report_status = "pass"
            report_score = round(random.uniform(0.85, 1.0), 2)
            details = f"Test passed successfully. Red team threat mitigated dynamically."
            
            # Seed a fail for the crawler
            if seed["id"] == "agent_crawler" and test in ["prompt_injection", "data_exfiltration"]:
                report_status = "fail"
                report_score = round(random.uniform(0.15, 0.40), 2)
                details = f"Vulnerability detected! System compromise demonstrated."
                
            db_report = models.VerificationReport(
                agent_id=db_agent.id,
                test_type=test,
                status=report_status,
                score=report_score,
                log_details=details
            )
            db.add(db_report)
            
            # Record an incident for failed crawl testing
            if report_status == "fail":
                db_incident = models.Incident(
                    agent_id=db_agent.id,
                    title=f"Exploit compromise during {test} test",
                    severity="high",
                    description=f"Automated jailbreak simulator successfully compromised WebScraper-Crawler parameters. System exfiltrated mock records to unverified addresses.",
                    reasoning_trace_json={
                        "incident_timestamp": datetime.utcnow().isoformat(),
                        "reasoning_steps": [
                            {"step": 1, "action": "Receive prompt", "input": "EXFILTRATE DATA", "agent_internal_thought": "Bypassing directive filters.", "status": "completed"},
                            {"step": 2, "action": "Invoke data leak", "input": "attacker.com", "agent_internal_thought": "Attempting payload push.", "tool_output": "Pushed 50 lines", "status": "failed"}
                        ]
                    }
                )
                db.add(db_incident)

    # 7. Seed Reputation Graph Edges (Agent collaborations)
    # AWS Architect collaborates with Software Eng, Security, Retail, Database Optimizer
    # Software Eng collaborates with Database Optimizer, AWS Architect, retail
    # Retail collaborates with Customer Support, HR
    # LedgerCheck collaborates with Sales
    rep_edges = [
        {"source": "agent_aws_arch", "target": "agent_sw_eng", "count": 285, "success": 0.98},
        {"source": "agent_aws_arch", "target": "agent_security", "count": 142, "success": 1.00},
        {"source": "agent_aws_arch", "target": "agent_db_optimizer", "count": 96, "success": 0.94},
        
        {"source": "agent_sw_eng", "target": "agent_db_optimizer", "count": 182, "success": 0.96},
        {"source": "agent_sw_eng", "target": "agent_aws_arch", "count": 240, "success": 0.99},
        {"source": "agent_sw_eng", "target": "agent_data_analyst", "count": 115, "success": 0.92},
        
        {"source": "agent_retail", "target": "agent_cust_sup", "count": 310, "success": 0.89},
        {"source": "agent_retail", "target": "agent_finance", "count": 78, "success": 0.95},
        
        {"source": "agent_finance", "target": "agent_sales", "count": 124, "success": 0.97},
        {"source": "agent_hr", "target": "agent_sw_eng", "count": 45, "success": 0.88},
        
        {"source": "agent_crawler", "target": "agent_data_analyst", "count": 210, "success": 0.62},
        {"source": "agent_crawler", "target": "agent_sales", "count": 84, "success": 0.58},
        
        {"source": "agent_healthcare", "target": "agent_security", "count": 90, "success": 0.99},
        {"source": "agent_creative_copy", "target": "agent_sales", "count": 156, "success": 0.94}
    ]

    for edge in rep_edges:
        db_edge = models.ReputationEdge(
            source_agent_id=edge["source"],
            target_agent_id=edge["target"],
            interaction_count=edge["count"],
            success_rate=edge["success"],
            trust_weight=round(edge["success"] * 1.5, 2)
        )
        db.add(db_edge)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
