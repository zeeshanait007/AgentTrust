"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Terminal, 
  Play, 
  HelpCircle,
  Clock,
  Layers,
  Database,
  ArrowRight
} from "lucide-react";

export const APISandbox: React.FC = () => {
  const { agents, selectedAgentId } = useApp();
  const [endpoint, setEndpoint] = useState(`/api/v1/agents/{id}/passport`);
  const [jsonOutput, setJsonOutput] = useState<string>("{}");
  const [loading, setLoading] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const triggerApiRequest = async () => {
    if (!selectedAgent) return;
    setLoading(true);
    
    // Parse target url
    const host = "http://localhost:8000";
    const path = endpoint.replace("{id}", selectedAgent.id);
    
    try {
      const res = await fetch(`${host}${path}`);
      if (res.ok) {
        const data = await res.json();
        setJsonOutput(JSON.stringify(data, null, 2));
      } else {
        setJsonOutput(JSON.stringify({ error: "HTTP Fetch error response from API gateway" }, null, 2));
      }
    } catch (e) {
      setJsonOutput(JSON.stringify({ error: "Failed to establish socket connection with Agent Trust API" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerApiRequest();
  }, [endpoint, selectedAgentId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT COLUMN: Swagger-style endpoint selector (5 Cols) */}
      <div className="lg:col-span-5 glass rounded-xl border flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-slate-900/60 shrink-0">
          <h4 className="font-bold text-xs text-white">Trust API Specifications</h4>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs font-mono select-none">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase block">Active Target Agent:</span>
            <div className="bg-slate-900 border p-2.5 rounded text-white text-[11px] font-sans font-bold">
              {selectedAgent?.name || "None Selected"} ({selectedAgent?.id || "None"})
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">GET Route endpoints:</span>
            
            <div className="space-y-2">
              {[
                { label: "Fetch Identity Passport Ledger", path: "/api/v1/agents/{id}/passport" },
                { label: "Fetch Universal Trust Matrix Details", path: "/api/v1/agents/{id}/trust" },
                { label: "Fetch Behavior DNA Personality", path: "/api/v1/agents/{id}/dna" },
                { label: "Fetch Rolling Telemetry Health Logs", path: "/api/v1/agents/{id}/fitness" },
                { label: "Fetch Insurability Actuarial Metrics", path: "/api/v1/health-insurance/{id}" },
                { label: "Fetch PageRank Collaboration Graph", path: "/api/v1/reputation/graph" }
              ].map((route) => {
                const isActive = endpoint === route.path;
                return (
                  <button
                    key={route.path}
                    onClick={() => setEndpoint(route.path)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? "bg-slate-900 border-cyan-500/50 text-cyan-400" 
                        : "bg-slate-900/40 border-slate-850 hover:border-slate-800 text-slate-400"
                    }`}
                  >
                    <div>
                      <div className={`text-[10px] font-sans font-bold ${isActive ? "text-white" : "text-slate-300"}`}>
                        {route.label}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5">{route.path}</div>
                    </div>
                    
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400">GET</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Terminal print JSON outputs (7 Cols) */}
      <div className="lg:col-span-7 glass rounded-xl border flex flex-col h-full overflow-hidden">
        
        {/* Header toolbar shrink-0 */}
        <div className="p-4 border-b bg-slate-900/60 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Trust API Query Console</h3>
          </div>
          
          <button
            disabled={loading}
            onClick={triggerApiRequest}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Send Call</span>
          </button>
        </div>

        {/* JSON Print Container */}
        <div className="flex-1 bg-black/95 p-5 font-mono text-[9px] text-cyan-400 overflow-y-auto leading-relaxed border-t border-black">
          {loading ? (
            <div className="animate-pulse">Fetching JSON payload from API gateway...</div>
          ) : (
            <pre className="whitespace-pre-wrap select-all">{jsonOutput}</pre>
          )}
        </div>
      </div>

    </div>
  );
};
