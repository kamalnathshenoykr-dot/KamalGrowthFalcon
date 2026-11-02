import React, { useState } from 'react';
import { useApp, KitchenSubTab } from '../context/AppContext';
import {
  KITCHENS,
  MENU_ITEMS,
  HOURLY_ORDER_LOAD,
  INGREDIENT_WASTAGE,
  STOCK_OUT_ALERTS,
  HYGIENE_CHECKLIST_ITEMS,
} from '../data/mockData';
import { Order } from '../types';
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Package,
  Layers,
  Thermometer,
  Bike,
  Shield,
  ArrowRight,
  X,
  Phone,
  UserCheck,
  Check,
  ShieldAlert,
  Flame,
  PauseCircle,
  PlayCircle,
  HelpCircle,
  Box,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const KitchenDashboardView: React.FC = () => {
  const {
    kitchenSubTab,
    setKitchenSubTab,
    activeKitchenId,
    setActiveKitchenId,
    orders,
    updateOrderStatus,
    reviews,
    hygieneChecks,
    toggleHygieneCheck,
    riders,
    reassignOrder,
    sosActive,
    resolveSOS,
    rules,
    // Phase 2 Context handlers
    kitchenAcknowledgeAllergy,
    kitchenRejectOrder,
    kitchenDelayOrder,
    kitchenSendSpecialInstructionInquiry,
    kitchenTriggerQCReCook,
    depletedIngredients,
    depleteIngredient,
    restoreIngredient,
    packagingStock,
    updatePackagingStock,
    kitchenOnline,
    setKitchenOnline,
    batchedDeliveryDecision,
    setBatchedDeliveryDecision,
    pausedKitchenIds,
    toggleKitchenPause,
    recalledBatches,
    triggerBatchRecall,
    aggregatorPriceMismatchCount,
    syncAggregatorPrices,
    initiatePartnerOffboarding,
    offboardingSettlement,
    closeOffboardingSettlement,
  } = useApp();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [selectedReassignOrder, setSelectedReassignOrder] = useState<string>('');
  const [selectedTargetRider, setSelectedTargetRider] = useState<string>('');

  // Delay & Inquiry modal state
  const [delayModalOrderId, setDelayModalOrderId] = useState<string | null>(null);
  const [delayMinutesInput, setDelayMinutesInput] = useState(10);
  const [delayReasonInput, setDelayReasonInput] = useState('High order burst on dosa station; oven recalibration.');

  const [inquiryModalOrderId, setInquiryModalOrderId] = useState<string | null>(null);
  const [inquiryQuestion, setInquiryQuestion] = useState("Can't make without onion; freshly chopped spring onion available.");
  const [inquirySwap, setInquirySwap] = useState('Jain Paneer Bowl');

  const [rejectModalOrderId, setRejectModalOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Prep station overload / 3-min SLA limit exceeded');

  // Phase 5 Modals
  const [recallModalOpen, setRecallModalOpen] = useState(false);
  const [recallLotInput, setRecallLotInput] = useState('LOT-BLR-DAIRY-99');
  const [recallIngredientInput, setRecallIngredientInput] = useState('Organic Cow Ghee');
  const [recallDishInput, setRecallDishInput] = useState('Royal South Indian Thali');

  const activeKitchen = KITCHENS.find((k) => k.id === activeKitchenId) || KITCHENS[0];
  const isKitchenPaused = pausedKitchenIds.includes(activeKitchen.id);
  const kitchenOrders = orders.filter((o) => o.kitchenId === activeKitchenId);

  // Kanban column buckets
  const placedOrders = kitchenOrders.filter((o) => o.status === 'Placed');
  const preparingOrders = kitchenOrders.filter((o) => o.status === 'Preparing');
  const readyOrders = kitchenOrders.filter((o) => o.status === 'Ready');
  const outForDeliveryOrders = kitchenOrders.filter((o) => o.status === 'Out for delivery');

  const openTicketsCount = placedOrders.length + preparingOrders.length;
  const isBusyModeActive = openTicketsCount >= rules.busyModeKitchenOpenOrdersCap;

  // Hygiene checklist calculation
  const completedHygieneCount = Object.values(hygieneChecks).filter(Boolean).length;
  const hygienePct = Math.round((completedHygieneCount / HYGIENE_CHECKLIST_ITEMS.length) * 100);
  const canGoOnline = completedHygieneCount === HYGIENE_CHECKLIST_ITEMS.length;

  // Performance data
  const dishPrepData = [
    { name: 'Ghee Roast Dosa', targetPrep: 8, actualAvgPrep: 6.8 },
    { name: 'Royal Thali', targetPrep: 14, actualAvgPrep: 13.2 },
    { name: 'Butter Roll', targetPrep: 10, actualAvgPrep: 11.4 },
    { name: 'Quinoa Bowl', targetPrep: 9, actualAvgPrep: 8.5 },
    { name: 'Dum Biryani', targetPrep: 15, actualAvgPrep: 14.8 },
  ];

  const kitchenWaitData = [
    { name: 'Koramangala Hub', waitMinutes: 3.8, targetWait: 4.0 },
    { name: 'Indiranagar Central', waitMinutes: 4.1, targetWait: 4.0 },
    { name: 'HSR Cloud Space', waitMinutes: 5.4, targetWait: 4.0 },
    { name: 'Whitefield Works', waitMinutes: 4.6, targetWait: 4.0 },
    { name: 'Bellandur Hive', waitMinutes: 3.9, targetWait: 4.0 },
  ];

  // Trigger Gemini AI review analysis
  const handleAnalyzeReviews = async () => {
    setIsAiLoading(true);
    setAiModalOpen(true);
    try {
      const response = await fetch('/api/gemini/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: reviews.slice(0, 10),
          brand: 'All Brands',
          kitchen: activeKitchen.name,
        }),
      });
      const data = await response.json();
      if (data.data) {
        setAiAnalysisResult(data.data);
      }
    } catch (err) {
      console.warn('Review analysis fetch failed, falling back:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExecuteReassignment = () => {
    if (!selectedReassignOrder || !selectedTargetRider) return;
    reassignOrder(selectedReassignOrder, selectedTargetRider);
    setSelectedReassignOrder('');
    setSelectedTargetRider('');
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Header with Kitchen Selector and Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">Kitchen Operations</h1>
              {isKitchenPaused && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  PAUSED (Failover Active)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#7A6A5C] mt-0.5">
              <span>Active Hub:</span>
              <select
                value={activeKitchenId}
                onChange={(e) => setActiveKitchenId(e.target.value)}
                className="bg-white text-[#3A2E25] font-bold px-2.5 py-1 rounded-xl border border-orange-200 cursor-pointer focus:outline-none shadow-xs"
              >
                {KITCHENS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.type === 'owned' ? 'Own Hub' : 'Partner Restaurant'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sub-Tabs: Live Orders | Performance | Inventory | Hygiene | Fleet */}
        <div className="inline-flex items-center p-1 bg-white border border-orange-200 rounded-2xl shadow-xs self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setKitchenSubTab('live_orders')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              kitchenSubTab === 'live_orders'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Live Orders ({kitchenOrders.length})
          </button>
          <button
            onClick={() => setKitchenSubTab('performance')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              kitchenSubTab === 'performance'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setKitchenSubTab('inventory')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              kitchenSubTab === 'inventory'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Inventory & Packaging
          </button>
          <button
            onClick={() => setKitchenSubTab('hygiene')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              kitchenSubTab === 'hygiene'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Hygiene Gate ({hygienePct}%)
          </button>
          <button
            onClick={() => setKitchenSubTab('fleet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              kitchenSubTab === 'fleet'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Fleet & Dispatch
          </button>
        </div>
      </div>

      {/* Busy Mode Threshold Banner if triggered */}
      {isBusyModeActive && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
            <div>
              <span className="font-black">
                Busy Mode Activated ({openTicketsCount}/{rules.busyModeKitchenOpenOrdersCap} open orders):
              </span>{' '}
              Aggregator intake throttled. Direct App prep times buffered by +15 mins to preserve food quality.
            </div>
          </div>
          <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Rule Active</span>
        </div>
      )}

      {/* ================= SUB-TAB 1: LIVE ORDERS (KDS KANBAN) ================= */}
      {kitchenSubTab === 'live_orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. New Orders (With SLA countdown and mandatory allergy acknowledgment) */}
            <div className="bg-white border border-orange-100 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="text-xs font-black text-[#3A2E25] uppercase tracking-wider">
                  New Placed ({placedOrders.length})
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  SLA: {rules.kitchenAcceptWindowMin}m
                </span>
              </div>
              <div className="space-y-3 min-h-[300px]">
                {placedOrders.map((order) => {
                  const hasAllergy = !!order.allergyNote;
                  const isAcknowledged = order.allergyAcknowledgedByKitchen;

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border space-y-2.5 food-card ${
                        hasAllergy && !isAcknowledged
                          ? 'border-rose-400 bg-rose-50/80 shadow-md ring-2 ring-rose-400/30'
                          : 'border-orange-100 bg-[#FFF8EE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-[#3A2E25]">{order.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-orange-800 border border-orange-200">
                          {order.channel}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-orange-600">{order.brandName}</p>
                      <div className="text-[11px] text-[#7A6A5C] space-y-0.5">
                        {order.items.map((i, idx) => (
                          <p key={idx} className="truncate font-medium">
                            {i.quantity}x {i.name}
                          </p>
                        ))}
                      </div>

                      {/* Prominent Red Allergy Banner on KDS ticket */}
                      {hasAllergy && (
                        <div className="p-2.5 bg-rose-100/90 rounded-xl border border-rose-300 text-xs text-rose-950 space-y-1.5">
                          <div className="flex items-center space-x-1 font-black text-rose-900">
                            <ShieldAlert className="w-4 h-4 text-rose-700 animate-pulse" />
                            <span>CHEF ALLERGY WARNING:</span>
                          </div>
                          <p className="text-[11px] font-semibold italic">&quot;{order.allergyNote}&quot;</p>
                          {!isAcknowledged ? (
                            <button
                              onClick={() => kitchenAcknowledgeAllergy(order.id)}
                              className="w-full py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-[10px] shadow-xs"
                            >
                              ✓ Acknowledge Allergen Safety
                            </button>
                          ) : (
                            <span className="inline-block text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Segregated Pans Verified ✓
                            </span>
                          )}
                        </div>
                      )}

                      {/* Special Action Buttons: Ask Customer & Delay */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            setInquiryModalOrderId(order.id);
                          }}
                          className="flex-1 py-1 bg-white border border-orange-200 text-[#3A2E25] rounded-lg text-[10px] font-bold hover:bg-orange-50"
                        >
                          Ask Customer
                        </button>
                        <button
                          onClick={() => setDelayModalOrderId(order.id)}
                          className="flex-1 py-1 bg-white border border-orange-200 text-[#3A2E25] rounded-lg text-[10px] font-bold hover:bg-orange-50"
                        >
                          Delay +10m
                        </button>
                        <button
                          onClick={() => setRejectModalOrderId(order.id)}
                          className="py-1 px-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>

                      {/* Start Prep button (warns if allergy not acknowledged) */}
                      <button
                        onClick={() => {
                          if (hasAllergy && !isAcknowledged) {
                            alert('Mandatory Safety: Please acknowledge the allergen alert before firing prep!');
                            return;
                          }
                          updateOrderStatus(order.id, 'Preparing');
                        }}
                        className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Accept & Start Prep →
                      </button>
                    </div>
                  );
                })}
                {placedOrders.length === 0 && (
                  <p className="text-xs text-[#7A6A5C] text-center pt-16">No new orders waiting</p>
                )}
              </div>
            </div>

            {/* 2. Preparing Orders (With QC Failure Trigger & Delay Option) */}
            <div className="bg-white border border-orange-100 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                  Preparing ({preparingOrders.length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              </div>
              <div className="space-y-3 min-h-[300px]">
                {preparingOrders.map((order) => {
                  const isLate = order.elapsedMinutes > order.targetPrepMinutes;
                  const isReCooking = order.qcStatus === 're_cooking';

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border space-y-2 food-card ${
                        isReCooking
                          ? 'border-purple-400 bg-purple-50/70 shadow-xs'
                          : isLate
                          ? 'border-rose-300 bg-rose-50/50'
                          : 'border-orange-100 bg-[#FFF8EE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-[#3A2E25]">{order.id}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isReCooking
                              ? 'bg-purple-600 text-white animate-pulse'
                              : isLate
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {isReCooking ? 'QC Re-cook Rush' : `${order.elapsedMinutes}m / ${order.targetPrepMinutes}m`}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-orange-600">{order.brandName}</p>
                      <div className="text-[11px] text-[#7A6A5C] space-y-0.5">
                        {order.items.map((i, idx) => (
                          <p key={idx} className="truncate font-medium">
                            {i.quantity}x {i.name}
                          </p>
                        ))}
                      </div>

                      {/* QC Re-cook and Delay Actions */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => kitchenTriggerQCReCook(order.id, 'Burnt dosa / container seal spilled')}
                          className="flex-1 py-1 bg-white border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold hover:bg-rose-50"
                        >
                          QC Fail: Re-cook
                        </button>
                        <button
                          onClick={() => setDelayModalOrderId(order.id)}
                          className="flex-1 py-1 bg-white border border-orange-200 text-[#3A2E25] rounded-lg text-[10px] font-bold hover:bg-orange-50"
                        >
                          Delay +10m
                        </button>
                      </div>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Mark Ready & Sealed →
                      </button>
                    </div>
                  );
                })}
                {preparingOrders.length === 0 && (
                  <p className="text-xs text-[#7A6A5C] text-center pt-16">Kitchen stations clear</p>
                )}
              </div>
            </div>

            {/* 3. Ready for Pickup */}
            <div className="bg-white border border-orange-100 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  Ready ({readyOrders.length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-3 min-h-[300px]">
                {readyOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-[#FFF8EE] border border-orange-100 space-y-2 food-card">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#3A2E25]">{order.id}</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                        Packed & Sealed
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-orange-600">{order.brandName}</p>
                    <p className="text-xs text-[#7A6A5C]">
                      Rider: <strong className="text-[#3A2E25]">{order.riderName || 'Ramesh Kumar'}</strong>
                    </p>
                    {order.isBatched && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Batched Route
                      </span>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Out for delivery')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Handover to Rider →
                    </button>
                  </div>
                ))}
                {readyOrders.length === 0 && (
                  <p className="text-xs text-[#7A6A5C] text-center pt-16">No orders awaiting pickup</p>
                )}
              </div>
            </div>

            {/* 4. Dispatched & Out */}
            <div className="bg-white border border-orange-100 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="text-xs font-black text-teal-800 uppercase tracking-wider">
                  Out for Delivery ({outForDeliveryOrders.length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </div>
              <div className="space-y-3 min-h-[300px]">
                {outForDeliveryOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-[#FFF8EE] border border-orange-100 space-y-2 food-card">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#3A2E25]">{order.id}</span>
                      <span className="text-[10px] text-teal-700 font-extrabold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        On Transit
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-orange-600">{order.brandName}</p>
                    <p className="text-xs text-[#7A6A5C]">
                      Destination: <strong className="text-[#3A2E25]">{order.area}</strong>
                    </p>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Confirm Dropoff ✓
                    </button>
                  </div>
                ))}
                {outForDeliveryOrders.length === 0 && (
                  <p className="text-xs text-[#7A6A5C] text-center pt-16">No active delivery trips</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: PERFORMANCE ================= */}
      {kitchenSubTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Today&apos;s Output</span>
              <div className="text-2xl font-black text-[#3A2E25]">{activeKitchen.todayCompletedOrders} Orders</div>
              <p className="text-xs text-emerald-600 font-bold">98.2% fulfillment rate</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Capacity Utilized</span>
              <div className="text-2xl font-black text-orange-600">{activeKitchen.spareCapacityUtilizedPct}%</div>
              <p className="text-xs text-[#7A6A5C]">Target: 85-95% efficiency</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Chef Lead</span>
              <div className="text-base font-extrabold text-[#3A2E25] truncate">{activeKitchen.chefInCharge}</div>
              <p className="text-xs text-amber-700 font-bold">{activeKitchen.rating}★ Station Rating</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Hygiene Audit</span>
              <div className="text-2xl font-black text-emerald-600">{activeKitchen.hygieneAuditScore}/100</div>
              <p className="text-xs text-[#7A6A5C]">FSSAI Central Compliant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-[#3A2E25]">Target vs Actual Prep SLA (Mins)</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dishPrepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FDE8D3" vertical={false} />
                    <XAxis dataKey="name" stroke="#9E8D7C" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#9E8D7C" unit="m" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#FDBA74', borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="targetPrep" fill="#FDBA74" name="Target Prep SLA" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actualAvgPrep" fill="#F97316" name="Actual Avg Prep" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#3A2E25]">AI Kitchen Quality Audit</h3>
                <button
                  onClick={handleAnalyzeReviews}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Analyzing...' : 'Run Gemini Audit'}</span>
                </button>
              </div>
              <p className="text-xs text-[#7A6A5C]">
                Analyzes live customer reviews to detect cooking drift, packaging spills, and prep bottlenecks.
              </p>
              <div className="p-4 bg-[#FFF8EE] rounded-xl border border-orange-100 space-y-2 text-xs">
                <p className="font-bold text-[#3A2E25]">Latest AI Feedback Summary:</p>
                <p className="text-[#7A6A5C]">
                  &quot;High praise for South Indian filter coffee thermal retention (flask thermo). Mild complaint of
                  dosa crispness fading during heavy rain on Koramangala route. Recommendation: Punch lid vent hole 2mm.&quot;
                </p>
              </div>
            </div>

            {/* Aggregator Price Mismatch & Menu Synchronization Card */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-3 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-[#3A2E25]">Omnichannel Menu Pricing Parity</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      aggregatorPriceMismatchCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {aggregatorPriceMismatchCount > 0 ? `${aggregatorPriceMismatchCount} Channel Variances` : '100% Aligned'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6A5C] mt-1">
                    Continuous scraper checks direct app pricing vs Swiggy, Zomato, and ONDC to prevent customer churn or margin leakage.
                  </p>
                </div>
                <button
                  onClick={syncAggregatorPrices}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>1-Tap Synchronize Across Channels</span>
                </button>
              </div>

              {aggregatorPriceMismatchCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex flex-wrap gap-4">
                  <span>• Thali Theory Special: Direct ₹240 vs Swiggy ₹260 (+₹20 discrepancy)</span>
                  <span>• Bowl Republic Quinoa: Direct ₹280 vs Zomato ₹295 (+₹15 discrepancy)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: INVENTORY & PACKAGING ================= */}
      {kitchenSubTab === 'inventory' && (
        <div className="space-y-6">
          {/* Packaging Stock Level KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Bagasse Boxes</span>
              <div className="text-2xl font-black text-[#3A2E25]">{packagingStock.bagasse_box ?? 48} units</div>
              <p className="text-xs text-emerald-600 font-bold">For Thali Theory</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Foil Containers</span>
              <div className="text-2xl font-black text-[#3A2E25]">{packagingStock.foil_container ?? 32} units</div>
              <p className="text-xs text-emerald-600 font-bold">For Midnight Maska</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Paper Salad Bowls</span>
              <div className="text-2xl font-black text-[#3A2E25]">{packagingStock.paper_bowl ?? 55} units</div>
              <p className="text-xs text-emerald-600 font-bold">For Bowl Republic</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Thermal Flasks</span>
              <div className="text-2xl font-black text-[#3A2E25]">{packagingStock.flask_thermo ?? 14} units</div>
              <p className="text-xs text-amber-700 font-bold">Filter Coffee</p>
            </div>
          </div>

          {/* Interactive Ingredient 86 / Depletion Simulator (Phase 2 operational case) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Recipe Ingredient Depletion (Live 86)</h3>
                <p className="text-xs text-[#7A6A5C]">
                  Depleting an ingredient automatically 86&apos;s affected dishes on live customer menus to eliminate stock-out cancellations.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { ingredient: 'Sambar Toor Dal', affectedDishId: 'tt-1', dishName: 'Royal Dakshin Thali' },
                  { ingredient: 'Malabar Paneer', affectedDishId: 'tt-4', dishName: 'Malabar Paratha Combo' },
                  { ingredient: 'Organic Quinoa', affectedDishId: 'br-1', dishName: 'Protein Power Quinoa Bowl' },
                  { ingredient: 'Mutton Bone Marrow', affectedDishId: 'mm-2', dishName: 'Midnight Maska Dum Biryani' },
                ].map((item) => {
                  const isDepleted = depletedIngredients.includes(item.ingredient);

                  return (
                    <div
                      key={item.ingredient}
                      className="p-3 bg-[#FFF8EE] rounded-xl border border-orange-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#3A2E25]">{item.ingredient}</p>
                        <p className="text-[11px] text-[#7A6A5C]">Affects: {item.dishName}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isDepleted) {
                            restoreIngredient(item.ingredient, item.affectedDishId);
                          } else {
                            depleteIngredient(item.ingredient, item.affectedDishId);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          isDepleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {isDepleted ? 'Restock Item ✓' : 'Mark Depleted (86)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packaging Restock & Gating */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Packaging Stock Manager</h3>
                <p className="text-xs text-[#7A6A5C]">
                  Low stock auto-alerts dispatch and gates orders requiring that container.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { type: 'bagasse_box', name: 'Bagasse Eco Box' },
                  { type: 'foil_container', name: 'Aluminium Foil Container' },
                  { type: 'paper_bowl', name: 'Insulated Salad Bowl' },
                  { type: 'flask_thermo', name: 'Thermal Coffee Flask' },
                ].map((pkg) => (
                  <div
                    key={pkg.type}
                    className="p-3 bg-[#FFF8EE] rounded-xl border border-orange-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#3A2E25]">{pkg.name}</p>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        Current: {packagingStock[pkg.type] ?? 30} units
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => updatePackagingStock(pkg.type, -10)}
                        className="px-2 py-1 bg-white border border-orange-200 text-[#3A2E25] rounded-lg font-bold"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updatePackagingStock(pkg.type, 25)}
                        className="px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold shadow-xs"
                      >
                        +25 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Recall & QA Quarantine Section */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-orange-100">
                <div>
                  <h3 className="text-base font-extrabold text-[#3A2E25]">Ingredient Batch Recall &amp; QA Quarantine</h3>
                  <p className="text-xs text-[#7A6A5C]">
                    Immediately quarantine defective raw material lots across hubs and trigger automated alerts to diners.
                  </p>
                </div>
                <button
                  onClick={() => setRecallModalOpen(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Initiate Lot Recall</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {recalledBatches.map((rb, idx) => (
                  <div key={idx} className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-rose-950">
                        {rb.batchNumber} • {rb.ingredient} (Affected Dish: {rb.dish})
                      </p>
                      <p className="text-[11px] text-rose-700">Flagged: {rb.time} · 14 diners notified with preventative advisory</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold text-[10px] uppercase">
                      Quarantined &amp; Locked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: HYGIENE GATE ================= */}
      {kitchenSubTab === 'hygiene' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Hygiene Score</span>
              <div className="text-2xl font-black text-emerald-600">{hygienePct}%</div>
              <p className="text-xs text-[#7A6A5C] font-medium">
                {completedHygieneCount} of {HYGIENE_CHECKLIST_ITEMS.length} verified
              </p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Deep Freezer</span>
              <div className="text-2xl font-black text-teal-600">-18.4°C</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Digital probe verified</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Oil Quality (TPM)</span>
              <div className="text-2xl font-black text-[#3A2E25]">14.2%</div>
              <p className="text-xs text-emerald-600 font-bold">Target &lt; 22% TPM</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">FSSAI Status</span>
              <div className="text-2xl font-black text-emerald-600">{canGoOnline ? 'Online Ready' : 'Gate Locked'}</div>
              <p className="text-xs text-[#7A6A5C]">Mandatory audit check</p>
            </div>
          </div>

          {/* Mandatory Gate Alert */}
          {!canGoOnline && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-950 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
                <div>
                  <span className="font-extrabold">Mandatory Hygiene Gate Enforcement:</span> Complete all{' '}
                  {HYGIENE_CHECKLIST_ITEMS.length} checklist items to take {activeKitchen.name} live on Bangalore customer menus.
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                Gate Locked
              </span>
            </div>
          )}

          {/* Interactive Checklist */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Daily Bangalore Cloud Hygiene Checklist</h3>
                <p className="text-xs text-[#7A6A5C]">Shift supervisor digital sign-off log</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {completedHygieneCount}/{HYGIENE_CHECKLIST_ITEMS.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {HYGIENE_CHECKLIST_ITEMS.map((item) => {
                const isDone = !!hygieneChecks[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleHygieneCheck(item.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200 text-[#3A2E25]'
                        : 'bg-[#FFF8EE] border-orange-100 text-[#7A6A5C] hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                          isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-orange-200 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? 'text-[#3A2E25]' : 'text-[#7A6A5C]'}`}>
                          {item.task}
                        </p>
                        <p className="text-[10px] text-[#7A6A5C]">{item.department}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-semibold text-[#7A6A5C]">
                      {isDone ? 'Verified ✓' : 'Pending Check'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 5: FLEET & DISPATCH ================= */}
      {kitchenSubTab === 'fleet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Active Fleet</span>
              <div className="text-2xl font-black text-[#3A2E25]">12 Riders</div>
              <p className="text-xs text-emerald-600 font-bold">8 EV · 4 Petrol</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Avg Kitchen Wait</span>
              <div className="text-2xl font-black text-emerald-600">4.2 mins</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Target &lt; 5 mins</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Batched Orders</span>
              <div className="text-2xl font-black text-blue-600">
                {batchedDeliveryDecision === 'wait_together' ? 'Wait Mode (<=8m)' : 'Single Dispatch'}
              </div>
              <p className="text-xs text-[#7A6A5C]">Cluster optimization</p>
            </div>
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Hub Status</span>
              <div className="text-2xl font-black text-orange-600">{isKitchenPaused ? 'Paused' : 'Online'}</div>
              <p className="text-xs text-[#7A6A5C]">Auto-failover enabled</p>
            </div>
          </div>

          {/* Operational Controls: Batched Dispatch Decision & Kitchen Hub Pause */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batched dispatch decision toggle */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-[#3A2E25]">Batched Rider Wait vs Unbatch Rule</h3>
              <p className="text-xs text-[#7A6A5C]">
                When two orders share a delivery corridor: if the second order is ready within 8 mins, the rider waits.
                If prep slips beyond 8m, unbatch immediately to protect food quality.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setBatchedDeliveryDecision('wait_together')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    batchedDeliveryDecision === 'wait_together'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-[#FFF8EE] text-[#7A6A5C] border-orange-200'
                  }`}
                >
                  Wait Together (&le;8m delay)
                </button>
                <button
                  onClick={() => setBatchedDeliveryDecision('unbatch_dispatch')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    batchedDeliveryDecision === 'unbatch_dispatch'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-[#FFF8EE] text-[#7A6A5C] border-orange-200'
                  }`}
                >
                  Unbatch &amp; Dispatch Solo (&gt;8m delay)
                </button>
              </div>
            </div>

            {/* Hub Pause Overflow Protection */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-[#3A2E25]">Hub Overflow Pause &amp; Routing Failover</h3>
              <p className="text-xs text-[#7A6A5C]">
                Pause this kitchen during severe kitchen overflow. New orders will automatically route to the nearest
                Bangalore sister hub.
              </p>
              <button
                onClick={() => toggleKitchenPause(activeKitchen.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs ${
                  isKitchenPaused
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {isKitchenPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                <span>{isKitchenPaused ? `Resume ${activeKitchen.name}` : `Pause ${activeKitchen.name} (Failover)`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: DELAY KITCHEN ORDER ================= */}
      {delayModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Broadcast Kitchen Delay (+10m)</span>
              </h3>
              <button onClick={() => setDelayModalOrderId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Delay Minutes</label>
                <input
                  type="number"
                  value={delayMinutesInput}
                  onChange={(e) => setDelayMinutesInput(Number(e.target.value))}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25] font-bold"
                />
              </div>
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Reason for Customer</label>
                <textarea
                  rows={2}
                  value={delayReasonInput}
                  onChange={(e) => setDelayReasonInput(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-200">
              <button
                onClick={() => setDelayModalOrderId(null)}
                className="px-4 py-2 bg-white border border-orange-200 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  kitchenDelayOrder(delayModalOrderId, delayMinutesInput, delayReasonInput);
                  setDelayModalOrderId(null);
                }}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Send Delay Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CHEF QUERY TO CUSTOMER ================= */}
      {inquiryModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <span>Special Instruction Query to Customer</span>
              </h3>
              <button onClick={() => setInquiryModalOrderId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Chef Inquiry Message</label>
                <textarea
                  rows={2}
                  value={inquiryQuestion}
                  onChange={(e) => setInquiryQuestion(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Suggested Swap Item</label>
                <input
                  type="text"
                  value={inquirySwap}
                  onChange={(e) => setInquirySwap(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-200">
              <button
                onClick={() => setInquiryModalOrderId(null)}
                className="px-4 py-2 bg-white border border-orange-200 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  kitchenSendSpecialInstructionInquiry(inquiryModalOrderId, inquiryQuestion, inquirySwap);
                  setInquiryModalOrderId(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Send to Customer App (3-Min SLA)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: KITCHEN REJECT ORDER ================= */}
      {rejectModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Reject Order (Escalate to Ops Desk)</span>
              </h3>
              <button onClick={() => setRejectModalOrderId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="text-[#3A2E25] font-bold block mb-1">Rejection Reason</label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
              />
              <p className="text-[11px] text-[#7A6A5C]">
                Per SLA rules, rejecting cancels the ticket, auto-refunds the customer, and triggers failover routing.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-200">
              <button
                onClick={() => setRejectModalOrderId(null)}
                className="px-4 py-2 bg-white border border-orange-200 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  kitchenRejectOrder(rejectModalOrderId, rejectReason);
                  setRejectModalOrderId(null);
                }}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
