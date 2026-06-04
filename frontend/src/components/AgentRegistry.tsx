"use client";

import React, { useState } from "react";
import { useApp, Agent } from "@/context/AppContext";
import { 
  Search, 
  Filter, 
  Terminal, 
  Layers, 
  Lock, 
  Unlock, 
  Compass, 
  History, 
  FileText,
  User,
  Settings,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Database,
  ArrowRight,
  UserPlus
} from "lucide-react";

export const AgentRegistry: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId } = useApp();

  const [search, setSearch] = useState("");
  const [filterFramework, setFilterFramework] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Filtering Logic
  const filteredAgents = agents.filter((a) => {
    const matchesSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase());
    const matchesFramework = filterFramework === "all" || a.framework === filterFramework;
    const matchesStage = filterStage === "all" || a.career_stage === filterStage;
    const matchesStatus = filterStatus === "all" || (
      filterStatus === "active" ? a.status !== "retired" : a.status === "retired"
    );
    return matchesSearch && matchesFramework && matchesStage && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT COLUMN: Agent List & Search (7 Cols) */}
      <div className="lg:col-span-7 glass rounded-xl border flex flex-col h-full overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b space-y-3 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search Agent Passports by name, id, or owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500"
              />
            </div>
            <a
              href="/register"
              className="px-3.5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-750 hover:to-cyan-750 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Agent</span>
            </a>
          </div>

          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800/40 border px-2.5 py-1.5 rounded-lg text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">FILTERS</span>
            </div>
            
            <select
              value={filterFramework}
              onChange={(e) => setFilterFramework(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-300"
            >
              <option value="all">All Frameworks</option>
              <option value="LangChain">LangChain</option>
              <option value="AutoGen">AutoGen</option>
              <option value="CrewAI">CrewAI</option>
              <option value="Semantic Kernel">Semantic Kernel</option>
              <option value="Custom">Custom</option>
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-300"
            >
              <option value="all">All Stages</option>
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="mid-level">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="principal">Principal</option>
              <option value="distinguished">Distinguished</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active / High ROI</option>
              <option value="retired">Retired / Obsolete</option>
            </select>
          </div>
        </div>

        {/* Passport Registry Listing Spreadsheet */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 font-semibold">Agent Name / ID</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Technical Profile</th>
                <th className="p-4 font-semibold">Career Tier</th>
                <th className="p-4 font-semibold">Trust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    NO REGISTERED AGENTS MATCH SEARCH FILTERS
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const isSel = agent.id === selectedAgentId;
                  const score = agent.trust_score?.trust_score || 600;
                  
                  const statusColors = {
                    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
                    high_roi: "bg-violet-500/20 text-violet-400 border-violet-500/40",
                    high_risk: "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse",
                    retired: "bg-slate-800/40 text-slate-500 border-slate-700/30",
                    idle: "bg-sky-500/20 text-sky-400 border-sky-500/40"
                  }[agent.status] || "bg-slate-500/20 text-slate-400 border-slate-500/40";

                  return (
                    <tr
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`hover:bg-slate-800/30 cursor-pointer transition-colors ${
                        isSel ? "bg-slate-800/50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{agent.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{agent.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-300 font-medium">{agent.owner}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{agent.organization}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-cyan-400 font-semibold">{agent.framework}</div>
                        <div className="text-[10px] text-slate-400">{agent.model_provider}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold uppercase text-slate-300">
                        {agent.career_stage}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColors}`}>
                            {agent.status.toUpperCase()}
                          </span>
                          <span className="font-bold font-mono text-slate-300">{score} TS</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: Detail Passport Ledger (5 Cols) */}
      <div className="lg:col-span-5 glass rounded-xl border flex flex-col h-full overflow-hidden">
        {selectedAgent ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header Identity Badge */}
            <div className="p-5 border-b bg-slate-900/60 relative">
              <div className="absolute top-4 right-4 text-xs font-mono bg-slate-800 border px-2 py-1 rounded text-cyan-400 flex items-center gap-1.5">
                {selectedAgent.status === "retired" ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{selectedAgent.status === "retired" ? "LEDGER LOCKED" : "PUBLIC LEDGER"}</span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                AGENT TRUST PASSPORT
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{selectedAgent.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono">ID: {selectedAgent.id}</p>
            </div>

            {/* Passport Detail Scroll Panel */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              
              {/* Technical Specifications */}
              <div className="space-y-3 bg-slate-900/40 border border-slate-800/80 p-4 rounded-lg">
                <h4 className="font-bold text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-[10px]">
                  <div>
                    <span className="block text-slate-500 uppercase">Framework Framework:</span>
                    <span className="text-white text-xs font-semibold">{selectedAgent.framework}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase">Model Provider:</span>
                    <span className="text-white text-xs font-semibold">{selectedAgent.model_provider}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase">Exposed MCP Servers:</span>
                    <span className="text-white text-xs font-semibold">
                      {selectedAgent.passport?.mcp_servers_json.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase">Authorized Tools count:</span>
                    <span className="text-white text-xs font-semibold">
                      {selectedAgent.passport?.tools_json.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active MCP Tools & Permissions */}
              <div className="space-y-3">
                <h4 className="font-bold text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-violet-400" />
                  Authorized Tools & Permission Scopes
                </h4>
                <div className="space-y-2">
                  {selectedAgent.passport?.tools_json.length === 0 ? (
                    <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded text-rose-300 font-mono text-[10px]">
                      WARN: Permissions locked. Zero active tools bindings.
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Active Tool Binds:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAgent.passport?.tools_json.map((tool) => (
                            <span key={tool} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-white border border-slate-700/60 font-mono">
                              {tool}()
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Whitelisted Resource Permissions:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAgent.passport?.permissions_json.map((perm) => (
                            <span key={perm} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-cyan-400 border border-slate-800 font-mono">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Deployment Version Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-400" />
                  Deployment Registry History
                </h4>
                <div className="relative border-l border-slate-800 pl-4 space-y-4 font-mono text-[10px]">
                  {selectedAgent.passport?.deployment_history_json.map((dep, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                      <div className="flex justify-between items-center text-slate-500">
                        <span>{dep.timestamp.split("T")[0]}</span>
                        <span className="text-emerald-400 font-semibold">{dep.version}</span>
                      </div>
                      <p className="text-slate-300 mt-0.5">{dep.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immutable Blockchain-style Audit Trail */}
              <div className="space-y-3">
                <h4 className="font-bold text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Immutable Audit Ledger Trail
                </h4>
                <div className="space-y-3">
                  {selectedAgent.passport?.audit_trail_json.map((log, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-lg space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-cyan-400 font-semibold uppercase">{log.action}</span>
                        <span className="text-slate-500">{log.timestamp.split("T")[0]}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{log.details}</p>
                      <div className="flex items-center gap-2 pt-1 text-[9px] font-mono text-slate-500 border-t border-slate-800/50">
                        <span>ACTOR: {log.actor}</span>
                        <span>|</span>
                        <span>PROV: SHA-256</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>SELECT AN AGENT TO VIEW DETAILS PASSPORT</span>
          </div>
        )}
      </div>

    </div>
  );
};
