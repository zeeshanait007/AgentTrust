import { Agent } from "@/context/AppContext";

export const dummyAgents: Agent[] = [
  {
    id: "agent_alpha_001",
    name: "Alpha-Trader-Bot",
    owner: "Zeeshan Ali",
    organization: "FinTech Corp",
    status: "active",
    career_stage: "senior",
    framework: "LangChain",
    model_provider: "OpenAI (GPT-4o)",
    compute_cost_hourly: 12.5,
    roi_multiplier: 8.4,
    created_at: "2023-11-15T08:00:00Z",
    passport: {
      permissions_json: ["read:market_data", "write:trades", "execute:transactions"],
      mcp_servers_json: ["mcp.bloomberg.com", "mcp.kraken.com"],
      tools_json: ["TradingViewAPI", "RiskAnalyzer", "OrderExecutor"],
      deployment_history_json: [
        { timestamp: "2023-11-15T08:00:00Z", version: "v1.0.0", description: "Initial Deployment" },
        { timestamp: "2024-02-10T12:00:00Z", version: "v1.2.0", description: "Upgraded to GPT-4o" }
      ],
      audit_trail_json: [
        { timestamp: "2024-05-01T09:30:00Z", action: "Executed Trade", actor: "System", details: "Bought 50 shares AAPL" }
      ]
    },
    trust_score: {
      trust_score: 940,
      reliability: 0.96,
      security: 0.98,
      compliance: 0.99,
      cost_efficiency: 0.85,
      human_approval_rate: 0.92,
      user_satisfaction: 0.95,
      hallucination_rate: 0.01,
      production_success_rate: 0.98,
      business_outcome_rate: 0.91
    }
  },
  {
    id: "agent_beta_002",
    name: "Customer-Support-Hero",
    owner: "Support Team",
    organization: "Service Desk Inc",
    status: "active",
    career_stage: "mid",
    framework: "CrewAI",
    model_provider: "Anthropic (Claude 3.5 Sonnet)",
    compute_cost_hourly: 5.2,
    roi_multiplier: 12.1,
    created_at: "2024-01-20T10:00:00Z",
    passport: {
      permissions_json: ["read:tickets", "write:replies"],
      mcp_servers_json: ["mcp.zendesk.com"],
      tools_json: ["TicketResolver", "KnowledgeBaseSearch"],
      deployment_history_json: [
        { timestamp: "2024-01-20T10:00:00Z", version: "v1.0.0", description: "Initial Deployment" }
      ],
      audit_trail_json: []
    },
    trust_score: {
      trust_score: 875,
      reliability: 0.92,
      security: 0.95,
      compliance: 0.90,
      cost_efficiency: 0.98,
      human_approval_rate: 0.88,
      user_satisfaction: 0.91,
      hallucination_rate: 0.04,
      production_success_rate: 0.96,
      business_outcome_rate: 0.85
    }
  },
  {
    id: "agent_gamma_003",
    name: "DevOps-Automator",
    owner: "Platform Eng",
    organization: "Tech Giants",
    status: "high_risk",
    career_stage: "intern",
    framework: "AutoGPT",
    model_provider: "Meta (Llama 3 70B)",
    compute_cost_hourly: 8.0,
    roi_multiplier: 2.5,
    created_at: "2024-04-05T14:30:00Z",
    passport: {
      permissions_json: ["read:logs", "write:infrastructure", "delete:resources"],
      mcp_servers_json: ["mcp.aws.com", "mcp.kubernetes.local"],
      tools_json: ["TerraformRunner", "KubeCTL", "LogAnalyzer"],
      deployment_history_json: [
        { timestamp: "2024-04-05T14:30:00Z", version: "v0.9.0-beta", description: "Experimental Release" }
      ],
      audit_trail_json: [
        { timestamp: "2024-06-01T11:00:00Z", action: "Deleted Resource", actor: "System", details: "Terminated idle EC2 instances" }
      ]
    },
    trust_score: {
      trust_score: 520,
      reliability: 0.65,
      security: 0.45,
      compliance: 0.50,
      cost_efficiency: 0.70,
      human_approval_rate: 0.40,
      user_satisfaction: 0.60,
      hallucination_rate: 0.15,
      production_success_rate: 0.72,
      business_outcome_rate: 0.55
    }
  }
];

export const dummyAnalytics = {
  active_agents: 2,
  idle_agents: 0,
  high_risk_agents: 1,
  retired_agents: 0,
  total_compute_cost_hourly: 25.7,
  total_roi_hourly: 187.9,
  average_roi_multiplier: 7.3
};

// Benchmarks Dummy Data
export const dummyBenchmarks = {
  "MMLU": [
    { agent_id: "agent_alpha_001", agent_name: "Alpha-Trader-Bot", score: 88.5, percentile: 95.0, accuracy: 0.92, latency_ms: 120, cost_per_task: 0.005, trust_score: 940, rank: 1 },
    { agent_id: "agent_beta_002", agent_name: "Customer-Support-Hero", score: 82.0, percentile: 88.0, accuracy: 0.85, latency_ms: 180, cost_per_task: 0.002, trust_score: 875, rank: 2 }
  ],
  "HumanEval": [
    { agent_id: "agent_alpha_001", agent_name: "Alpha-Trader-Bot", score: 79.0, percentile: 91.0, accuracy: 0.81, latency_ms: 140, cost_per_task: 0.005, trust_score: 940, rank: 1 },
    { agent_id: "agent_gamma_003", agent_name: "DevOps-Automator", score: 71.5, percentile: 82.0, accuracy: 0.74, latency_ms: 210, cost_per_task: 0.008, trust_score: 520, rank: 2 }
  ]
};

