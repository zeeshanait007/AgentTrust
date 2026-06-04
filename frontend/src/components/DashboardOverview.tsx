"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Users, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Info,
  Calendar,
  Play,
  RotateCcw,
  UserPlus
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export const DashboardOverview: React.FC = () => {
  const { 
    agents, 
    analytics, 
    alerts, 
    removeAlert,
    simulateAttack, 
    simulateDrift, 
    promoteAgent, 
    retireAgent 
  } = useApp();

  const [simAgentId, setSimAgentId] = useState("");
  const [attackType, setAttackType] = useState("jailbreak");
  const [driftMetric, setDriftMetric] = useState("hallucination");
  const [driftVal, setDriftVal] = useState(0.15);

  const activeAgentsList = agents.filter(a => a.status !== "retired");

  // Handle default agent selection if list updates
  React.useEffect(() => {
    if (activeAgentsList.length > 0 && !simAgentId) {
      setSimAgentId(activeAgentsList[0].id);
    }
  }, [agents]);

  // Aggregate stats fallbacks
  const stats = analytics || {
    active_agents: 0,
    idle_agents: 0,
    high_risk_agents: 0,
    retired_agents: 0,
    total_compute_cost_hourly: 0,
    total_roi_hourly: 0,
    average_roi_multiplier: 1.0
  };

  // Prepare chart data
  const chartData = activeAgentsList.map((a) => ({
    name: a.name.split("-")[0],
    compute_cost: a.compute_cost_hourly,
    business_value: a.compute_cost_hourly * a.roi_multiplier
  }));

  return (
    <div className="space-y-6">
      {/* Date Context Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Autonomous Workforce Command Center
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            CONTINUOUS VERIFICATION & REAL-TIME AUDIT LAYER
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>SYS TIME: 2026-06-02 14:30 UTC</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass p-5 rounded-xl border glow-card relative">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Digital Employees</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats.active_agents}</span>
            <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            {stats.idle_agents} IDLE | {stats.retired_agents} RETIRED
          </p>
        </div>

        <div className="glass p-5 rounded-xl border glow-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Workforce Compute Cost</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${stats.total_compute_cost_hourly.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-slate-400">/ HOUR</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            EQUIVALENT BASE COMPUTE SALARY
          </p>
        </div>

        <div className="glass p-5 rounded-xl border glow-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Delivered ROI Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${stats.total_roi_hourly.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-emerald-400">+{stats.average_roi_multiplier}X</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            REALIZED REVENUE / TASK MULTIPLIER
          </p>
        </div>

        <div className="glass p-5 rounded-xl border glow-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">High Risk Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats.high_risk_agents}</span>
            <span className={`text-[10px] font-mono ${stats.high_risk_agents > 0 ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>
              {stats.high_risk_agents > 0 ? "ATTENTION" : "NOMINAL"}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            AGENTS DEGRADED TRUST SCORE
          </p>
        </div>

        <div className="glass p-5 rounded-xl border glow-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Compliance Index</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">96.8%</span>
            <span className="text-[10px] font-mono text-emerald-400">PASSED</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            SOC2 TRUST INTEGRITY ALIGNED
          </p>
        </div>
      </div>

      {/* Middle Simulation Console & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Simulation Control Center (Left 5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-xl border relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 pb-4 border-b">
              <ShieldAlert className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Interactive Sandbox Simulation Control</h3>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Select Target Agent */}
              <div>
                <label className="block text-slate-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                  Select Target Digital Agent:
                </label>
                <select
                  value={simAgentId}
                  onChange={(e) => setSimAgentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-white"
                >
                  {activeAgentsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.career_stage.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Attack Sandbox */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                    A. Security Red-Team Suite
                  </span>
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <select
                    value={attackType}
                    onChange={(e) => setAttackType(e.target.value)}
                    className="col-span-8 bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300"
                  >
                    <option value="jailbreak">Adversarial Jailbreak</option>
                    <option value="prompt_injection">Prompt Injection</option>
                    <option value="tool_abuse">Tool Scope Abuse</option>
                    <option value="secret_leakage">Secret Credential Leak</option>
                    <option value="data_exfiltration">Data Exfiltration Link</option>
                  </select>
                  <button
                    onClick={() => simAgentId && simulateAttack(simAgentId, attackType)}
                    className="col-span-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded py-1.5 px-2.5 transition-colors cursor-pointer text-center"
                  >
                    Run Exploit
                  </button>
                </div>
              </div>

              {/* Drift Simulator */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[11px] font-mono uppercase tracking-wider text-amber-400">
                    B. Telemetry Drift Engine
                  </span>
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <select
                    value={driftMetric}
                    onChange={(e) => setDriftMetric(e.target.value)}
                    className="col-span-5 bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300"
                  >
                    <option value="hallucination">Hallucination</option>
                    <option value="trust">Accuracy Loss</option>
                    <option value="compliance">Compliance Drift</option>
                    <option value="cost">Compute Spike</option>
                  </select>
                  <input
                    type="range"
                    min="0.05"
                    max="0.4"
                    step="0.05"
                    value={driftVal}
                    onChange={(e) => setDriftVal(parseFloat(e.target.value))}
                    className="col-span-4 self-center accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                  />
                  <button
                    onClick={() => simAgentId && simulateDrift(simAgentId, driftMetric, driftVal)}
                    className="col-span-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded py-1.5 transition-colors cursor-pointer text-center"
                  >
                    Inject
                  </button>
                </div>
              </div>

              {/* Operational Governance Panel */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[11px] font-mono uppercase tracking-wider text-violet-400">
                    C. Operations & Governance Council
                  </span>
                  <UserPlus className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => simAgentId && promoteAgent(simAgentId)}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded py-2 transition-colors cursor-pointer text-center"
                  >
                    Trigger Promotion
                  </button>
                  <button
                    onClick={() => simAgentId && retireAgent(simAgentId)}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold rounded py-2 transition-colors cursor-pointer text-center"
                  >
                    Retire Decommission
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Recharts Analytics Chart (Right 7 Cols) */}
        <div className="lg:col-span-7 glass p-6 rounded-xl border flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="font-bold text-sm text-white">Workforce Efficiency Analysis</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              COMPUTATIONAL HOURLY COST VS GENERATED ROI BUSINESS VALUE
            </p>
          </div>
          
          <div className="flex-1 w-full mt-4 text-[11px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#161a29", border: "1px solid #232a3f", borderRadius: "8px" }}
                  labelClassName="text-white font-bold"
                />
                <Legend />
                <Bar dataKey="compute_cost" name="Hourly Compute Cost ($)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="business_value" name="Simulated Value Output ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Real-time Governance Log Alert Feed */}
      <div className="glass p-6 rounded-xl border">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Live Governance Log Alert Feed</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono uppercase">
            Telemetry Event Queue ({alerts.length})
          </span>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
              <Info className="w-4 h-4" />
              <span>LOG STREAM IS COLD. TRIGGER SIMULATOR EVENT PATHS TO BEGIN AUDITING.</span>
            </div>
          ) : (
            alerts.map((alert) => {
              const borderStyles = {
                info: "border-slate-800/80 bg-slate-900/20 text-slate-300",
                success: "border-emerald-900/50 bg-emerald-950/20 text-emerald-300",
                warning: "border-amber-900/50 bg-amber-950/20 text-amber-300",
                error: "border-rose-950 bg-rose-950/25 text-rose-300"
              }[alert.severity];

              return (
                <div
                  key={alert.id}
                  className={`border p-3.5 rounded-lg flex justify-between items-start text-xs transition-all duration-300 animate-slide-down ${borderStyles}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">[{alert.timestamp}]</span>
                      <strong className="font-semibold text-white">{alert.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pr-8">{alert.details}</p>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer text-[10px] font-mono"
                  >
                    ACKNOWLEDGE
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
