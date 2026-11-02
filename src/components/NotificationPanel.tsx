import React from 'react';
import { useApp } from '../context/AppContext';
import { STOCK_OUT_ALERTS } from '../data/mockData';
import {
  Bell,
  X,
  AlertTriangle,
  Flame,
  Clock,
  Package,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Bike,
} from 'lucide-react';

export const NotificationPanel: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    orders,
    sosActive,
    resolveSOS,
    setCurrentView,
    setKitchenSubTab,
  } = useApp();

  if (!notificationsOpen) return null;

  // Derive notifications
  const sosCount = sosActive ? 1 : 0;
  const lateOrders = orders.filter(
    (o) => (o.status === 'Preparing' || o.status === 'Placed') && o.elapsedMinutes > o.targetPrepMinutes
  );
  const stockAlerts = STOCK_OUT_ALERTS;

  const totalCount = sosCount + lateOrders.length + stockAlerts.length;

  const handleNavigate = (view: 'kitchen', tab: 'live_orders' | 'inventory' | 'fleet') => {
    setCurrentView(view);
    setKitchenSubTab(tab);
    setNotificationsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setNotificationsOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EE] text-[#3A2E25] border-l border-orange-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-orange-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#3A2E25]">Central Operational Alerts</h3>
                <p className="text-xs text-[#7A6A5C]">
                  {totalCount > 0 ? `${totalCount} items need attention` : 'All systems normal'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* SOS Alerts */}
            {sosActive && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Critical Rider SOS Alert Active</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-rose-300 shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-rose-900">
                        Rider Emergency SOS Broadcast
                      </h4>
                      <p className="text-xs text-[#7A6A5C] mt-0.5">
                        Priority emergency signal broadcast from Bengaluru Fleet. Live tracking active.
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      URGENT
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleNavigate('kitchen', 'fleet')}
                      className="flex-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white py-2 px-3 rounded-xl transition shadow-xs"
                    >
                      View in Fleet Console
                    </button>
                    <button
                      onClick={() => resolveSOS()}
                      className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#3A2E25] py-2 px-3 rounded-xl transition"
                    >
                      Resolve Alert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Late Orders */}
            {lateOrders.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Late Kitchen Prep ({lateOrders.length})</span>
                </div>
                {lateOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-[#3A2E25]">{order.id}</span>
                          <span className="text-xs text-[#7A6A5C]">· {order.brandName}</span>
                        </div>
                        <p className="text-xs text-amber-900 mt-0.5">
                          Elapsed {order.elapsedMinutes}m / SLA {order.targetPrepMinutes}m ({order.kitchenName})
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        +{order.elapsedMinutes - order.targetPrepMinutes}m Over
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigate('kitchen', 'live_orders')}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                    >
                      <span>Prioritize on Kanban board</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Out Alerts */}
            {stockAlerts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-orange-700 uppercase tracking-wider">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span>Inventory Stock-Out Alerts ({stockAlerts.length})</span>
                </div>
                {stockAlerts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#3A2E25]">{item.item}</p>
                        <p className="text-[11px] text-[#7A6A5C]">
                          Stock: <span className="text-rose-600 font-bold">{item.currentStock} units</span> (Reorder threshold: {item.reorderPoint})
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.urgency === 'High'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.urgency} Urgency
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigate('kitchen', 'inventory')}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 pt-1"
                    >
                      <span>Restock in Inventory Tab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {totalCount === 0 && (
              <div className="text-center py-12 px-4 space-y-3 bg-white rounded-2xl border border-dashed border-orange-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#3A2E25]">All Operations Nominal</h4>
                <p className="text-xs text-[#7A6A5C] max-w-xs mx-auto leading-relaxed">
                  No active SOS calls, kitchen SLA breaches, or inventory stock-outs. The Bangalore cloud network is performing cleanly.
                </p>
              </div>
            )}
          </div>

          {/* Footer quick action */}
          <div className="p-4 border-t border-orange-200 bg-white flex items-center justify-between text-xs text-[#7A6A5C]">
            <span>Aggregated across all 5 kitchen hubs</span>
            <button
              onClick={() => handleNavigate('kitchen', 'live_orders')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
            >
              <span>Go to Kitchen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
