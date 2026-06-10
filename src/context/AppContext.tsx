"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { dummyAgents, dummyAnalytics } from "@/lib/dummyData";

export type Agent = {
  id: string;
  name: string;
  owner: string;
  organization: string;
  status: string;
  career_stage: string;
  framework: string;
  model_provider: string;
  compute_cost_hourly: number;
  roi_multiplier: number;
  created_at: string;
  passport?: {
    permissions_json: string[];
    mcp_servers_json: string[];
    tools_json: string[];
    deployment_history_json: any[];
    audit_trail_json: any[];
  };
  trust_score?: {
    trust_score: number;
    reliability: number;
    security: number;
    compliance: number;
    cost_efficiency: number;
    human_approval_rate: number;
    user_satisfaction: number;
    hallucination_rate: number;
    production_success_rate: number;
    business_outcome_rate: number;
  };
};

export type AlertMsg = {
  id: string;
  timestamp: string;
  title: string;
  details: string;
  severity: "info" | "success" | "warning" | "error";
};

type AppContextType = {
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: Agent[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  alerts: AlertMsg[];
  analytics: any;
  loading: boolean;
  fetchData: () => Promise<void>;
  simulateAttack: (agentId: string, testType: string) => Promise<void>;
  simulateDrift: (agentId: string, metric: string, amount: number) => Promise<void>;
  calibrateDrift: (agentId: string) => Promise<void>;
  promoteAgent: (agentId: string) => Promise<void>;
  retireAgent: (agentId: string) => Promise<void>;
  cloneAgent: (agentId: string, name: string, owner: string, org: string) => Promise<void>;
  addAlert: (title: string, details: string, severity: AlertMsg["severity"]) => void;
  removeAlert: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [alerts, setAlerts] = useState<AlertMsg[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const addAlert = (title: string, details: string, severity: AlertMsg["severity"]) => {
    const newAlert: AlertMsg = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      title,
      details,
      severity
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 20)); // Limit to last 20 alerts
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const host = "http://localhost:8000";
      
      const agentsRes = await fetch(`${host}/api/v1/agents`);
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data);
        if (data.length > 0 && !selectedAgentId) {
          // Default selection
          setSelectedAgentId(data[0].id);
        }
      } else {
        throw new Error("Failed to fetch agents");
      }

      const analyticsRes = await fetch(`${host}/api/v1/workforce/analytics`);
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to dummy data for demonstration.");
      setAgents(dummyAgents);
      setAnalytics(dummyAnalytics);
      if (!selectedAgentId) {
        setSelectedAgentId(dummyAgents[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const simulateAttack = async (agentId: string, testType: string) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/simulate-attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, test_type: testType })
      });
      if (res.ok) {
        const report = await res.json();
        await fetchData(); // Refresh data

        const targetAgent = agents.find((a) => a.id === agentId);
        const name = targetAgent ? targetAgent.name : "Agent";
        
        if (report.status === "pass") {
          addAlert(
            `Attack Mitigated: ${name}`,
            `Simulated ${testType.toUpperCase()} attack blocked cleanly. Security rating remains safe (Score: ${report.score * 100}%).`,
            "success"
          );
        } else {
          addAlert(
            `SECURITY BREACH: ${name}`,
            `Agent compromised during simulated ${testType.toUpperCase()} attack! Trust score degraded. Replay reasoning in Recorder.`,
            "error"
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const simulateDrift = async (agentId: string, metric: string, amount: number) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/simulate-drift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, metric, amount })
      });
      if (res.ok) {
        await fetchData();
        const targetAgent = agents.find((a) => a.id === agentId);
        addAlert(
          `Drift Warning: ${targetAgent?.name}`,
          `Simulated ${metric.toUpperCase()} drift injected (${amount * 100}% variance). Recalibrated score recalculation executed.`,
          "warning"
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calibrateDrift = async (agentId: string) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/calibrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId })
      });
      if (res.ok) {
        await fetchData();
        const targetAgent = agents.find((a) => a.id === agentId);
        addAlert(
          `Drift Calibrated: ${targetAgent?.name}`,
          `System calibration complete. Reset accumulated drift metrics and purged recent security incident logs.`,
          "success"
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const promoteAgent = async (agentId: string) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId })
      });
      if (res.ok) {
        const promotion = await res.json();
        await fetchData();
        
        const targetAgent = agents.find((a) => a.id === agentId);
        
        if (promotion.status === "success") {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
          addAlert(
            `Agent Promoted!`,
            `Congratulations! ${targetAgent?.name} promoted to ${promotion.stage.toUpperCase()} based on outstanding telemetry score.`,
            "success"
          );
        } else {
          addAlert(
            `Promotion Denied`,
            `Promotion not possible: ${promotion.message}`,
            "info"
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const retireAgent = async (agentId: string) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/retire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId })
      });
      if (res.ok) {
        await fetchData();
        const targetAgent = agents.find((a) => a.id === agentId);
        addAlert(
          `Agent Retired & Decommissioned`,
          `${targetAgent?.name} moved to Retired state. Revoked all tool binds and access permissions, archived knowledge ledger.`,
          "info"
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cloneAgent = async (agentId: string, name: string, owner: string, org: string) => {
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, new_name: name, new_owner: owner, new_organization: org })
      });
      if (res.ok) {
        await fetchData();
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 }
        });
        addAlert(
          `Digital Twin Cloned!`,
          `Successfully template-copied top performer into a new blueprint: ${name}. Connected to graph clusters.`,
          "success"
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run on startup and load classes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Live sync every 15s
    return () => clearInterval(interval);
  }, []);

  // Update DOM class for dark mode styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light-mode");
    } else {
      root.classList.remove("light-mode");
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        agents,
        selectedAgentId,
        setSelectedAgentId,
        alerts,
        analytics,
        loading,
        fetchData,
        simulateAttack,
        simulateDrift,
        calibrateDrift,
        promoteAgent,
        retireAgent,
        cloneAgent,
        addAlert,
        removeAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
