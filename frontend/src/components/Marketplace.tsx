"use client";

import React, { useState } from "react";
import { useApp, Agent } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Cpu, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  Eye,
  CheckCircle2
} from "lucide-react";

export const Marketplace: React.FC = () => {
  const { agents } = useApp();
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Filter public marketplace listings
  const listings = agents.filter((a) => {
    return (
      a.status !== "retired" && 
      (a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT COLUMN: Grid app store listings (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
        {/* Search header shrink-0 */}
        <div className="p-1 border-b pb-4 mb-4 shrink-0 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search Marketplace listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {listings.length} VERIFIED LISTINGS
          </span>
        </div>

        {/* Listings Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          {listings.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-500 font-mono text-xs">
              NO VERIFIED AUTONOMOUS AGENTS AVAILABLE IN MARKETPLACE
            </div>
          ) : (
            listings.map((item) => {
              const score = item.trust_score?.trust_score || 600;
              const starRating = Math.round((score / 1000) * 5 * 10) / 10;
              
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAgent(item)}
                  className={`glass p-5 rounded-xl border cursor-pointer hover:border-violet-500/50 transition-all duration-200 flex flex-col justify-between ${
                    selectedAgent?.id === item.id ? "border-violet-500/60 shadow-md shadow-violet-500/5" : ""
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="px-2 py-0.5 bg-slate-800 text-cyan-400 font-mono text-[9px] font-bold rounded">
                        {item.framework.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{starRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white mt-2.5 leading-snug">{item.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">OWNER: {item.owner}</p>
                    
                    <p className="text-[11px] text-slate-400 mt-2.5 leading-normal line-clamp-2">
                      Highly audited AI digital employee customized for {item.organization.toLowerCase()} integrations. Exposes whitelisted tool hooks.
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">${item.compute_cost_hourly.toFixed(2)}/hr</span>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{score} TRUST INDEX</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Selection Subscription specs (4 Cols) */}
      <div className="lg:col-span-4 glass rounded-xl border flex flex-col h-full overflow-hidden">
        {selectedAgent ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header info */}
            <div className="p-4 border-b bg-slate-900/60 shrink-0">
              <h4 className="font-bold text-xs text-white">License & Subscription portal</h4>
            </div>

            {/* Content Scroll Panel */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">SELECTED BLUEPRINT</div>
                <h3 className="text-sm font-sans font-bold text-white">{selectedAgent.name}</h3>
                <p className="text-[10px] text-slate-500">ID: {selectedAgent.id}</p>
              </div>

              {/* License keys summary */}
              <div className="bg-slate-900/40 border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 uppercase">Hourly Compute cost:</span>
                  <span className="text-white font-bold">${selectedAgent.compute_cost_hourly.toFixed(2)} / HR</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 uppercase">Subscription Model:</span>
                  <span className="text-emerald-400 font-bold uppercase">Enterprise Shared Revenue</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 uppercase">License Scope:</span>
                  <span className="text-white font-bold">Multi-tenant Unlimited seat</span>
                </div>
              </div>

              {/* Mock Reviews Container */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-500 uppercase block border-b pb-1 border-slate-800">
                  Verified Enterprise Reviews
                </span>
                <div className="space-y-2 font-sans">
                  <div className="bg-slate-900/20 border border-slate-850 p-3 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold">
                      <span>DevOps Manager (Google)</span>
                      <div className="flex"><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /></div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      "Clean boundary checks. SOC2 alignment is exceptionally easy to audit on this passport."
                    </p>
                  </div>
                  <div className="bg-slate-900/20 border border-slate-850 p-3 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold">
                      <span>SecOps Auditor (Stripe)</span>
                      <div className="flex"><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /></div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      "Excellent jailbreak probe resistance. Trust signature remainsAAA level even under high request loads."
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscribe button */}
              <button
                onClick={() => alert(`Successfully generated subscription key for: ${selectedAgent.name}`)}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer font-sans"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Deploy & License Agent</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-600 animate-bounce" />
            <span>SELECT A PUBLIC AGENT TO UNLOCK LICENSE CONFIGURATIONS</span>
          </div>
        )}
      </div>

    </div>
  );
};
