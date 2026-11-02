import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  X,
  Radio,
  Clock,
  ArrowRight,
  ShoppingBag,
  ChefHat,
  Landmark,
  Bike,
  Sparkles,
} from 'lucide-react';

export const LiveActivityDrawer: React.FC = () => {
  const {
    systemActivityOpen,
    setSystemActivityOpen,
    systemEvents,
    demoMode,
    setDemoMode,
  } = useApp();

  if (!systemActivityOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setSystemActivityOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EE] text-[#3A2E25] border-l border-orange-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-orange-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-extrabold text-[#3A2E25]">Live System Activity</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-xs text-[#7A6A5C]">
                  Cross-view state sync monitor & events rail
                </p>
              </div>
            </div>
            <button
              onClick={() => setSystemActivityOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close activity monitor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Burst Banner */}
          <div className="px-5 py-3 bg-white/70 border-b border-orange-100 flex items-center justify-between">
            <div className="text-xs text-[#7A6A5C]">
              <span className="font-bold text-[#3A2E25]">Live Order Flow: </span>
              {demoMode ? (
                <span className="text-emerald-600 font-bold">Automated burst running</span>
              ) : (
                <span className="text-slate-500">Manual / Reactive mode</span>
              )}
            </div>
            <button
              onClick={() => setDemoMode((p) => !p)}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition ${
                demoMode
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              {demoMode ? 'PAUSE' : 'BURST'}
            </button>
          </div>

          {/* Event Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {systemEvents.map((evt) => {
              const getIcon = () => {
                switch (evt.targetView) {
                  case 'customer':
                    return <ShoppingBag className="w-4 h-4 text-orange-600" />;
                  case 'kitchen':
                    return <ChefHat className="w-4 h-4 text-amber-600" />;
                  case 'finance':
                    return <Landmark className="w-4 h-4 text-purple-600" />;
                  default:
                    return <Bike className="w-4 h-4 text-emerald-600" />;
                }
              };

              const getBadgeColor = () => {
                switch (evt.targetView) {
                  case 'customer':
                    return 'bg-orange-100 text-orange-800 border-orange-200';
                  case 'kitchen':
                    return 'bg-amber-100 text-amber-800 border-amber-200';
                  case 'finance':
                    return 'bg-purple-100 text-purple-800 border-purple-200';
                  default:
                    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                }
              };

              return (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-white border border-orange-100 hover:border-orange-200 shadow-xs transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-lg bg-orange-50 text-orange-600">
                        {getIcon()}
                      </div>
                      <span className="text-xs font-bold text-[#3A2E25]">
                        {evt.action}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A6A5C] font-mono">
                      {evt.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#3A2E25] leading-relaxed bg-[#FFF8EE] p-3 rounded-xl border border-orange-100/70 font-mono text-[11px]">
                    {evt.impactDetail}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#7A6A5C] pt-1">
                    <span>Partner: <span className="text-[#3A2E25] font-semibold">{evt.riderName}</span></span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeColor()}`}>
                      Synced → {evt.targetView}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-orange-200 bg-white text-center">
            <p className="text-xs text-[#7A6A5C]">
              All views share active state. Actions in Rider or Customer immediately reflect in Kitchen & Bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
