"use client";

import { useState } from "react";
import axios from "axios";
import { 
  ArrowLeft, 
  User, 
  Cpu, 
  Shield, 
  Coins, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Briefcase
} from "lucide-react";
import Link from "next/link";

export default function RegisterAgent() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    owner: "",
    organization: "",
    status: "active",
    career_stage: "intern",
    framework: "",
    model_provider: "",
    compute_cost_hourly: 0,
    roi_multiplier: 1,
    passport: {
      permissions_json: [] as string[],
      mcp_servers_json: [] as string[],
      tools_json: [] as string[],
      deployment_history_json: [] as any[],
      audit_trail_json: [] as any[]
    }
  });

  const [rawFields, setRawFields] = useState({
    permissions: "",
    mcp_servers: "",
    tools: ""
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "compute_cost_hourly" || name === "roi_multiplier") {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRawFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRawFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    // Validate unique ID format
    if (!/^[a-zA-Z0-9_-]+$/.test(form.id)) {
      setMessage({
        text: "Agent ID must contain only alphanumeric characters, underscores, or hyphens.",
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    // Process lists
    const permissions_json = rawFields.permissions.split(",").map(v => v.trim()).filter(Boolean);
    const mcp_servers_json = rawFields.mcp_servers.split(",").map(v => v.trim()).filter(Boolean);
    const tools_json = rawFields.tools.split(",").map(v => v.trim()).filter(Boolean);

    // Auto-generate initial deployment and audit trail
    const deployment_history_json = [
      {
        timestamp: new Date().toISOString(),
        version: "v1.0.0",
        description: `Initial Agent registration of ${form.name}.`
      }
    ];

    const audit_trail_json = [
      {
        action: "register",
        timestamp: new Date().toISOString(),
        details: `Autonomous registration completed. Owner associated: ${form.owner}`,
        actor: "system-registrar"
      }
    ];

    const payload = {
      ...form,
      passport: {
        permissions_json,
        mcp_servers_json,
        tools_json,
        deployment_history_json,
        audit_trail_json
      }
    };

    try {
      const res = await axios.post("http://localhost:8000/api/v1/agents", payload);
      setMessage({
        text: `Agent registered successfully! ID: ${res.data.id} is now enrolled in the Trust Registry.`,
        type: "success"
      });
      // Reset form
      setForm({
        id: "",
        name: "",
        owner: "",
        organization: "",
        status: "active",
        career_stage: "intern",
        framework: "",
        model_provider: "",
        compute_cost_hourly: 0,
        roi_multiplier: 1,
        passport: {
          permissions_json: [],
          mcp_servers_json: [],
          tools_json: [],
          deployment_history_json: [],
          audit_trail_json: []
        }
      });
      setRawFields({
        permissions: "",
        mcp_servers: "",
        tools: ""
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || "An unknown error occurred.";
      setMessage({
        text: `Registration Failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-100 font-sans antialiased p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO RUNTIME REGISTRY</span>
          </Link>
          <div className="text-right">
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest block uppercase">TRUST SYSTEM</span>
            <span className="text-[9px] text-slate-500 font-mono">NODE V1.0.0 // STATUS: ONLINE</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass glow-card rounded-2xl p-8 border border-slate-800/80 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-500/10 to-transparent w-48 h-48 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 bg-gradient-to-r from-cyan-500/10 to-transparent w-48 h-48 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="border-b border-slate-800/80 pb-5 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-violet-500" />
              Register Autonomous AI Agent
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enroll a new AI worker instance into the AgentTrust Governance framework. Enrolled agents receive automatic trust scores, verification tests, and collaboration tracing.
            </p>
          </div>

          {/* Notifications */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border text-xs font-mono transition-all ${
              message.type === "success" 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}>
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <div>
                <p className="font-semibold uppercase tracking-wider">{message.type === "success" ? "Operation Success" : "Validation / Server Error"}</p>
                <p className="mt-0.5 text-slate-300 leading-relaxed">{message.text}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Core Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/40 pb-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Agent Identity
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Agent unique ID *</label>
                  <input 
                    name="id" 
                    placeholder="e.g. dev-ops-pilot" 
                    value={form.id} 
                    onChange={handleChange} 
                    required 
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Agent Display Name *</label>
                  <input 
                    name="name" 
                    placeholder="e.g. AWS DevOps Deployer" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Owner Email *</label>
                  <input 
                    name="owner" 
                    placeholder="e.g. admin@company.com" 
                    value={form.owner} 
                    onChange={handleChange} 
                    required 
                    type="email"
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Organization Name *</label>
                  <input 
                    name="organization" 
                    placeholder="e.g. Cloud Infrastructure Dept" 
                    value={form.organization} 
                    onChange={handleChange} 
                    required
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Framework *</label>
                    <select 
                      name="framework" 
                      value={form.framework} 
                      onChange={handleChange} 
                      required
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full"
                    >
                      <option value="">Select...</option>
                      <option value="LangChain">LangChain</option>
                      <option value="AutoGen">AutoGen</option>
                      <option value="CrewAI">CrewAI</option>
                      <option value="Semantic Kernel">Semantic Kernel</option>
                      <option value="Custom">Custom / API</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Model Provider *</label>
                    <select 
                      name="model_provider" 
                      value={form.model_provider} 
                      onChange={handleChange} 
                      required
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full"
                    >
                      <option value="">Select...</option>
                      <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                      <option value="GPT-4o">GPT-4o</option>
                      <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                      <option value="Mistral Large">Mistral Large</option>
                      <option value="Custom API">Custom API</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Economics & Security Bindings */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/40 pb-2">
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                  Economics & Governance
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Compute Cost ($ / hr)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="compute_cost_hourly" 
                      placeholder="0.00" 
                      value={form.compute_cost_hourly} 
                      onChange={handleChange} 
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">ROI Multiplier Target</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      name="roi_multiplier" 
                      placeholder="1.0" 
                      value={form.roi_multiplier} 
                      onChange={handleChange} 
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Status</label>
                    <select 
                      name="status" 
                      value={form.status} 
                      onChange={handleChange} 
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full"
                    >
                      <option value="active">Active</option>
                      <option value="idle">Idle</option>
                      <option value="high_roi">High ROI</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Career Stage</label>
                    <select 
                      name="career_stage" 
                      value={form.career_stage} 
                      onChange={handleChange} 
                      className="bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full"
                    >
                      <option value="intern">Intern</option>
                      <option value="junior">Junior</option>
                      <option value="mid-level">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Authorized Resource Scopes (comma-separated)</label>
                  <input 
                    name="permissions" 
                    placeholder="e.g. read_file, write_db, run_subprocess" 
                    value={rawFields.permissions}
                    onChange={handleRawFieldChange}
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Registered MCP Servers (comma-separated)</label>
                  <input 
                    name="mcp_servers" 
                    placeholder="e.g. fs-server, git-mcp, terminal-mcp" 
                    value={rawFields.mcp_servers}
                    onChange={handleRawFieldChange}
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Authorized Actions / Tools (comma-separated)</label>
                  <input 
                    name="tools" 
                    placeholder="e.g. read_url, write_to_file, run_command" 
                    value={rawFields.tools}
                    onChange={handleRawFieldChange}
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 py-2.5 px-4 text-xs focus:outline-none focus:border-violet-500 w-full font-mono" 
                  />
                </div>

              </div>

            </div>

            <div className="border-t border-slate-800/80 pt-6 flex justify-end gap-4">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-850 hover:text-white transition text-xs font-semibold"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-xs hover:from-violet-750 hover:to-cyan-750 focus:outline-none transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enrolling Agent..." : "Submit Registration"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

