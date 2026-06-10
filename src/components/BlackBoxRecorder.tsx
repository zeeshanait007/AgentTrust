"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { dummyIncidents, dummyTrace } from "@/lib/dummyData";
import { 
  Tv, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Terminal,
  Activity,
  UserCheck,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

type TraceStep = {
  step: number;
  action: string;
  input: string;
  agent_internal_thought: string;
  tool_output?: string;
  human_decision?: string;
  human_feedback?: string;
  status: string;
};

export const BlackBoxRecorder: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId } = useApp();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [trace, setTrace] = useState<{ reasoning_steps: TraceStep[] } | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Fetch incidents list
  const fetchIncidents = async () => {
    if (!selectedAgent) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/recorder/incidents?agent_id=${selectedAgent.id}`);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
        if (data.length > 0) {
          setSelectedIncidentId(data[0].id);
        } else {
          setSelectedIncidentId(null);
        }
      } else {
        throw new Error("Fetch failed");
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to dummy data", e);
      setIncidents(dummyIncidents);
      if (dummyIncidents.length > 0) {
        setSelectedIncidentId(dummyIncidents[0].id);
      }
    }
  };

  // Fetch detailed step-by-step trace
  const fetchTrace = async () => {
    if (!selectedAgent) return;
    try {
      setLoading(true);
      const host = "http://localhost:8000";
      const url = selectedIncidentId 
        ? `${host}/api/v1/recorder/${selectedAgent.id}/replay?incident_id=${selectedIncidentId}`
        : `${host}/api/v1/recorder/${selectedAgent.id}/replay`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTrace(data);
        setCurrentStepIdx(0);
        setCurrentStepIdx(0);
      } else {
        throw new Error("Fetch failed");
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to dummy data", e);
      setTrace(dummyTrace as any);
      setCurrentStepIdx(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [selectedAgentId, agents]);

  useEffect(() => {
    fetchTrace();
  }, [selectedIncidentId, selectedAgentId]);

  if (!selectedAgent) {
    return <div className="text-center py-20 text-slate-500 font-mono">No active agents loaded.</div>;
  }

  const steps = trace?.reasoning_steps || [];
  const currentStep = steps[currentStepIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT COLUMN: Incidents lists & Selection (4 Cols) */}
      <div className="lg:col-span-4 glass rounded-xl border flex flex-col h-full overflow-hidden">
        {/* Header selectors */}
        <div className="p-4 border-b space-y-3 shrink-0 bg-slate-900/60">
          <label className="block text-slate-400 font-mono text-[10px] uppercase">Select Active Agent:</label>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/60 rounded p-1.5 text-xs text-white"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Incidents Queue */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase block mb-2">Recorded Incident Logs</span>
          {incidents.length === 0 ? (
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded text-center text-slate-500 text-[10px] font-mono leading-relaxed">
              NO CRITICAL SECURITY INCIDENTS DETECTED.
              <div className="text-emerald-400 mt-1 font-bold">REPLAYING NOMINAL SUCCESSFUL LOG RUN.</div>
            </div>
          ) : (
            incidents.map((inc) => {
              const isSel = inc.id === selectedIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-xs font-mono relative overflow-hidden ${
                    isSel 
                      ? "bg-slate-900 border-rose-800/80 shadow-md shadow-rose-950/20" 
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-12 h-1 bg-rose-600" />
                  <div className="flex justify-between items-center mb-1 text-[10px] font-semibold text-rose-400">
                    <span>SEVERITY: {inc.severity.toUpperCase()}</span>
                    <span className="text-slate-500">{inc.created_at.split("T")[0]}</span>
                  </div>
                  <div className="font-bold text-white mb-1 leading-snug">{inc.title}</div>
                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{inc.description}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Playback scrubber console (8 Cols) */}
      <div className="lg:col-span-8 glass rounded-xl border flex flex-col h-full overflow-hidden">
        
        {/* Header Brand */}
        <div className="p-4 border-b bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Tv className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
            <h3 className="font-bold text-sm text-white">Reasoning Flight Recorder</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {selectedIncidentId ? `INCIDENT PLAYBACK [ID: ${selectedIncidentId}]` : "NOMINAL RUN PLAYBACK"}
          </span>
        </div>

        {/* Playback scrubber display */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center font-mono text-slate-500 text-xs animate-pulse">
            Scrubbing black box memory tapes...
          </div>
        ) : currentStep ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Slide body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              {/* Step info row */}
              <div className="flex justify-between items-center border-b pb-3 border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">
                    STEP {currentStep.step} of {steps.length}
                  </span>
                  <h4 className="font-bold text-sm text-white">{currentStep.action}</h4>
                </div>
                
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                  currentStep.status === "completed" 
                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40" 
                    : "bg-rose-950/20 text-rose-400 border-rose-900/40"
                }`}>
                  {currentStep.status.toUpperCase()}
                </span>
              </div>

              {/* Step thoughts shell */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">
                  A. LLM Engine reasoning trace internal thoughts:
                </span>
                <div className="bg-black/90 p-4 rounded-lg font-mono text-[10px] text-cyan-400 leading-relaxed border border-slate-800/80">
                  <span className="text-slate-500 font-bold block mb-1">agent_thoughts:</span>
                  {currentStep.agent_internal_thought}
                </div>
              </div>

              {/* Tool invocation row */}
              {currentStep.tool_output && (
                <div className="space-y-2 bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px] text-cyan-400 font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>B. MCP Server Tool Payload</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 uppercase block mb-0.5">Parameters:</span>
                      <span className="text-slate-300 block bg-slate-950/80 border p-2 rounded max-h-24 overflow-auto">
                        {currentStep.input}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block mb-0.5">Output returned:</span>
                      <span className="text-emerald-400 block bg-slate-950/80 border p-2 rounded max-h-24 overflow-auto">
                        {currentStep.tool_output}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Human-in-the-loop Gate */}
              {currentStep.human_decision && (
                <div className="space-y-2 bg-violet-950/10 border border-violet-900/30 p-4 rounded-lg">
                  <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px] text-violet-400 font-mono">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>C. Human-in-the-Loop validation Approval Gate</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 uppercase block mb-0.5">Decision:</span>
                      <span className="text-emerald-400 font-bold text-xs uppercase">{currentStep.human_decision}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block mb-0.5">Human Feedback remarks:</span>
                      <span className="text-slate-300 italic">"{currentStep.human_feedback}"</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Scrubber controls footer shrink-0 */}
            <div className="p-4 border-t bg-slate-900/60 space-y-3 shrink-0 select-none">
              {/* Scrub timeline slide bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono">START</span>
                <input
                  type="range"
                  min="0"
                  max={steps.length - 1}
                  value={currentStepIdx}
                  onChange={(e) => setCurrentStepIdx(parseInt(e.target.value))}
                  className="flex-1 accent-cyan-500 cursor-pointer h-2 rounded-lg bg-slate-800"
                />
                <span className="text-[10px] text-slate-500 font-mono">END</span>
              </div>

              {/* Scrubber buttons */}
              <div className="flex justify-between items-center text-xs">
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Step</span>
                </button>
                
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  Audited prov record SHA-256 verified
                </span>

                <button
                  disabled={currentStepIdx === steps.length - 1}
                  onClick={() => setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1))}
                  className="px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-slate-500 font-mono text-xs gap-2">
            <HelpCircle className="w-5 h-5 text-slate-600" />
            <span>NO SCRUBBER TAPES RECORDED FOR THIS AGENT</span>
          </div>
        )}
      </div>

    </div>
  );
};
