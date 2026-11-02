import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FLOW_LANES,
  FLOW_PHASES,
  FLOW_MAP_NODES,
} from '../data/flowAndScenariosData';
import {
  FlowNodeType,
} from '../types';
import {
  GitCommit,
  Play,
  Sliders,
  Filter,
  Search,
  ExternalLink,
} from 'lucide-react';

export const FlowMapView: React.FC = () => {
  const { runScenario, setCurrentView } = useApp();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>('n-plat-pricing');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeFocusId = hoveredNodeId || pinnedNodeId;

  // Find upstream and downstream paths for the active node
  const activeFocusNode = useMemo(() => {
    return FLOW_MAP_NODES.find((n) => n.id === activeFocusId) || null;
  }, [activeFocusId]);

  const upstreamSet = useMemo(() => {
    if (!activeFocusNode) return new Set<string>();
    const set = new Set<string>();
    const traverse = (id: string) => {
      const node = FLOW_MAP_NODES.find((n) => n.id === id);
      if (!node) return;
      node.upstreamIds.forEach((uid: string) => {
        if (!set.has(uid)) {
          set.add(uid);
          traverse(uid);
        }
      });
    };
    traverse(activeFocusNode.id);
    return set;
  }, [activeFocusNode]);

  const downstreamSet = useMemo(() => {
    if (!activeFocusNode) return new Set<string>();
    const set = new Set<string>();
    const traverse = (id: string) => {
      const node = FLOW_MAP_NODES.find((n) => n.id === id);
      if (!node) return;
      node.downstreamIds.forEach((did: string) => {
        if (!set.has(did)) {
          set.add(did);
          traverse(did);
        }
      });
    };
    traverse(activeFocusNode.id);
    return set;
  }, [activeFocusNode]);

  // Node type styles
  const getNodeTypeBadge = (type: FlowNodeType) => {
    switch (type) {
      case 'Customer action':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Goods':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Information':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Money':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Complaint':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Exception':
        return 'bg-rose-100 text-rose-800 border-rose-300 border-dashed animate-pulse';
    }
  };

  const nodeTypes: FlowNodeType[] = [
    'Customer action',
    'Goods',
    'Information',
    'Money',
    'Complaint',
    'Exception',
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <GitCommit className="w-4 h-4" />
            <span>Interactive Swimlane Architecture</span>
          </div>
          <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">
            End-to-End Operational Flow Map
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A5C] mt-1 max-w-2xl">
            Trace how customer actions, food preparation, dispatch logic, partner banking, and grievance resolution interact across Bangalore cloud hubs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('rules')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Rules ⚙️</span>
          </button>
        </div>
      </div>

      {/* Filter and Path Legend Bar */}
      <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Node Type Filters */}
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-bold text-[#3A2E25] mr-1 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Types:
            </span>
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                selectedTypeFilter === 'all'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {nodeTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                  selectedTypeFilter === type
                    ? 'ring-2 ring-orange-500 ring-offset-1 font-extrabold'
                    : 'opacity-85 hover:opacity-100'
                } ${getNodeTypeBadge(type)}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Path Trace Legend */}
          <div className="flex items-center flex-wrap gap-3 font-semibold text-[11px] text-[#7A6A5C] bg-[#FFF8EE] px-3 py-1.5 rounded-xl border border-orange-100">
            <span className="font-bold text-[#3A2E25]">Path Legend:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200" />
              <span>Upstream Prerequisite</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-200" />
              <span>Active / Pinned Node</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span>Downstream Consequence</span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes by title, rule, SLA, or system link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#FFF8EE] border border-orange-200 rounded-xl text-xs text-[#3A2E25] placeholder-[#7A6A5C]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Swimlane Matrix Board */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-x-auto">
        <div className="min-w-[980px]">
          {/* Phase Column Headers */}
          <div className="grid grid-cols-6 border-b border-orange-100 bg-orange-50/70 text-xs font-bold text-[#3A2E25]">
            <div className="p-3 border-r border-orange-100 uppercase tracking-wider text-[11px] flex items-center text-orange-900">
              Operational Lane
            </div>
            {FLOW_PHASES.map((phase) => (
              <div key={phase.id} className="p-3 border-r border-orange-100 last:border-r-0">
                <div className="font-extrabold text-[#3A2E25]">{phase.label}</div>
                <div className="text-[10px] text-[#7A6A5C] font-semibold">{phase.range}</div>
              </div>
            ))}
          </div>

          {/* Swimlane Rows */}
          <div className="divide-y divide-orange-100">
            {FLOW_LANES.map((lane) => (
              <div key={lane.id} className="grid grid-cols-6 hover:bg-orange-50/20 transition-colors">
                {/* Lane Header */}
                <div className="p-3.5 border-r border-orange-100 bg-white flex flex-col justify-center">
                  <div className="flex items-center space-x-1.5 font-extrabold text-xs text-[#3A2E25]">
                    <span>{lane.icon}</span>
                    <span>{lane.label}</span>
                  </div>
                  <span className="text-[10px] text-[#7A6A5C] mt-0.5 line-clamp-2">
                    {lane.description}
                  </span>
                </div>

                {/* 5 Phase Cells */}
                {FLOW_PHASES.map((phase) => {
                  const cellNodes = FLOW_MAP_NODES.filter(
                    (n) =>
                      n.lane === lane.id &&
                      n.phase === phase.id &&
                      (selectedTypeFilter === 'all' || n.type === selectedTypeFilter) &&
                      (searchQuery === '' ||
                        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (n.ruleReference && n.ruleReference.toLowerCase().includes(searchQuery.toLowerCase())))
                  );

                  return (
                    <div
                      key={phase.id}
                      className="p-2 border-r border-orange-100 last:border-r-0 space-y-2 min-h-[90px] flex flex-col justify-start"
                    >
                      {cellNodes.map((node) => {
                        const isPinned = pinnedNodeId === node.id;
                        const isHovered = hoveredNodeId === node.id;
                        const isUpstream = upstreamSet.has(node.id);
                        const isDownstream = downstreamSet.has(node.id);

                        let highlightClasses = 'border-slate-200 bg-white hover:border-orange-300';
                        if (isPinned || isHovered) {
                          highlightClasses = 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/80 shadow-md scale-[1.02] z-10';
                        } else if (isUpstream) {
                          highlightClasses = 'ring-2 ring-blue-400 border-blue-400 bg-blue-50/80 shadow-xs';
                        } else if (isDownstream) {
                          highlightClasses = 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-50/80 shadow-xs';
                        }

                        return (
                          <div
                            key={node.id}
                            onMouseEnter={() => setHoveredNodeId(node.id)}
                            onMouseLeave={() => setHoveredNodeId(null)}
                            onClick={() => setPinnedNodeId(node.id === pinnedNodeId ? null : node.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-150 ${highlightClasses}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getNodeTypeBadge(
                                  node.type
                                )}`}
                              >
                                {node.type}
                              </span>
                              {node.relatedScenarioId && (
                                <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1 py-0.2 rounded flex items-center">
                                  <Play className="w-2.5 h-2.5 mr-0.5 fill-orange-600" />
                                  Sim
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-[#3A2E25] line-clamp-2 leading-tight">
                              {node.title}
                            </div>
                            {node.ruleReference && (
                              <div className="mt-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 line-clamp-1">
                                ⚖️ {node.ruleReference}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Inspector Drawer / Card */}
      {activeFocusNode ? (
        <div className="bg-white rounded-2xl p-5 border-2 border-orange-300 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-100">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getNodeTypeBadge(
                  activeFocusNode.type
                )}`}
              >
                {activeFocusNode.type}
              </span>
              <span className="text-xs font-extrabold text-[#7A6A5C]">
                {activeFocusNode.lane} • {activeFocusNode.phase}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {activeFocusNode.relatedScenarioId && (
                <button
                  onClick={() => runScenario && runScenario(activeFocusNode.relatedScenarioId!)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run in Scenario Simulator</span>
                </button>
              )}
              <button
                onClick={() => setPinnedNodeId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                Close Inspector ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Description & Rules */}
            <div className="md:col-span-1 space-y-2">
              <h3 className="text-sm font-black text-[#3A2E25]">
                {activeFocusNode.title}
              </h3>
              <p className="text-[#7A6A5C] leading-relaxed">
                {activeFocusNode.summary}
              </p>
              {activeFocusNode.ruleReference && (
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  ⚖️ Governed by: {activeFocusNode.ruleReference}
                </div>
              )}
            </div>

            {/* Links & State Variables Touched */}
            <div className="md:col-span-1 space-y-1.5">
              <span className="font-bold text-[#3A2E25] uppercase tracking-wider text-[10px]">
                Cross-System Links Touched:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeFocusNode.linksTouched.map((link: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-900 border border-orange-100 font-semibold text-[11px]"
                  >
                    🔗 {link}
                  </span>
                ))}
              </div>
            </div>

            {/* Upstream & Downstream Flow Links */}
            <div className="md:col-span-1 space-y-2">
              <div>
                <span className="font-bold text-[#3A2E25] uppercase tracking-wider text-[10px]">
                  Upstream Dependencies:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeFocusNode.upstreamIds.length > 0 ? (
                    activeFocusNode.upstreamIds.map((uid: string) => {
                      const uNode = FLOW_MAP_NODES.find((n) => n.id === uid);
                      return (
                        <button
                          key={uid}
                          onClick={() => setPinnedNodeId(uid)}
                          className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition"
                        >
                          ← {uNode?.title.split(' ')[0]} {uNode?.title.split(' ')[1]}...
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-400">Initial Trigger</span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-bold text-[#3A2E25] uppercase tracking-wider text-[10px]">
                  Downstream Consequences:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeFocusNode.downstreamIds.length > 0 ? (
                    activeFocusNode.downstreamIds.map((did: string) => {
                      const dNode = FLOW_MAP_NODES.find((n) => n.id === did);
                      return (
                        <button
                          key={did}
                          onClick={() => setPinnedNodeId(did)}
                          className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition"
                        >
                          → {dNode?.title.split(' ')[0]} {dNode?.title.split(' ')[1]}...
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-400">Terminal Node</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white/60 rounded-2xl border border-dashed border-orange-200 text-center text-xs text-[#7A6A5C]">
          Hover or click any node to trace its upstream dependencies, downstream effects, and links touched.
        </div>
      )}
    </div>
  );
};
