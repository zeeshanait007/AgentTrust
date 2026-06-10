"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { dummyGraph } from "@/lib/dummyData";
import { 
  GitFork, 
  RefreshCw, 
  HelpCircle,
  Eye,
  Info
} from "lucide-react";

type GNode = {
  id: string;
  label: string;
  status: string;
  trust_score: number;
  career_stage: string;
  framework: string;
  influence: number;
  x?: number;
  y?: number;
};

type GEdge = {
  source: string;
  target: string;
  weight: number;
  success_rate: number;
};

export const ReputationGraph: React.FC = () => {
  const { agents } = useApp();
  const [graphData, setGraphData] = useState<{ nodes: GNode[]; edges: GEdge[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<GNode | null>(null);

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/reputation/graph");
      if (res.ok) {
        const data = await res.json();
        
        // Position nodes in a circular mathematical layout for beautiful, responsive SVG rendering
        const width = 600;
        const height = 350;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 135;
        
        const positionedNodes = data.nodes.map((node: GNode, index: number) => {
          // Spread nodes evenly around circle
          const angle = (index / data.nodes.length) * 2 * Math.PI;
          
          // Pull higher influence (PageRank) nodes slightly closer to center for organic clustering!
          const offsetRadius = radius * (1.0 - (node.influence / 100.0) * 0.3);
          
          return {
            ...node,
            x: centerX + offsetRadius * Math.cos(angle),
            y: centerY + offsetRadius * Math.sin(angle)
          };
        });
        
        setGraphData({ nodes: positionedNodes, edges: data.edges });
      } else {
        throw new Error("Fetch failed");
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to dummy data");
      
      const width = 600;
      const height = 350;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 135;
      
      const positionedNodes = dummyGraph.nodes.map((node: any, index: number) => {
        const angle = (index / dummyGraph.nodes.length) * 2 * Math.PI;
        const offsetRadius = radius * (1.0 - (0.5) * 0.3); // Dummy influence
        return {
          ...node,
          label: node.name,
          x: centerX + offsetRadius * Math.cos(angle),
          y: centerY + offsetRadius * Math.sin(angle),
          influence: 50,
          status: "active",
          trust_score: 900,
          career_stage: "senior",
          framework: "LangChain"
        };
      });
      
      setGraphData({ nodes: positionedNodes, edges: dummyGraph.edges || [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [agents]);

  // Find coordinates for source and target edges
  const getEdgeCoordinates = (edge: GEdge) => {
    const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
    const targetNode = graphData.nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;
    return {
      x1: sourceNode.x || 0,
      y1: sourceNode.y || 0,
      x2: targetNode.x || 0,
      y2: targetNode.y || 0
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] overflow-hidden">
      
      {/* LEFT PANEL: Interactive SVG Graph Canvas (8 Cols) */}
      <div className="lg:col-span-8 glass rounded-xl border flex flex-col h-full overflow-hidden relative">
        
        {/* Brand strip */}
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <GitFork className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Interactive Reputation Network</h3>
          </div>
          
          <button
            onClick={fetchGraph}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Drawing Area */}
        <div className="flex-1 w-full bg-slate-950/20 relative flex items-center justify-center">
          {loading ? (
            <div className="font-mono text-xs text-slate-500 animate-pulse">Recalculating network PageRank...</div>
          ) : (
            <svg 
              viewBox="0 0 600 350" 
              className="w-full h-full p-6 select-none"
            >
              {/* SVG Markers for arrows */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#232a3f" />
                </marker>
                <marker id="arrow-glow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                </marker>
              </defs>

              {/* Draw Edges */}
              {(graphData.edges || []).map((edge, idx) => {
                const coords = getEdgeCoordinates(edge);
                if (!coords) return null;
                const isHovered = hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);
                
                return (
                  <line
                    key={idx}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    stroke={isHovered ? "var(--accent-primary)" : "var(--card-border)"}
                    strokeWidth={isHovered ? 2.0 : 1.0}
                    strokeOpacity={isHovered ? 0.8 : 0.3}
                    markerEnd={isHovered ? "url(#arrow-glow)" : "url(#arrow)"}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw Nodes */}
              {(graphData.nodes || []).map((node) => {
                const isHovered = hoveredNode && hoveredNode.id === node.id;
                // Node radius represents PageRank influence
                const r = 8 + (node.influence * 0.7);
                
                const nodeColors = {
                  active: "#10b981", // Emerald
                  high_roi: "#8b5cf6", // Violet
                  high_risk: "#f59e0b", // Amber
                  idle: "#06b6d4" // Cyan
                }[node.status] || "#64748b";

                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Node Glow Outer Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r + 4}
                      fill="transparent"
                      stroke={nodeColors}
                      strokeWidth={1.5}
                      strokeOpacity={isHovered ? 0.6 : 0.0}
                      className="transition-all duration-300"
                    />
                    
                    {/* Core node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={nodeColors}
                      className="transition-all duration-300"
                    />
                    
                    {/* Node Label Text */}
                    <text
                      x={node.x}
                      y={(node.y || 0) + r + 12}
                      textAnchor="middle"
                      fill={isHovered ? "#fff" : "#94a3b8"}
                      fontSize={8}
                      fontWeight={isHovered ? "bold" : "normal"}
                      fontFamily="monospace"
                      className="transition-all duration-300"
                    >
                      {(node.label || "Node").split("-")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Node inspection Card (4 Cols) */}
      <div className="lg:col-span-4 glass rounded-xl border flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-slate-900/60 shrink-0">
          <h4 className="font-bold text-xs text-white">Reputation Graph Details</h4>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs font-mono">
          {hoveredNode ? (
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">SELECTED NODE</div>
                <h3 className="text-sm font-bold text-white leading-normal">{hoveredNode.label}</h3>
                <p className="text-[10px] text-slate-500 font-mono">ID: {hoveredNode.id}</p>
              </div>

              <div className="space-y-2 text-[10px] border-t border-slate-800/80 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">PageRank Influence:</span>
                  <span className="text-cyan-400 font-bold">{hoveredNode.influence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Trust score rating:</span>
                  <span className="text-white font-bold">{hoveredNode.trust_score} TS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Career Level:</span>
                  <span className="text-white font-bold uppercase">{hoveredNode.career_stage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Framework:</span>
                  <span className="text-white font-bold">{hoveredNode.framework}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{hoveredNode.status}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 border p-3.5 rounded-lg text-[10px] leading-relaxed text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Influence Math PageRank</span>
                </div>
                PageRank models how heavily active the agent is in the collaborative cluster. Nodes with higher percentages collaborate successfully across teams.
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <Eye className="w-5 h-5 text-slate-600" />
              <span>HOVER OVER AN SVG GRAPH NODE TO DECRYPT RELATIONAL DATA</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
