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
