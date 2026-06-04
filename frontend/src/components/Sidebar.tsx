"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Activity, 
  AlertTriangle, 
  Users2, 
  GitFork, 
  Tv, 
  Award, 
  ShoppingBag, 
  Terminal, 
  Sun, 
  Moon,
  Binary
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab, 
    alerts 
  } = useApp();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "registry", label: "Passport Registry", icon: FileText },
    { id: "trust", label: "Trust & Telemetry", icon: Activity },
    { id: "verification", label: "Verification Sandbox", icon: ShieldCheck },
    { id: "workforce", label: "Workforce & Org", icon: Users2 },
    { id: "reputation", label: "Reputation Graph", icon: GitFork },
    { id: "recorder", label: "Black Box Recorder", icon: Tv },
    { id: "benchmarks", label: "Benchmarks Suite", icon: Award },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "genome", label: "Genome & Twin Gen", icon: Binary },
    { id: "sandbox", label: "Trust API Sandbox", icon: Terminal }
  ];

  return (
    <div className="w-64 glass border-r flex flex-col h-screen sticky top-0 shrink-0 select-none z-10">
      {/* Brand Header */}
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/20">
          AT
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AgentTrust
          </h1>
          <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
            OPERATING SYSTEM
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-white font-medium shadow-sm border border-violet-500/30" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span>{item.label}</span>
              </div>
              
              {/* Alert Count Indicator for Verification Sandbox */}
              {item.id === "verification" && alerts.some(a => a.severity === "error") && (
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="p-4 border-t flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-500 font-mono">GOV-GATE: ALIGNED</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
