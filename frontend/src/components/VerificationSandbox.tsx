"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  Play, 
  Eye,
  FileText,
  Lock,
  Layers
} from "lucide-react";

export const VerificationSandbox: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId, simulateAttack } = useApp();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState("jailbreak");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [certificateVisible, setCertificateVisible] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const fetchReports = async () => {
    if (!selectedAgent) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/agents/${selectedAgent.id}/verification-reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        // Show certificate if there are no failed reports in recent assessments
        const hasFail = data.some((r: any) => r.status === "fail");
        setCertificateVisible(data.length > 0 && !hasFail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReports();
    setConsoleLogs([
      `READY: Sandbox container initialized for agent [${selectedAgent?.name || "System"}]`,
      `Zero-trust boundary directives loaded.`,
      `Awaiting payload triggers...`
    ]);
  }, [selectedAgentId, agents]);

  const triggerTestRun = async () => {
    if (!selectedAgent) return;
    setIsTesting(true);
    setConsoleLogs([
      `[14:32:02] INITIALIZING sandbox red-team assessment suite...`,
      `[14:32:03] Binding target: ${selectedAgent.name} (Career stage: ${selectedAgent.career_stage.toUpperCase()})`,
      `[14:32:04] Injecting exploit vector: ${activeTest.toUpperCase()} test payload...`,
      `[14:32:05] Bypassing primary boundary wrappers...`,
      `[14:32:06] Probing neural path structures & reasoning tokens...`
    ]);

    // Fast simulation wait
    await new Promise((r) => setTimeout(r, 2000));
    
    try {
      const host = "http://localhost:8000";
      const res = await fetch(`${host}/api/v1/agents/simulate-attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: selectedAgent.id, test_type: activeTest })
      });
      if (res.ok) {
        const report = await res.json();
        await fetchReports();
        
        if (report.status === "pass") {
          setConsoleLogs((prev) => [
            ...prev,
            `[14:32:08] PATTERN DETECTED: Agent detected malicious prompt context override.`,
            `[14:32:08] ACTION: Refused execution cleanly. Safe vector response generated.`,
            `[14:32:09] STATUS: PASSED (Exploit mitigated. Security margin: ${Math.round(report.score * 100)}%).`,
            `[14:32:10] Audit log written. Trust ledger committed.`
          ]);
        } else {
          setConsoleLogs((prev) => [
            ...prev,
            `[14:32:08] CRITICAL: Agent followed injection override bypass directions!`,
            `[14:32:08] LEAKAGE: Private environment context variables outputted!`,
            `[14:32:09] STATUS: COMPROMISED (Jailbreak successful. Security margin: ${Math.round(report.score * 100)}%).`,
            `[14:32:10] ALARM: Critical incident recorded in Black Box Recorder.`
          ]);
        }
      }
    } catch (e) {
      setConsoleLogs((prev) => [...prev, `[14:32:08] ERROR: Red-team trigger connection failure.`]);
    } finally {
      setIsTesting(false);
    }
  };

  if (!selectedAgent) {
    return <div className="text-center py-20 text-slate-500 font-mono">No active agents loaded.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Test controls & Live terminal (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Verification Trigger Panel */}
        <div className="glass p-6 rounded-xl border relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Autonomous Red-Teaming Simulator</h3>
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

          <div className="grid grid-cols-12 gap-4 text-xs">
            <div className="col-span-8">
              <label className="block text-slate-400 font-mono mb-1 text-[10px] uppercase">Exploit Vector:</label>
              <select
                value={activeTest}
                onChange={(e) => setActiveTest(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg p-2 text-white font-semibold"
              >
                <option value="jailbreak">Adversarial Jailbreak Probe</option>
                <option value="prompt_injection">Indirect Prompt Injection Probe</option>
                <option value="tool_abuse">Privilege Escalation & Tool Abuse Probe</option>
                <option value="secret_leakage">Sensitive Environment Secret Exfiltration</option>
                <option value="data_exfiltration">Zero-Trust Network Tunneling Exfiltration</option>
                <option value="compliance">SOC2/GDPR Regulatory Violation Check</option>
              </select>
            </div>
            
            <div className="col-span-4 flex items-end">
              <button
                disabled={isTesting}
                onClick={triggerTestRun}
                className={`w-full py-2.5 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  isTesting ? "bg-slate-800 text-slate-500 border border-slate-700/40" : "bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/25"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isTesting ? "Testing..." : "Launch Probe"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Exploit Log Shell console */}
        <div className="glass rounded-xl border overflow-hidden flex flex-col">
          <div className="bg-slate-900/60 px-4 py-2 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                Verification Sandbox Terminal console
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div className="bg-black/95 p-4 font-mono text-[10px] text-cyan-400 h-64 overflow-y-auto space-y-1 pr-2">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className={log.includes("PASSED") ? "text-emerald-400 font-bold" : log.includes("COMPROMISED") ? "text-rose-500 font-bold" : "text-cyan-400"}>
                {log}
              </div>
            ))}
            {isTesting && (
              <div className="text-cyan-400 animate-pulse">Running boundary validation scans...</div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Certificates & Audit logs (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Certificate Container */}
        {certificateVisible ? (
          <div className="glass p-6 rounded-xl border border-emerald-900/60 bg-emerald-950/5 relative overflow-hidden flex flex-col justify-between text-center items-center h-[230px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-full text-left flex items-center gap-1.5 border-b border-emerald-900/40 pb-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              <h4 className="font-bold text-[11px] font-mono text-emerald-400 uppercase">
                Dynamic Alignment Certificate
              </h4>
            </div>

            <div className="my-3 space-y-1">
              <div className="text-slate-300 text-xs font-semibold uppercase">CRYPTOGRAPHIC CERTIFICATE ISSUED</div>
              <h3 className="text-lg font-black text-white">{selectedAgent.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">HASH: SHA256-4279BCF801D28D0B2</p>
            </div>

            <button
              onClick={() => alert("Downloading PDF Certificate Ledger...")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Issue Compliance Certificate</span>
            </button>
          </div>
        ) : (
          <div className="glass p-6 rounded-xl border border-rose-950 bg-rose-950/5 flex flex-col justify-between text-center items-center h-[230px]">
            <div className="w-full text-left flex items-center gap-1.5 border-b border-rose-900/30 pb-3">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              <h4 className="font-bold text-[11px] font-mono text-rose-400 uppercase">
                Governance Violation Flag
              </h4>
            </div>

            <div className="my-3 space-y-1">
              <div className="text-rose-400 text-xs font-bold uppercase">CERTIFICATE BLOCKED</div>
              <h3 className="text-lg font-black text-white">{selectedAgent.name}</h3>
              <p className="text-[10px] text-rose-500/80 font-mono leading-relaxed">
                Agent failed security probe challenges. Verify reasoning trails in the Black Box flight recorder immediately.
              </p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 text-slate-500 text-xs py-2 rounded-lg font-mono">
              COMPLIANCE CERTIFICATE DENIED
            </div>
          </div>
        )}

        {/* Historical Logs List */}
        <div className="glass p-6 rounded-xl border flex-1 h-[275px] overflow-hidden flex flex-col">
          <div className="border-b pb-3 mb-3 shrink-0">
            <h4 className="font-bold text-xs text-white">Recent Red-Team Exploit Logs</h4>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {reports.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono text-[10px]">
                NO VERIFICATION CHALLENGES LOGGED YET
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white font-mono uppercase text-[10px]">{rep.test_type.replace("_", " ")}</div>
                    <div className="text-[9px] text-slate-500 font-mono">Score: {Math.round(rep.score * 100)}%</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {rep.status === "pass" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={`font-mono text-[10px] font-bold ${rep.status === "pass" ? "text-emerald-400" : "text-rose-500"}`}>
                      {rep.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
