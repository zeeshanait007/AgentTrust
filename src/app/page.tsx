"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { AgentRegistry } from "@/components/AgentRegistry";
import { TrustScoring } from "@/components/TrustScoring";
import { VerificationSandbox } from "@/components/VerificationSandbox";
import { WorkforceManagement } from "@/components/WorkforceManagement";
import { ReputationGraph } from "@/components/ReputationGraph";
import { BlackBoxRecorder } from "@/components/BlackBoxRecorder";
import { Benchmarks } from "@/components/Benchmarks";
import { Marketplace } from "@/components/Marketplace";
import { GenomeTwin } from "@/components/GenomeTwin";
import { APISandbox } from "@/components/APISandbox";

export default function Home() {
  const { activeTab, loading } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "registry":
        return <AgentRegistry />;
      case "trust":
        return <TrustScoring />;
      case "verification":
        return <VerificationSandbox />;
      case "workforce":
        return <WorkforceManagement />;
      case "reputation":
        return <ReputationGraph />;
      case "recorder":
        return <BlackBoxRecorder />;
      case "benchmarks":
        return <Benchmarks />;
      case "marketplace":
        return <Marketplace />;
      case "genome":
        return <GenomeTwin />;
      case "sandbox":
        return <APISandbox />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-slate-100 font-sans antialiased">
      {/* Sidebar Navigation Panel */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <main className="flex-1 p-8 h-screen overflow-y-auto relative">
        {loading && (
          <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-400 animate-pulse flex items-center gap-1.5 z-50">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SYNCING FLEET METRICS...</span>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto pb-10">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}