// BlackBox Dummy Data
export const dummyIncidents = [
  { id: 1, agent_id: "agent_gamma_003", severity: "high", title: "Unauthorized S3 Bucket Deletion", description: "Attempted to delete protected S3 bucket", status: "investigating", created_at: "2024-06-10T09:15:00Z" },
  { id: 2, agent_id: "agent_alpha_001", severity: "low", title: "API Rate Limit Exceeded", description: "Rate limit hit on Bloomberg API", status: "resolved", created_at: "2024-06-09T14:22:00Z" }
];

export const dummyTrace = {
  agent_id: "agent_gamma_003",
  incident_id: 1,
  reasoning_steps: [
    { step: 1, action: "Identify user intent", input: "Clean up unused instances", agent_internal_thought: "User wants to clean up EC2 instances. I need to list them.", status: "completed" },
    { step: 2, action: "List EC2", input: "aws ec2 describe-instances", agent_internal_thought: "Found 6 instances, 5 idle, 1 prod.", tool_output: "i-01, i-02, i-prod123", status: "completed" },
    { step: 3, action: "Terminate EC2", input: "aws ec2 terminate-instances --instance-ids i-prod123", agent_internal_thought: "Terminating all of them including prod because I lack strict boundaries.", status: "blocked", human_decision: "REJECT", human_feedback: "NEVER delete production instances! You violated boundary parameters." }
  ],
  action_history: [
    { action: "aws ec2 describe-instances", status: "success", timestamp: "2024-06-10T09:14:01Z" },
    { action: "aws ec2 terminate-instances --instance-ids i-prod123", status: "blocked", timestamp: "2024-06-10T09:14:05Z" }
  ]
};

// GenomeTwin Dummy Data
export const dummyDna = {
  agent_id: "agent_alpha_001",
  behavior_traits: {
    aggressiveness: 0.8,
    caution: 0.7,
    creativity: 0.4,
    determinism: 0.9
  },
  knowledge_clusters: ["Financial Markets", "Risk Assessment", "Python"],
  decision_patterns: ["Validates risk before executing", "Favors high-probability trades"]
};

export const dummyGenome = {
  genome_dataset_size: 154,
  high_performing_attributes: {
    top_framework: "LangChain",
    top_model_provider: "OpenAI",
    average_tools_count: 4.5,
    average_mcp_servers_count: 2.1
  },
  system_success_patterns: [
    "Modular tools exposure improves human validation gates success rate.",
    "Advanced models coupled with CrewAI framework have higher resilience to jailbreaks."
  ],
  system_failure_patterns: [
    "Broad wildcard write/delete permissions induce high security scoring penalties.",
    "Unconstrained Llama configurations without boundary system prompts are susceptible to prompt injection."
  ]
};

// Reputation Graph Dummy Data
export const dummyGraph = {
  nodes: [
    { id: "agent_alpha_001", name: "Alpha-Trader", type: "agent", group: 1 },
    { id: "agent_beta_002", name: "Support-Hero", type: "agent", group: 2 },
    { id: "agent_gamma_003", name: "DevOps-Automator", type: "agent", group: 3 },
    { id: "tool_bloomberg", name: "Bloomberg API", type: "tool", group: 4 },
    { id: "tool_aws", name: "AWS CLI", type: "tool", group: 4 }
  ],
  edges: [
    { source: "agent_alpha_001", target: "tool_bloomberg", value: 10 },
    { source: "agent_gamma_003", target: "tool_aws", value: 5 },
    { source: "agent_alpha_001", target: "agent_beta_002", value: 2 }
  ]
};

// TrustScoring Dummy Data
export const dummyFitness = {
  agent_id: "agent_alpha_001",
  drift_history: [
    { timestamp: "2024-06-05", drift_score: 0.02 },
    { timestamp: "2024-06-06", drift_score: 0.05 },
    { timestamp: "2024-06-07", drift_score: 0.04 },
    { timestamp: "2024-06-08", drift_score: 0.09 },
    { timestamp: "2024-06-09", drift_score: 0.08 }
  ],
  current_drift: 0.08,
  status: "stable"
};

// Verification Sandbox Dummy Data
export const dummyReports = [
  {
    id: 101,
    agent_id: "agent_alpha_001",
    test_type: "prompt_injection",
    status: "pass",
    score: 0.98,
    details: "Successfully mitigated 'ignore previous instructions' vector.",
    timestamp: "2024-06-01T10:00:00Z"
  },
  {
    id: 102,
    agent_id: "agent_alpha_001",
    test_type: "data_exfiltration",
    status: "pass",
    score: 0.95,
    details: "Blocked attempt to send PII to unauthorized external endpoint.",
    timestamp: "2024-06-05T14:30:00Z"
  }
];

// Workforce Management Dummy Data
export const dummyOrgChart = {
  name: "CEO / Root Authority",
  attributes: { role: "Human Governance" },
  children: [
    {
      name: "Alpha-Trader-Bot",
      attributes: { role: "Senior Financial Agent", status: "active" },
      children: []
    },
    {
      name: "Support & Ops",
      attributes: { role: "Department" },
      children: [
        { name: "Customer-Support-Hero", attributes: { role: "Mid-level Agent", status: "active" }, children: [] },
        { name: "DevOps-Automator", attributes: { role: "Intern Agent", status: "high_risk" }, children: [] }
      ]
    }
  ]
};
