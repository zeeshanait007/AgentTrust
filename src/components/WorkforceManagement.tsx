"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { dummyOrgChart } from "@/lib/dummyData";
import { 
  Users2, 
  TrendingUp, 
  ArrowUpCircle, 
  Sliders, 
  HelpCircle,
  Clock,
  MapPin,
  Cpu,
  User,
  Zap,
  ArrowRight
} from "lucide-react";

export const WorkforceManagement: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId, promoteAgent, analytics } = useApp();
  const [orgChart, setOrgChart] = useState<any>({ nodes: [], edges: [] });

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const fetchOrgChart = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/workforce/orgchart");
      if (res.ok) {
        const data = await res.json();
        setOrgChart(data);
      } else {
        throw new Error("Fetch failed");
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to dummy data");
      setOrgChart(dummyOrgChart);
    }
  };

  useEffect(() => {
    fetchOrgChart();
  }, [agents]);

  if (!selectedAgent) {
    return <div className="text-center py-20 text-slate-500 font-mono">No active agents loaded.</div>;
  }

  // Career stages configuration list
  const stages = ["intern", "junior", "mid-level", "senior", "principal", "distinguished"];
  const currentIdx = stages.indexOf(selectedAgent.career_stage);

  return (
    <div className="space-y-6">
      
      {/* Overview Cards & Selected Profile Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Org Chart Visualization Pane (7 Cols) */}
        <div className="lg:col-span-7 glass p-6 rounded-xl border flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="font-bold text-sm text-white">Interactive Enterprise Org Chart</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              REPORTING STRUCTURES BETWEEN AGENTS AND HUMAN VP OPERATORS
            </p>
          </div>

          {/* Org chart node tree layout */}
          <div className="flex-1 w-full overflow-auto mt-4 p-4 bg-slate-950/40 border border-slate-900 rounded-lg flex flex-col items-center justify-center space-y-8 select-none">
            {/* CEO Root */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg border border-violet-500/30 text-center shadow-lg shadow-violet-500/10">
                <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold">CEO</div>
                <div className="text-white text-xs font-bold font-sans">Marcus Vance</div>
                <div className="text-[9px] text-slate-400">Chief Executive Officer</div>
              </div>
            </div>

            {/* Connecting line */}
            <div className="w-0.5 h-6 bg-slate-800" />

            {/* VP Operations */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-center">
                <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold">VP OPERATOR</div>
                <div className="text-white text-xs font-bold">Dr. Sarah Chen</div>
                <div className="text-[9px] text-slate-400">VP Autonomous Operations</div>
              </div>
            </div>

            {/* Connecting line */}
            <div className="w-0.5 h-6 bg-slate-800" />

            {/* Active digital agents listing horizontal nodes */}
            <div className="flex flex-wrap justify-center gap-3 max-w-lg">
              {agents.filter(a => a.status !== "retired" && a.career_stage in {"principal":1, "distinguished":1, "senior":1}).slice(0, 4).map((a) => {
                const isSel = a.id === selectedAgentId;
                
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAgentId(a.id)}
                    className={`px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                      isSel 
                        ? "bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5" 
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="text-[8px] font-mono text-slate-500 uppercase">{a.career_stage}</div>
                    <div className={`text-xs font-bold ${isSel ? "text-cyan-400" : "text-white"}`}>
                      {a.name.split("-")[0]}
                    </div>
                    <div className="text-[8px] font-mono text-slate-500">{a.framework}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Career Progression Detail & Promoters (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-xl border flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="font-bold text-sm text-white">Career Progression & Promotions</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-bold text-cyan-400">
              {selectedAgent.name.toUpperCase()} (Tiers intern to distinguished)
            </p>
          </div>

          {/* Visual Career Ladder Progress */}
          <div className="space-y-4 my-4 flex-1 justify-center flex flex-col">
            {stages.map((stage, idx) => {
              const isPassed = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              
              return (
                <div
                  key={stage}
                  className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                    isCurrent ? "scale-105" : ""
                  }`}
                >
                  {/* Styled bullet */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[9px] border ${
                    isCurrent 
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 animate-pulse" 
                      : isPassed 
                        ? "bg-slate-800 text-emerald-400 border-slate-700/80" 
                        : "bg-slate-950 text-slate-600 border-slate-900"
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 flex justify-between items-center pr-2">
                    <span className={`font-mono uppercase font-bold text-[10px] ${
                      isCurrent ? "text-white" : isPassed ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {stage}
                    </span>
                    {isCurrent && (
                      <span className="text-[8px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded animate-pulse">
                        CURRENT TIER
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trigger Promotion button */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => promoteAgent(selectedAgent.id)}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowUpCircle className="w-4.5 h-4.5" />
              <span>Evaluate for Career Promotion</span>
            </button>
          </div>
        </div>

      </div>

      {/* Workforce Planning ROI Panel */}
      <div className="glass p-6 rounded-xl border">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Workforce Utilization & Financials</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Compute Salary / hr:</span>
            <span className="text-white text-base font-bold">${selectedAgent.compute_cost_hourly.toFixed(2)}</span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">ROI Output Multiplier:</span>
            <span className="text-emerald-400 text-base font-bold">+{selectedAgent.roi_multiplier.toFixed(1)}X</span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Net Hourly Value Generated:</span>
            <span className="text-cyan-400 text-base font-bold">
              ${(selectedAgent.compute_cost_hourly * selectedAgent.roi_multiplier).toFixed(2)}
            </span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Org Allocation Dept:</span>
            <span className="text-slate-300 text-xs font-bold leading-normal block py-1.5 uppercase">
              {selectedAgent.organization.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
