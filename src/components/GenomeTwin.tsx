"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Binary, 
  UserPlus, 
  Dna, 
  HelpCircle,
  Copy,
  Info,
  Sliders,
  CheckCircle2
} from "lucide-react";

export const GenomeTwin: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId, cloneAgent } = useApp();
  
  const [dnaProfile, setDnaProfile] = useState<Record<string, number>>({});
  const [genomeData, setGenomeData] = useState<any>(null);
  
  const [cloneName, setCloneName] = useState("");
  const [cloneOwner, setCloneOwner] = useState("");
  const [cloneOrg, setCloneOrg] = useState("");
  const [isCloning, setIsCloning] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const fetchDnaAndGenome = async () => {
    if (!selectedAgent) return;
    try {
      // Fetch DNA Profile
      const dnaRes = await fetch(`http://localhost:8000/api/v1/agents/${selectedAgent.id}/dna`);
      if (dnaRes.ok) {
        const data = await dnaRes.json();
        setDnaProfile(data);
      }

      // Fetch Global Genome patterns
      const genomeRes = await fetch("http://localhost:8000/api/v1/genome");
      if (genomeRes.ok) {
        const data = await genomeRes.json();
        setGenomeData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDnaAndGenome();
    if (selectedAgent && !cloneName) {
      setCloneName(`${selectedAgent.name}-Twin`);
      setCloneOwner(selectedAgent.owner);
      setCloneOrg(selectedAgent.organization);
    }
  }, [selectedAgentId, agents]);

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setIsCloning(true);
    
    // Simulate active cloning wizard delay
    await new Promise((r) => setTimeout(r, 1500));
    await cloneAgent(selectedAgent.id, cloneName, cloneOwner, cloneOrg);
    
    setIsCloning(false);
    // Reset wizard values
    setCloneName("");
  };

  if (!selectedAgent) {
    return <div className="text-center py-20 text-slate-500 font-mono">No active agents loaded.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT COLUMN: Twin Cloner Wizard & DNA Profile (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col h-full space-y-6 overflow-y-auto pr-2 pb-6">
        
        {/* Dynamic Personality DNA Map */}
        <div className="glass p-6 rounded-xl border relative overflow-hidden">
          <div className="flex justify-between items-center pb-3 border-b mb-5 shrink-0">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold text-sm text-white">Dynamic Behavioral DNA Analysis</h3>
            </div>
            
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded p-1 text-xs text-white"
            >
              {agents.filter(a => a.status !== "retired").map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 font-mono text-[10px]">
            {Object.entries(dnaProfile).map(([trait, val]) => (
              <div key={trait} className="space-y-1">
                <div className="flex justify-between uppercase">
                  <span className="text-slate-500">{trait.replace("_", " ")}</span>
                  <span className="text-violet-400 font-bold">{Math.round(val * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
                    style={{ width: `${val * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Twin Cloning Wizard */}
        <div className="glass p-6 rounded-xl border relative overflow-hidden">
          <div className="flex items-center gap-2 pb-3 border-b mb-5">
            <UserPlus className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="font-bold text-sm text-white">Digital Twin Template Copier</h3>
          </div>

          <form onSubmit={handleCloneSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Cloned Twin Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CloudSentry-AWS-Twin"
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Assign Operator Owner:</label>
                <input
                  type="text"
                  required
                  placeholder="Owner name"
                  value={cloneOwner}
                  onChange={(e) => setCloneOwner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Business Organization:</label>
              <input
                type="text"
                required
                placeholder="Target division"
                value={cloneOrg}
                onChange={(e) => setCloneOrg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isCloning}
              className={`w-full font-bold py-2.5 rounded-lg text-white text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isCloning ? "bg-slate-800 text-slate-500" : "bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/10"
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{isCloning ? "Cloning Core DNA patterns..." : "Instantiate proven Blueprint Clone"}</span>
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: Fleet Genome Database analytics (5 Cols) */}
      <div className="lg:col-span-5 glass rounded-xl border flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-slate-900/60 shrink-0">
          <h4 className="font-bold text-xs text-white">Global Agent Genome Analytics</h4>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs font-mono">
          {genomeData ? (
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-3">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">FLEET SUCCESS GENOME</div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Success Framework:</span>
                    <span className="text-white font-bold">{genomeData.high_performing_attributes.top_framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Optimal Model Provider:</span>
                    <span className="text-white font-bold">{genomeData.high_performing_attributes.top_model_provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Avg Tool binds:</span>
                    <span className="text-white font-bold">{genomeData.high_performing_attributes.average_tools_count}</span>
                  </div>
                </div>
              </div>

              {/* Behavior patterns lists */}
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  Fleet High-Performing Success Indicators:
                </span>
                <div className="space-y-1.5 font-sans text-[11px] text-slate-400 leading-relaxed">
                  {genomeData.system_success_patterns.map((pat: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start bg-emerald-950/5 border border-emerald-900/10 p-2.5 rounded">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{pat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                  System Vulnerability Deficit Indicators:
                </span>
                <div className="space-y-1.5 font-sans text-[11px] text-slate-400 leading-relaxed">
                  {genomeData.system_failure_patterns.map((pat: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start bg-rose-950/5 border border-rose-900/10 p-2.5 rounded">
                      <Info className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{pat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <Binary className="w-5 h-5 text-slate-600" />
              <span>Fetching genome patterns statistics...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
