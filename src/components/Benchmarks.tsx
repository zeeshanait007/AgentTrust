"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Award, 
  RefreshCw, 
  HelpCircle,
  Clock,
  DollarSign,
  Gauge,
  Percent
} from "lucide-react";
import { dummyBenchmarks } from "@/lib/dummyData";

type LeaderboardItem = {
  agent_id: string;
  agent_name: string;
  score: number;
  percentile: number;
  accuracy: number;
  latency_ms: number;
  cost_per_task: number;
  trust_score: number;
  rank: number;
};

export const Benchmarks: React.FC = () => {
  const { agents } = useApp();
  const [benchmarks, setBenchmarks] = useState<Record<string, LeaderboardItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [activeSuite, setActiveSuite] = useState("Software Engineering");

  const fetchBenchmarks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/benchmarks");
      if (res.ok) {
        const data = await res.json();
        setBenchmarks(data);
        const keys = Object.keys(data);
        if (keys.length > 0 && !keys.includes(activeSuite)) {
          setActiveSuite(keys[0]);
        }
      } else {
        throw new Error("Fetch failed");
      }
    } catch (e) {
      console.error("Backend fetch failed, falling back to dummy data", e);
      setBenchmarks(dummyBenchmarks);
      setActiveSuite("Software Engineering");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, [agents]);

  const suites = Object.keys(benchmarks);
  const activeList = benchmarks[activeSuite] || [];

  return (
    <div className="space-y-6">
      
      {/* Overview header */}
      <div className="flex justify-between items-center pb-3 border-b">
        <div>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Agent Evaluation & Benchmarking Suites
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            STANDARDIZED PERFORMANCE RATINGS ACROSS KEY BUSINESS VERTICALS
          </p>
        </div>
        <button
          onClick={fetchBenchmarks}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Domain Suite Selector Tabs */}
      <div className="flex flex-wrap gap-2 text-xs select-none">
        {suites.length === 0 ? (
          <div className="font-mono text-slate-500 animate-pulse text-[10px]">
            No benchmark suites loaded. Make sure backend is populated...
          </div>
        ) : (
          suites.map((suite) => (
            <button
              key={suite}
              onClick={() => setActiveSuite(suite)}
              className={`px-3.5 py-2 rounded-lg font-bold border transition-all duration-200 cursor-pointer ${
                activeSuite === suite 
                  ? "bg-cyan-600 text-white border-cyan-500/30 shadow-md shadow-cyan-600/10" 
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
              }`}
            >
              {suite}
            </button>
          ))
        )}
      </div>

      {/* Leaderboard Table Grid */}
      <div className="glass rounded-xl border overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4 font-semibold text-center w-16">Rank</th>
              <th className="p-4 font-semibold">Agent Candidate</th>
              <th className="p-4 font-semibold text-right">Raw Score</th>
              <th className="p-4 font-semibold text-right">Percentile</th>
              <th className="p-4 font-semibold text-right">Accuracy Rate</th>
              <th className="p-4 font-semibold text-right">Avg Latency</th>
              <th className="p-4 font-semibold text-right">Task compute cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 animate-pulse">
                  Aggregating test ledger datasets...
                </td>
              </tr>
            ) : activeList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  NO BENCHMARK SCORING DATA REPORTED FOR THIS SUITE.
                </td>
              </tr>
            ) : (
              activeList.map((item) => {
                const isGold = item.rank === 1;
                const isSilver = item.rank === 2;
                const isBronze = item.rank === 3;
                
                const rankColor = isGold 
                  ? "text-yellow-400 font-black text-sm" 
                  : isSilver 
                    ? "text-slate-300 font-black text-sm" 
                    : isBronze 
                      ? "text-amber-600 font-black text-sm" 
                      : "text-slate-500";

                return (
                  <tr key={item.agent_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className={`p-4 text-center ${rankColor}`}>
                      #{item.rank}
                    </td>
                    <td className="p-4 font-sans">
                      <div className="font-bold text-white text-xs">{item.agent_name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{item.agent_id}</div>
                    </td>
                    <td className="p-4 text-right text-white font-bold">
                      {item.score}%
                    </td>
                    <td className="p-4 text-right text-cyan-400 font-semibold">
                      {item.percentile}th
                    </td>
                    <td className="p-4 text-right text-emerald-400">
                      {Math.round(item.accuracy * 100)}%
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      {Math.round(item.latency_ms)}ms
                    </td>
                    <td className="p-4 text-right text-violet-400">
                      ${item.cost_per_task.toFixed(4)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
