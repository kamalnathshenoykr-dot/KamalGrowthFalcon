import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCENARIOS_DATA, FLOW_PHASES } from '../data/flowAndScenariosData';
import {
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { SimulationParty } from '../types';

export const ScenarioSimulatorModal: React.FC = () => {
  const {
    scenarioDrawerOpen,
    setScenarioDrawerOpen,
    activeScenario,
    activeScenarioStepIndex,
    runScenario,
    nextScenarioStep,
    prevScenarioStep,
    closeScenario,
    setCurrentView,
    setCustomerSubTab,
    setKitchenSubTab,
    setRiderBottomTab,
    setFinanceSubTab,
    setOverviewSubTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');

  const filteredScenarios = SCENARIOS_DATA.filter((scen) => {
    const matchesSearch =
      scen.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scen.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scen.rulesApplied.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPhase = selectedPhaseFilter === 'all' || scen.phase === selectedPhaseFilter;
    return matchesSearch && matchesPhase;
  });

  const jumpToScreen = (
    screenTarget: 'customer' | 'kitchen' | 'rider' | 'finance' | 'overview' | 'rules',
    subTabTarget?: string
  ) => {
    setCurrentView(screenTarget);
    if (subTabTarget) {
      if (screenTarget === 'customer') setCustomerSubTab(subTabTarget as any);
      if (screenTarget === 'kitchen') setKitchenSubTab(subTabTarget as any);
      if (screenTarget === 'rider') setRiderBottomTab(subTabTarget as any);
      if (screenTarget === 'finance') setFinanceSubTab(subTabTarget as any);
      if (screenTarget === 'overview') setOverviewSubTab(subTabTarget as any);
    }
  };

  const getPartyIcon = (party: SimulationParty) => {
    switch (party) {
      case 'customer':
        return '👤 Customer';
      case 'kitchen':
        return '🍳 Kitchen';
      case 'rider':
        return '🛵 Rider';
      case 'ops desk':
        return '🛡️ Ops Desk';
      case 'bank':
        return '🏦 Bank';
      default:
        return party;
    }
  };

  const getPartyColor = (party: SimulationParty) => {
    switch (party) {
      case 'customer':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'kitchen':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'rider':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ops desk':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'bank':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      {/* Floating Bottom-Left Trigger Button */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setScenarioDrawerOpen(true)}
          className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Scenarios</span>
          {activeScenario && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          )}
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
            {SCENARIOS_DATA.length}
          </span>
        </button>
      </div>

      {/* Simulator Modal / Drawer */}
      {scenarioDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl h-[90vh] bg-[#FFF8EE] rounded-3xl shadow-2xl border border-amber-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#3A2E25] tracking-tight">
                    Scenario Simulator
                  </h2>
                  <p className="text-xs text-[#7A6A5C]">
                    Force real-world exceptions & trace what each party sees in real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScenarioDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content: Split into Scenario Selector vs Active Runner */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {activeScenario ? (
                /* ACTIVE SCENARIO TIMELINE VIEW */
                <div className="space-y-6">
                  {/* Active Header Card */}
                  <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                          {activeScenario.triggerType}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {activeScenario.phase}
                        </span>
                      </div>
                      <button
                        onClick={closeScenario}
                        className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pick Another Scenario</span>
                      </button>
                    </div>

                    <h3 className="text-xl font-black text-[#3A2E25]">
                      {activeScenario.title}
                    </h3>
                    <p className="text-xs text-[#7A6A5C] mt-1 leading-relaxed">
                      {activeScenario.description}
                    </p>

                    {/* Order Snapshot & Rules Applied */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                      {activeScenario.orderPreview ? (
                        <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100">
                          <div className="font-bold text-orange-900 mb-1">📦 Mock Order Seeded:</div>
                          <div className="text-orange-950">
                            <span className="font-semibold">{activeScenario.orderPreview.brand}:</span>{' '}
                            {activeScenario.orderPreview.items} (₹{activeScenario.orderPreview.amount})
                          </div>
                          <div className="text-[11px] text-orange-800/80 mt-1">
                            Pin {activeScenario.orderPreview.pinCode} • {activeScenario.orderPreview.channel}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100">
                          <div className="font-bold text-orange-900 mb-1">📦 System Trigger:</div>
                          <div className="text-orange-950 text-[11px]">Real-time operational event trigger</div>
                        </div>
                      )}

                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                        <div className="font-bold text-amber-900 mb-1">⚖️ Rules & Thresholds Applied:</div>
                        <ul className="space-y-0.5 text-amber-950 text-[11px]">
                          {activeScenario.rulesApplied.map((r, i) => (
                            <li key={i} className="flex items-start space-x-1">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step Progress Stepper */}
                  <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Timeline Step {activeScenarioStepIndex + 1} of {activeScenario.steps.length}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={prevScenarioStep}
                          disabled={activeScenarioStepIndex === 0}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition"
                        >
                          <ChevronLeft className="w-4 h-4 inline" /> Prev
                        </button>
                        <button
                          onClick={nextScenarioStep}
                          disabled={activeScenarioStepIndex === activeScenario.steps.length - 1}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-30 transition shadow-xs"
                        >
                          Next <ChevronRight className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>

                    {/* Step Title & Offset */}
                    {activeScenario.steps[activeScenarioStepIndex] && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold flex items-center justify-center">
                            {activeScenarioStepIndex + 1}
                          </span>
                          <h4 className="text-base font-extrabold text-[#3A2E25]">
                            {activeScenario.steps[activeScenarioStepIndex].stepTitle}
                          </h4>
                          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            ⏱️ {activeScenario.steps[activeScenarioStepIndex].durationOffset}
                          </span>
                        </div>

                        {activeScenario.steps[activeScenarioStepIndex].ruleInvoked && (
                          <div className="mt-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl inline-block">
                            📌 Triggered Rule: {activeScenario.steps[activeScenarioStepIndex].ruleInvoked}
                          </div>
                        )}

                        {/* Perspectives Grid (What each party sees) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {activeScenario.steps[activeScenarioStepIndex].perspectives.map((p, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border transition-all ${getPartyColor(p.party)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-black text-xs uppercase tracking-wider">
                                  {getPartyIcon(p.party)}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-xs border">
                                  {p.statusBadge}
                                </span>
                              </div>

                              <p className="text-xs leading-relaxed font-medium">
                                {p.description}
                              </p>

                              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                                <span className="font-semibold opacity-80">
                                  Impact: {p.impactMetric}
                                </span>
                                <button
                                  onClick={() => jumpToScreen(p.screenTarget, p.subTabTarget)}
                                  className="font-bold underline flex items-center space-x-1 hover:opacity-80 transition"
                                >
                                  <span>Go to screen</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Outcome Box */}
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black text-emerald-900 mb-0.5">Final System Outcome:</div>
                      <div className="leading-relaxed">{activeScenario.outcome}</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SCENARIO CATALOG LIST */
                <div className="space-y-4">
                  {/* Search and Phase Filters */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search scenarios by exception, rule, or keyword (e.g. late, breakdown, refund)..."
                        className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-orange-200 text-xs text-[#3A2E25] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        onClick={() => setSelectedPhaseFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                          selectedPhaseFilter === 'all'
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All Phases ({SCENARIOS_DATA.length})
                      </button>
                      {FLOW_PHASES.map((ph) => {
                        const count = SCENARIOS_DATA.filter((s) => s.phase === ph.id).length;
                        return (
                          <button
                            key={ph.id}
                            onClick={() => setSelectedPhaseFilter(ph.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                              selectedPhaseFilter === ph.id
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {ph.label.split(':')[1] || ph.label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scenarios Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredScenarios.map((scen) => (
                      <div
                        key={scen.id}
                        className="bg-white rounded-2xl p-5 border border-orange-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                scen.triggerType === 'Exception'
                                  ? 'bg-rose-100 text-rose-700'
                                  : scen.triggerType === 'Complaint'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {scen.triggerType}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {scen.phase.split(' ')[0]}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm text-[#3A2E25] group-hover:text-orange-600 transition">
                            {scen.title}
                          </h3>
                          <p className="text-xs text-[#7A6A5C] mt-1.5 leading-relaxed line-clamp-2">
                            {scen.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {scen.rulesApplied.map((rule, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-medium"
                              >
                                {rule}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">
                            {scen.steps.length} timeline steps
                          </span>
                          <button
                            onClick={() => runScenario(scen.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xs transition hover:scale-105 active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Simulate Case</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredScenarios.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-orange-200">
                      <p className="text-sm font-bold text-[#3A2E25]">No scenarios match your query</p>
                      <p className="text-xs text-[#7A6A5C] mt-1">Try searching for &quot;refund&quot;, &quot;breakdown&quot;, or &quot;late&quot;.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
