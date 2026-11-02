import React, { useState } from 'react';
import { useApp, RiderBottomTab } from '../context/AppContext';
import {
  REST_POINTS,
  RIDER_I18N,
} from '../data/mockData';
import {
  ExceptionType,
} from '../types';
import {
  Bike,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Battery,
  Wifi,
  WifiOff,
  Sparkles,
  UserCheck,
  X,
  Activity,
  DollarSign,
  ShieldAlert,
  FileText,
  MapPin,
  Heart,
  Coins,
} from 'lucide-react';

export const RiderView: React.FC = () => {
  const {
    riders,
    activeRiderId,
    setActiveRiderId,
    riderOnline,
    setRiderOnline,
    riderLanguage,
    setRiderLanguage,
    lowNetworkMode,
    setLowNetworkMode,
    isSyncing,
    offlineQueueCount,
    activeDeliveryOrder,
    deliveryStep,
    setDeliveryStep,
    markRiderArrivedKitchen,
    claimWaitingCompensation,
    confirmPickup,
    arrivedCustomerLocation,
    completeCustomerDrop,
    handleRiderException,
    addSupportTicket,
    sosActive,
    triggerSOS,
    resolveSOS,
    shiftSlots,
    toggleShiftBooking,
    riderAutoSaveVal,
    setRiderAutoSaveVal,
    triggerRiderWithdrawal,
    setSystemActivityOpen,
    rules,
    triggerSecurityGateHold,
    reportCustomerConduct,
    reportKitchenConduct,
    slowWeekRolloverActive,
    toggleSlowWeekRollover,
    instantPayoutFallbackBatch,
    toggleInstantPayoutFallback,
    appealInsuranceClaim,
    disputePartnerDeduction,
    partnerDeductionDisputes,
    supportTickets,
  } = useApp();

  // Bottom Navigation: Home | Orders | Earnings | Safety | Profile
  const [activeTab, setActiveTab] = useState<RiderBottomTab>('orders');

  // Orders Sub-tab: Active | History
  const [ordersSubTab, setOrdersSubTab] = useState<'active' | 'history'>('active');

  // Earnings Sub-tabs: Summary | Payouts | Loans & Savings | Insurance
  const [earningsSubTab, setEarningsSubTab] = useState<'summary' | 'payouts' | 'loans_savings' | 'insurance'>('summary');

  // Safety Sub-tabs: Help Chat | Claims | Rest Points | Settings
  const [safetySubTab, setSafetySubTab] = useState<'help_chat' | 'claims' | 'rest_points' | 'settings'>('help_chat');

  // Profile Sub-tabs: Documents | Performance | Training | Rewards
  const [profileSubTab, setProfileSubTab] = useState<'documents' | 'performance' | 'training' | 'rewards'>('documents');

  // Active rider persona
  const activeRider = riders.find((r) => r.id === activeRiderId) || riders[0];

  // Modals & Drawers
  const [shiftPlanModalOpen, setShiftPlanModalOpen] = useState(false);
  const [exceptionsModalOpen, setExceptionsModalOpen] = useState(false);
  const [customerChatOpen, setCustomerChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'rider' | 'customer'; text: string; time: string }>>([
    { sender: 'customer', text: 'Please ring bell twice when you reach the gate.', time: '5m ago' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Drop-off OTP & photo
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLeaveAtDoorPhotoTaken, setIsLeaveAtDoorPhotoTaken] = useState(false);

  // AI Support Chat
  const [supportQuery, setSupportQuery] = useState('');
  const [isAiSupportLoading, setIsAiSupportLoading] = useState(false);
  const [supportSuccessToast, setSupportSuccessToast] = useState<string | null>(null);

  // AI Earnings Explainer
  const [isAiEarningsLoading, setIsAiEarningsLoading] = useState(false);
  const [aiEarningsExplanation, setAiEarningsExplanation] = useState<string | null>(null);

  // Training module quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Internationalization helper
  const t = (key: string): string => {
    return RIDER_I18N[riderLanguage]?.[key] || RIDER_I18N['English']?.[key] || key;
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'rider', text: chatInput.trim(), time: 'Just now' },
    ]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'customer', text: 'Thank you! Waiting at the gate.', time: 'Just now' },
      ]);
    }, 1200);
  };

  const handleAiSupportSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!supportQuery.trim()) return;
    setIsAiSupportLoading(true);
    try {
      const response = await fetch('/api/gemini/rider-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: supportQuery,
          riderName: activeRider.name,
          currentOrder: activeDeliveryOrder?.id,
          language: riderLanguage,
        }),
      });
      const data = await response.json();
      const reply = data.reply || 'Support request received. Bangalore dispatch will assist you.';
      addSupportTicket({
        id: `ticket-${Date.now().toString().slice(-4)}`,
        riderId: activeRider.id,
        riderName: activeRider.name,
        category: 'order_issue',
        query: supportQuery,
        reply,
        status: 'In Progress',
        createdAt: 'Just now',
        priority: 'High',
      });
      setSupportQuery('');
      setSupportSuccessToast(reply);
      setTimeout(() => setSupportSuccessToast(null), 6000);
    } catch {
      setSupportSuccessToast('Help ticket logged. Bangalore operations notified.');
      setTimeout(() => setSupportSuccessToast(null), 4000);
    } finally {
      setIsAiSupportLoading(false);
    }
  };

  const handleExplainEarnings = async () => {
    setIsAiEarningsLoading(true);
    try {
      const response = await fetch('/api/gemini/explain-earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderName: activeRider.name,
          trips: activeRider.tripsToday,
          hours: activeRider.hoursOnline,
          todayEarnings: activeRider.todayEarnings,
          language: riderLanguage,
        }),
      });
      const data = await response.json();
      setAiEarningsExplanation(data.explanation || 'Great job! You achieved peak incentives.');
    } catch {
      setAiEarningsExplanation(
        `Great shift ${activeRider.name}! You earned ₹${activeRider.todayEarnings} across ${activeRider.tripsToday} trips including peak hour incentives.`
      );
    } finally {
      setIsAiEarningsLoading(false);
    }
  };

  const exceptionItems: Array<{ type: ExceptionType; title: string; desc: string }> = [
    { type: 'food_not_ready', title: 'Food Not Ready / Delayed', desc: `Kitchen prep delay > ${rules.kitchenAcceptWindowMin}m` },
    { type: 'missing_items', title: 'Missing Dish / Items', desc: 'Packed items mismatch checklist' },
    { type: 'spilled_food', title: 'Food Spilled in Transit', desc: 'Container breach or seal torn' },
    { type: 'customer_unreachable', title: 'Customer Unreachable', desc: `Wait ${rules.customerAbsentWaitMin}m / locked gate` },
    { type: 'wrong_address', title: 'Wrong Address / Out of Zone', desc: 'Pin code navigation error' },
    { type: 'customer_cancelled', title: 'Customer Cancelled Order', desc: 'Return order to kitchen hub' },
    { type: 'vehicle_breakdown', title: 'Vehicle Breakdown / Puncture', desc: 'Emergency swap dispatch' },
    { type: 'battery_low', title: 'EV Battery Under 15%', desc: 'Route to nearest swap point' },
    { type: 'heavy_rain', title: 'Heavy Monsoon Rain Surge', desc: 'Auto +₹25 rain allowance' },
    { type: 'traffic_delay', title: 'Heavy Bangalore Traffic', desc: `Extend customer ETA +${rules.etaSlipAlertMin}m` },
    { type: 'network_lost', title: 'GPS / Network Signal Lost', desc: 'Save offline delivery OTP' },
    { type: 'abusive_customer', title: 'Unsafe / Abusive Customer', desc: 'Instant SOS & cancellation' },
  ];

  return (
    <div className="pb-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Top Meta Bar: Persona Switcher, Language & Network */}
      <div className="w-full max-w-sm sm:max-w-md mb-4 bg-white border border-orange-100 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs text-xs">
        {/* Rider Persona */}
        <div className="flex items-center space-x-1.5">
          <span className="p-1 bg-orange-100 text-orange-600 rounded">
            <Bike className="w-3.5 h-3.5" />
          </span>
          <select
            value={activeRiderId}
            onChange={(e) => setActiveRiderId(e.target.value)}
            className="bg-orange-50/70 text-[#3A2E25] font-bold rounded-lg px-2 py-1 border border-orange-200 cursor-pointer focus:outline-none text-xs"
          >
            {riders.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.vehicleType} · {r.pinCodeBase.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Controls: Language & Low Network */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <select
            value={riderLanguage}
            onChange={(e: any) => setRiderLanguage(e.target.value)}
            className="bg-orange-50/70 text-[#3A2E25] text-[11px] font-semibold rounded-lg px-2 py-1 border border-orange-200"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
          </select>

          {/* Low Network Toggle */}
          <button
            onClick={() => setLowNetworkMode(!lowNetworkMode)}
            title="Toggle simulated poor mobile network"
            className={`p-1.5 rounded-lg border transition ${
              lowNetworkMode
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-stone-100 text-[#7A6A5C] border-stone-200 hover:text-[#3A2E25]'
            }`}
          >
            {lowNetworkMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          </button>

          {/* Live Activity Button */}
          <button
            onClick={() => setSystemActivityOpen(true)}
            title="View cross-system live integration events"
            className="p-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition"
          >
            <Activity className="w-3.5 h-3.5 text-orange-600" />
          </button>
        </div>
      </div>

      {/* Syncing / Low Network Banner */}
      {lowNetworkMode && (
        <div className="w-full max-w-sm sm:max-w-md mb-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Low-network: {offlineQueueCount} action(s) queued offline</span>
          </div>
          {isSyncing && <span className="animate-spin text-xs">⟳</span>}
        </div>
      )}

      {/* Centered Mobile Phone Shell (~390px) */}
      <div className="relative w-full max-w-[390px] bg-[#FFF8EE] border-[6px] border-[#3A2E25] rounded-[44px] shadow-2xl flex flex-col min-h-[680px] max-h-[820px] overflow-hidden">
        {/* Phone Notch & Status Bar */}
        <div className="bg-[#F5ECE0] px-6 pt-3 pb-2 flex items-center justify-between border-b border-orange-200/60 text-[11px] text-[#3A2E25] font-mono select-none">
          <span className="font-bold">12:45</span>
          <div className="w-20 h-4 bg-[#3A2E25] rounded-full" />
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold">{activeRider.batteryPct}%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* Global Floating SOS during Active Order */}
        {activeDeliveryOrder && (
          <button
            onClick={() => triggerSOS()}
            className="absolute top-12 right-4 z-40 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-rose-600/30 animate-pulse flex items-center space-x-1 border border-rose-300"
          >
            <span>SOS</span>
          </button>
        )}

        {/* Phone Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF8EE]">
          {/* ================= BOTTOM TAB: HOME ================= */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Online / Offline Toggle Card */}
              <div className="p-4 bg-white border border-orange-100 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#3A2E25] font-heading">
                    {riderOnline ? 'You Are Online' : 'You Are Offline'}
                  </h3>
                  <p className="text-[11px] text-[#7A6A5C] mt-0.5">
                    {riderOnline ? 'Ready for auto-dispatches' : 'Turn online to receive orders'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (activeDeliveryOrder) {
                      alert('Cannot go offline during an active delivery order!');
                      return;
                    }
                    setRiderOnline(!riderOnline);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                    riderOnline
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-stone-200 hover:bg-stone-300 text-[#3A2E25]'
                  }`}
                >
                  {riderOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>

              {/* Today's Earnings Summary */}
              <div className="p-5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-medium text-orange-100">Today's Earnings</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black font-heading">₹{activeRider.todayEarnings}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {activeRider.tripsToday} Trips
                  </span>
                </div>
                <p className="text-[11px] text-orange-100 font-medium">
                  {activeRider.hoursOnline}h online today · Avg ₹{Math.round(activeRider.todayEarnings / (activeRider.hoursOnline || 1))}/hr
                </p>
              </div>

              {/* Incentive Milestone Progress */}
              <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-2 shadow-xs">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#3A2E25]">Daily Milestone Incentive</span>
                  <span className="text-orange-600 font-bold">₹150 Bonus</span>
                </div>
                <div className="w-full h-2.5 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[11px] text-[#7A6A5C]">
                  Complete 2 more orders before 3 PM to claim ₹150 peak bonus!
                </p>
              </div>

              {/* Next Shift Card & Shift Planner Button */}
              <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-3 shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#3A2E25]">Next Booked Shift</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Confirmed
                  </span>
                </div>
                <p className="text-xs text-[#3A2E25] font-medium">
                  Dinner Peak (7:00 PM – 11:30 PM) · Koramangala Hub (+₹25/order incentive)
                </p>
                <button
                  onClick={() => setShiftPlanModalOpen(true)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] text-xs font-bold rounded-xl transition"
                >
                  Plan Shifts & View Demand Forecast →
                </button>
              </div>
            </div>
          )}

          {/* ================= BOTTOM TAB: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Sub-Tabs: Active | History */}
              <div className="flex p-1 bg-white border border-orange-200 rounded-xl shadow-xs">
                <button
                  onClick={() => setOrdersSubTab('active')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    ordersSubTab === 'active' ? 'bg-orange-500 text-white shadow-xs' : 'text-[#7A6A5C] hover:text-[#3A2E25]'
                  }`}
                >
                  Active Order
                </button>
                <button
                  onClick={() => setOrdersSubTab('history')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    ordersSubTab === 'history' ? 'bg-orange-500 text-white shadow-xs' : 'text-[#7A6A5C] hover:text-[#3A2E25]'
                  }`}
                >
                  History
                </button>
              </div>

              {/* Active Tab: Single Focused Full-Screen Step Card */}
              {ordersSubTab === 'active' && (
                <div className="space-y-4">
                  {/* Stepper Dots */}
                  <div className="flex items-center justify-between px-2 text-[10px] text-[#7A6A5C] font-mono">
                    <span className={deliveryStep === 'navigating_to_kitchen' ? 'text-orange-600 font-bold' : ''}>1. Reach</span>
                    <span>→</span>
                    <span className={deliveryStep === 'at_kitchen_waiting' ? 'text-orange-600 font-bold' : ''}>2. Arrived</span>
                    <span>→</span>
                    <span className={deliveryStep === 'pickup_checklist' ? 'text-orange-600 font-bold' : ''}>3. Pickup</span>
                    <span>→</span>
                    <span className={deliveryStep === 'navigating_to_customer' ? 'text-orange-600 font-bold' : ''}>4. Ride</span>
                    <span>→</span>
                    <span className={deliveryStep === 'arrived_at_customer' ? 'text-orange-600 font-bold' : ''}>5. Drop</span>
                  </div>

                  {/* STEP 1: Navigate to Kitchen */}
                  {deliveryStep === 'navigating_to_kitchen' && (
                    <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-4 shadow-xs food-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Step 1 of 5</span>
                          <h3 className="text-base font-bold text-[#3A2E25] font-heading mt-0.5">Go to Kitchen Hub</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ETA 6 mins
                        </span>
                      </div>

                      <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 space-y-1 text-xs">
                        <p className="font-bold text-[#3A2E25]">Koramangala Master Kitchen</p>
                        <p className="text-[#7A6A5C] text-[11px]">80ft Road, 4th Block, Koramangala (1.2 km away)</p>
                        <p className="text-orange-600 font-semibold text-[11px] pt-1">Brand: Thali Theory</p>
                      </div>

                      <button
                        onClick={markRiderArrivedKitchen}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition shadow-xs"
                      >
                        I Have Arrived at Kitchen →
                      </button>
                    </div>
                  )}

                  {/* STEP 2: At Kitchen Waiting */}
                  {deliveryStep === 'at_kitchen_waiting' && (
                    <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-4 shadow-xs food-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Step 2 of 5</span>
                          <h3 className="text-base font-bold text-[#3A2E25] font-heading mt-0.5">Waiting for Food Prep</h3>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                          Wait Timer: 10m 14s
                        </span>
                      </div>

                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                        <p className="font-bold text-amber-800">Wait Compensation Triggered!</p>
                        <p className="text-[#7A6A5C] text-[11px]">
                          Prep exceeded {rules.kitchenAcceptWindowMin} mins. You earn ₹35 automatic waiting bonus.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={claimWaitingCompensation}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition shadow-xs"
                        >
                          Claim ₹35 Wait Allowance
                        </button>
                        <button
                          onClick={() => setDeliveryStep('pickup_checklist')}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                        >
                          Food Ready: Proceed to Checklist →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Pickup Checklist */}
                  {deliveryStep === 'pickup_checklist' && (
                    <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-4 shadow-xs food-card">
                      <div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Step 3 of 5</span>
                        <h3 className="text-base font-bold text-[#3A2E25] font-heading mt-0.5">Pickup Verification Checklist</h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center space-x-2 text-[#3A2E25]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Order ID #GF-9481 confirmed</span>
                        </div>
                        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center space-x-2 text-[#3A2E25]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>2x Items checked & verified</span>
                        </div>
                        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center space-x-2 text-[#3A2E25]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Tamper-evident seal intact</span>
                        </div>
                      </div>

                      <button
                        onClick={confirmPickup}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                      >
                        Confirm Picked Up & Start Navigation →
                      </button>
                    </div>
                  )}

                  {/* STEP 4: Navigate to Customer */}
                  {deliveryStep === 'navigating_to_customer' && (
                    <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-4 shadow-xs food-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Step 4 of 5</span>
                          <h3 className="text-base font-bold text-[#3A2E25] font-heading mt-0.5">Deliver to Customer</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ETA 12 mins
                        </span>
                      </div>

                      <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 space-y-1 text-xs">
                        <p className="font-bold text-[#3A2E25]">{activeDeliveryOrder?.customerName || 'Aditya Swaminathan'}</p>
                        <p className="text-[#7A6A5C] text-[11px]">{activeDeliveryOrder?.area || 'Flat 302, Green Glen Layout, Koramangala'}</p>
                        <p className="text-emerald-700 font-semibold text-[11px] pt-1">Prepaid UPI Order · No Cash</p>
                      </div>

                      {/* Live Mid-Transit Address Change Banner */}
                      {activeDeliveryOrder?.addressChangedMidDelivery && (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 text-xs text-emerald-950">
                          <div className="flex items-center space-x-1 font-bold text-emerald-800">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Destination Rerouted (+₹{activeDeliveryOrder.addressChangedMidDelivery.extraFee} Bonus)</span>
                          </div>
                          <p className="text-[11px]">
                            New drop: <strong>{activeDeliveryOrder.addressChangedMidDelivery.newAddress}</strong> ({activeDeliveryOrder.addressChangedMidDelivery.distanceKm} km). Incentive credited.
                          </p>
                        </div>
                      )}

                      {/* Live Customer Mid-Transit Instruction */}
                      {activeDeliveryOrder?.midDeliveryInstruction && (
                        <div className="p-3 bg-orange-100/70 border border-orange-300 rounded-xl text-xs space-y-0.5 text-orange-950">
                          <span className="font-extrabold uppercase text-[10px] text-orange-700 tracking-wider">Customer Special Note:</span>
                          <p className="font-bold">&quot;{activeDeliveryOrder.midDeliveryInstruction}&quot;</p>
                        </div>
                      )}

                      {/* Security Gate Hold Countdown if Triggered */}
                      {activeDeliveryOrder?.securityGateHold?.active && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1 text-amber-950">
                          <div className="flex items-center justify-between font-bold text-amber-900">
                            <span>Meet at Gate Timer Active:</span>
                            <span className="font-mono text-sm">{rules.customerAbsentWaitMin}m Wait</span>
                          </div>
                          <p className="text-[11px] text-[#7A6A5C]">
                            Customer alerted to collect parcel at society main barrier. Safe drop permitted after countdown.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert('Dialing masked proxy number (+91 80 4719 0000). Customer private number is hidden.')}
                          className="py-2.5 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Masked</span>
                        </button>
                        <button
                          onClick={() => setCustomerChatOpen(true)}
                          className="py-2.5 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>In-App Chat</span>
                        </button>
                      </div>

                      {/* Live Special Actions Bar */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => activeDeliveryOrder && triggerSecurityGateHold(activeDeliveryOrder.id)}
                          className="py-2 px-2 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded-xl text-[11px] hover:bg-amber-100"
                        >
                          Meet at Gate (Entry Denied)
                        </button>
                        <button
                          onClick={() => activeDeliveryOrder && reportCustomerConduct(activeDeliveryOrder.id, activeRider.id, 'Abusive security or unsafe drop')}
                          className="py-2 px-2 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl text-[11px] hover:bg-rose-100"
                        >
                          Report Unsafe Zone
                        </button>
                      </div>

                      <button
                        onClick={arrivedCustomerLocation}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition shadow-xs"
                      >
                        I Have Reached Customer Gate →
                      </button>
                    </div>
                  )}

                  {/* STEP 5: Drop & OTP */}
                  {deliveryStep === 'arrived_at_customer' && (
                    <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-4 shadow-xs food-card">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Step 5 of 5</span>
                        <h3 className="text-base font-bold text-[#3A2E25] font-heading mt-0.5">Verify Customer Handover</h3>
                      </div>

                      {/* Tip celebration banner */}
                      {activeDeliveryOrder?.riderTipAmount && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                            <span><strong>₹{activeDeliveryOrder.riderTipAmount} Customer Tip!</strong> 100% added to your wallet.</span>
                          </div>
                          <span className="font-extrabold text-amber-700">Transferred ✓</span>
                        </div>
                      )}

                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[#3A2E25] font-bold">Enter Customer Delivery OTP</label>
                            {activeDeliveryOrder?.alternateDropCode && (
                              <button
                                onClick={() => setEnteredOtp(activeDeliveryOrder.alternateDropCode || '')}
                                className="text-[10px] text-orange-600 font-bold hover:underline"
                              >
                                Use In-App Code ({activeDeliveryOrder.alternateDropCode})
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            maxLength={4}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="Enter 4-digit OTP (Try 9481)"
                            className="w-full bg-orange-50/60 border border-orange-200 rounded-xl p-2.5 text-center font-mono text-base tracking-widest text-[#3A2E25] focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-orange-50/40 rounded-xl border border-orange-100">
                          <span className="text-[#7A6A5C] text-[11px]">Leave at door option:</span>
                          <button
                            type="button"
                            onClick={() => setIsLeaveAtDoorPhotoTaken(!isLeaveAtDoorPhotoTaken)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              isLeaveAtDoorPhotoTaken ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-[#3A2E25]'
                            }`}
                          >
                            {isLeaveAtDoorPhotoTaken ? 'Photo Uploaded' : 'Capture Photo'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          completeCustomerDrop(enteredOtp || activeDeliveryOrder?.alternateDropCode || '9481');
                          setEnteredOtp('');
                        }}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                      >
                        Complete Order & Credit Earnings →
                      </button>
                    </div>
                  )}

                  {/* Single Clean "Report an Issue" Button for 12 Exceptions */}
                  <button
                    onClick={() => setExceptionsModalOpen(true)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Report an Issue (12 Exceptions)</span>
                  </button>
                </div>
              )}

              {/* History Tab */}
              {ordersSubTab === 'history' && (
                <div className="space-y-3">
                  {[
                    { id: 'GF-9480', brand: 'Midnight Maska', pay: 85, time: '11:15 AM', area: 'Koramangala 5th Block' },
                    { id: 'GF-9478', brand: 'Bowl Republic', pay: 70, time: '10:20 AM', area: 'HSR Sector 2' },
                    { id: 'GF-9472', brand: 'Thali Theory', pay: 92, time: '9:40 AM', area: 'Indiranagar 100ft Rd' },
                  ].map((trip) => (
                    <div key={trip.id} className="p-3.5 bg-white border border-orange-100 rounded-xl flex justify-between items-center text-xs shadow-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#3A2E25]">{trip.id}</span>
                          <span className="text-[#7A6A5C]">· {trip.brand}</span>
                        </div>
                        <p className="text-[#7A6A5C] text-[11px] mt-0.5">{trip.area} ({trip.time})</p>
                      </div>
                      <span className="font-black text-emerald-700 text-sm">₹{trip.pay}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= BOTTOM TAB: EARNINGS ================= */}
          {activeTab === 'earnings' && (
            <div className="space-y-4">
              {/* Earnings Sub-Tabs */}
              <div className="flex p-1 bg-white border border-orange-200 rounded-xl overflow-x-auto no-scrollbar shadow-xs">
                {(['summary', 'payouts', 'loans_savings', 'insurance'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEarningsSubTab(tab)}
                    className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                      earningsSubTab === tab ? 'bg-orange-500 text-white shadow-xs' : 'text-[#7A6A5C] hover:text-[#3A2E25]'
                    }`}
                  >
                    {tab === 'loans_savings' ? 'Loans' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Earnings Summary */}
              {earningsSubTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-2 text-center shadow-xs">
                    <span className="text-xs font-medium text-[#7A6A5C]">Weekly Earnings</span>
                    <div className="text-3xl font-black text-[#3A2E25] font-heading">
                      ₹{activeRider.todayEarnings * 6}
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold">84 Trips Completed this week</p>
                  </div>

                  <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-2 text-xs shadow-xs">
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5C]">Base Delivery Pay</span>
                      <span className="text-[#3A2E25] font-bold">₹4,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5C]">Distance & Heavy Surge</span>
                      <span className="text-[#3A2E25] font-bold">₹840</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5C]">Peak Hour Incentives</span>
                      <span className="text-emerald-700 font-bold">+₹600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5C]">Customer Tips</span>
                      <span className="text-amber-700 font-bold">+₹380</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExplainEarnings}
                    disabled={isAiEarningsLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiEarningsLoading ? 'Analyzing...' : 'Explain My Earnings (AI)'}</span>
                  </button>

                  {aiEarningsExplanation && (
                    <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100 text-xs text-[#3A2E25] leading-relaxed font-sans">
                      {aiEarningsExplanation}
                    </div>
                  )}

                  {/* Slow Week 20% EMI Protection Banner */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-xs text-emerald-950">
                    <div className="flex justify-between items-center font-bold text-emerald-900">
                      <span>Slow Week Revenue Shield</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 uppercase font-black">
                        {rules.slowWeekEmiCapPct || 20}% Cap Active
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6A5C]">
                      During low-demand weeks, weekly loan EMI deduction is strictly capped at {rules.slowWeekEmiCapPct || 20}% of earnings. Balance rolls over penalty-free to preserve your home take-home income.
                    </p>
                  </div>

                  {/* Partner Deduction Dispute Button */}
                  <button
                    onClick={() => disputePartnerDeduction(activeRider.id, 'Packaging Defect Penalty', 75, 'Thermal tape inspection photo submitted')}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>Dispute Unjustified Fine / Deduction (1-Tap)</span>
                  </button>
                </div>
              )}

              {/* Payouts / EWA */}
              {earningsSubTab === 'payouts' && (
                <div className="space-y-4">
                  <div className="p-5 bg-white border border-orange-100 rounded-2xl space-y-3 shadow-xs">
                    <span className="text-xs font-medium text-[#7A6A5C]">Instant Withdrawable Balance (EWA)</span>
                    <div className="text-2xl font-black text-[#3A2E25] font-heading">₹{activeRider.accruedBalance}</div>
                    <p className="text-[11px] text-[#7A6A5C]">
                      Bank: HDFC Bank (UPI ID: {activeRider.name.toLowerCase().replace(' ', '')}@okhdfcbank)
                    </p>
                    <button
                      onClick={triggerRiderWithdrawal}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      Instant Cashout via UPI (Free)
                    </button>
                  </div>

                  {/* Instant Payout IMPS Maintenance Fallback */}
                  <div className="p-3.5 bg-[#FFF8EE] border border-orange-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#3A2E25]">Instant Transfer Status:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${instantPayoutFallbackBatch ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {instantPayoutFallbackBatch ? 'IMPS Down → 8 AM NEFT Batch' : 'Live IMPS Available'}
                      </span>
                    </div>
                    <p className="text-[#7A6A5C] text-[11px]">
                      If IMPS banking rail undergoes scheduled NPCI maintenance, cashouts automatically queue into the RBI 8:00 AM NEFT settlement cycle without penalty.
                    </p>
                    <button
                      onClick={toggleInstantPayoutFallback}
                      className="text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      {instantPayoutFallbackBatch ? 'Restore Live IMPS Mode' : 'Simulate Bank Rail Maintenance'}
                    </button>
                  </div>
                </div>
              )}

              {/* Loans & Savings */}
              {earningsSubTab === 'loans_savings' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-2 text-xs shadow-xs">
                    <span className="font-bold text-[#3A2E25] block">7.2% RD Auto-Save</span>
                    <p className="text-[#7A6A5C]">
                      Accumulated Savings: <strong className="text-orange-600">₹{activeRider.accumulatedSavings}</strong>
                    </p>
                    <div className="flex justify-between pt-1">
                      <span className="text-[#7A6A5C]">Save per trip:</span>
                      <span className="font-bold text-amber-600">₹{riderAutoSaveVal}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="5"
                      value={riderAutoSaveVal}
                      onChange={(e) => setRiderAutoSaveVal(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-2 text-xs shadow-xs">
                    <span className="font-bold text-[#3A2E25] block">EV Bike Financing Offer</span>
                    <p className="text-[#7A6A5C]">Pre-approved by Partner Bank: ₹95,000 at 8.9% p.a.</p>
                    <button
                      onClick={() => alert('EV Loan application initiated with Partner Bank.')}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-xs"
                    >
                      Apply for Ather 450X
                    </button>
                  </div>
                </div>
              )}

              {/* Insurance */}
              {earningsSubTab === 'insurance' && (
                <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-2 text-xs shadow-xs">
                  <span className="font-bold text-[#3A2E25] block">Rider Welfare Cover</span>
                  <p className="text-[#7A6A5C]">₹5,00,000 cashless accident insurance active across 180 Bangalore network hospitals.</p>
                  <p className="text-emerald-700 font-bold pt-1">Policy Status: Active & Fully Paid</p>
                </div>
              )}
            </div>
          )}

          {/* ================= BOTTOM TAB: SAFETY ================= */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              {/* Prominent SOS Button at Top */}
              <button
                onClick={() => {
                  if (sosActive) {
                    resolveSOS();
                  } else {
                    triggerSOS();
                  }
                }}
                className={`w-full py-4 rounded-2xl text-white font-black text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition ${
                  sosActive
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-500 animate-pulse shadow-rose-600/30'
                }`}
              >
                <AlertTriangle className="w-5 h-5 fill-current" />
                <span>{sosActive ? 'RESOLVE SOS ALERT' : 'EMERGENCY SOS BROADCAST'}</span>
              </button>

              {/* Safety Sub-Tabs */}
              <div className="flex p-1 bg-white border border-orange-200 rounded-xl overflow-x-auto no-scrollbar shadow-xs">
                {(['help_chat', 'claims', 'rest_points', 'settings'] as const).map((tab) => {
                  const labels: Record<string, string> = {
                    help_chat: 'AI Help',
                    claims: 'Claims',
                    rest_points: 'Rest / EV',
                    settings: 'Safety Settings',
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setSafetySubTab(tab)}
                      className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                        safetySubTab === tab ? 'bg-orange-500 text-white shadow-xs' : 'text-[#7A6A5C] hover:text-[#3A2E25]'
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              {/* AI Help Chat */}
              {safetySubTab === 'help_chat' && (
                <div className="space-y-3">
                  <form onSubmit={handleAiSupportSubmit} className="space-y-2">
                    <textarea
                      rows={2}
                      value={supportQuery}
                      onChange={(e) => setSupportQuery(e.target.value)}
                      placeholder="Ask fleet support in English, Hindi, or Kannada..."
                      className="w-full bg-orange-50/50 border border-orange-200 rounded-xl p-2.5 text-xs text-[#3A2E25] placeholder-[#7A6A5C] focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={isAiSupportLoading}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAiSupportLoading ? 'Connecting...' : 'Send to AI Fleet Help'}</span>
                    </button>
                  </form>

                  {supportSuccessToast && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed font-sans">
                      {supportSuccessToast}
                    </div>
                  )}
                </div>
              )}

              {/* Rest Points */}
              {safetySubTab === 'rest_points' && (
                <div className="space-y-2">
                  {REST_POINTS.map((rp) => (
                    <div key={rp.id} className="p-3 bg-white border border-orange-100 rounded-xl space-y-1 text-xs shadow-xs">
                      <div className="flex justify-between font-bold text-[#3A2E25]">
                        <span>{rp.name}</span>
                        <span className="text-emerald-700">{rp.distanceKm} km</span>
                      </div>
                      <p className="text-[#7A6A5C] text-[11px]">{rp.address}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rp.amenities.map((a, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Claims */}
              {safetySubTab === 'claims' && (
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-3 text-xs shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#3A2E25]">Cashless OPD Claim #CLM-8921</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Initial Rejection
                      </span>
                    </div>
                    <p className="text-[#7A6A5C]">
                      Accident claim of ₹14,500 (Apollo Clinic HSR) requires hospital discharge slip and GPS crash telematics verification.
                    </p>
                    <button
                      onClick={() => appealInsuranceClaim('t-1', 'Telematics crash breadcrumbs and OPD invoices attached')}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>1-Tap Documented Appeal (GPS Telematics)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Safety Settings */}
              {safetySubTab === 'settings' && (
                <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-3 text-xs shadow-xs">
                  <span className="font-bold text-[#3A2E25] block">Women Rider & Night Shift Protection</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6A5C]">Exclude 11 PM – 5 AM shifts:</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6A5C]">Priority SOS police dispatch:</span>
                    <span className="text-emerald-700 font-bold">Active</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= BOTTOM TAB: PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Sub-Tabs */}
              <div className="flex p-1 bg-white border border-orange-200 rounded-xl overflow-x-auto no-scrollbar shadow-xs">
                {(['documents', 'performance', 'training', 'rewards'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setProfileSubTab(tab)}
                    className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                      profileSubTab === tab ? 'bg-orange-500 text-white shadow-xs' : 'text-[#7A6A5C] hover:text-[#3A2E25]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Documents */}
              {profileSubTab === 'documents' && (
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Driving Licence', status: 'Verified', note: 'Valid till 2028' },
                    { name: 'Vehicle RC', status: 'Verified', note: activeRider.vehicleModel },
                    { name: 'Aadhaar / KYC', status: 'Verified', note: 'Partner Bank verified' },
                    { name: 'Commercial Transit Insurance', status: 'Active', note: 'Covered' },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 bg-white border border-orange-100 rounded-xl flex justify-between items-center shadow-xs">
                      <div>
                        <p className="font-bold text-[#3A2E25]">{doc.name}</p>
                        <p className="text-[#7A6A5C] text-[11px]">{doc.note}</p>
                      </div>
                      <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Performance */}
              {profileSubTab === 'performance' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-orange-100 rounded-xl space-y-1 shadow-xs">
                    <span className="text-[#7A6A5C] text-[11px]">Rating</span>
                    <p className="text-lg font-black text-[#3A2E25]">{activeRider.rating} ★</p>
                  </div>
                  <div className="p-3 bg-white border border-orange-100 rounded-xl space-y-1 shadow-xs">
                    <span className="text-[#7A6A5C] text-[11px]">On-Time SLA</span>
                    <p className="text-lg font-black text-emerald-700">{activeRider.onTimePct}%</p>
                  </div>
                  <div className="p-3 bg-white border border-orange-100 rounded-xl space-y-1 shadow-xs">
                    <span className="text-[#7A6A5C] text-[11px]">Acceptance Rate</span>
                    <p className="text-lg font-black text-[#3A2E25]">{activeRider.acceptanceRate}%</p>
                  </div>
                  <div className="p-3 bg-white border border-orange-100 rounded-xl space-y-1 shadow-xs">
                    <span className="text-[#7A6A5C] text-[11px]">Tier Badge</span>
                    <p className="text-lg font-black text-amber-700">{activeRider.tier}</p>
                  </div>
                </div>
              )}

              {/* Training Quiz */}
              {profileSubTab === 'training' && (
                <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-3 text-xs shadow-xs">
                  <span className="font-bold text-[#3A2E25] block">Mandatory Hygiene & Sealed-Bag Quiz</span>
                  <div className="space-y-2">
                    <p className="text-[#3A2E25]">1. How must hot filter coffee flasks be carried?</p>
                    <div className="space-y-1">
                      {['Upright in insulated thermal section', 'Laid sideways on bag bottom'].map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => setQuizAnswers({ ...quizAnswers, q1: i })}
                          className={`p-2 rounded-lg cursor-pointer transition font-medium ${
                            quizAnswers['q1'] === i ? 'bg-orange-500 text-white' : 'bg-orange-50/60 text-[#7A6A5C]'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      alert('Quiz passed! 100% Hygiene Compliance certified.');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
                  >
                    {quizSubmitted ? 'Certified Passed' : 'Submit Answers'}
                  </button>
                </div>
              )}

              {/* Rewards */}
              {profileSubTab === 'rewards' && (
                <div className="p-4 bg-white border border-orange-100 rounded-2xl space-y-3 text-xs shadow-xs">
                  <span className="font-bold text-[#3A2E25] block">Weekly Zone Leaderboard</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#7A6A5C] font-semibold">
                      <span>1. Priya Nair (Indiranagar)</span>
                      <span className="text-amber-700 font-bold">92 Trips</span>
                    </div>
                    <div className="flex justify-between text-[#3A2E25] font-bold bg-orange-50 p-2 rounded-lg border border-orange-200">
                      <span>2. {activeRider.name} (You)</span>
                      <span className="text-orange-600">{activeRider.tripsToday * 6} Trips</span>
                    </div>
                    <div className="flex justify-between text-[#7A6A5C]">
                      <span>3. Sunil Gowda (HSR)</span>
                      <span>74 Trips</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation: 5 Large Tap Targets */}
        <div className="bg-white/95 backdrop-blur-xs border-t border-orange-100 px-2 py-2 flex items-center justify-around text-[10px] text-[#7A6A5C] shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeTab === 'home' ? 'text-orange-600 font-black' : 'hover:text-[#3A2E25]'
            }`}
          >
            <Clock className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeTab === 'orders' ? 'text-orange-600 font-black' : 'hover:text-[#3A2E25]'
            }`}
          >
            <Bike className="w-4 h-4 mb-0.5" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeTab === 'earnings' ? 'text-orange-600 font-black' : 'hover:text-[#3A2E25]'
            }`}
          >
            <DollarSign className="w-4 h-4 mb-0.5" />
            <span>Earnings</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeTab === 'safety' ? 'text-orange-600 font-black' : 'hover:text-[#3A2E25]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Safety</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeTab === 'profile' ? 'text-orange-600 font-black' : 'hover:text-[#3A2E25]'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-0.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* 12 Exceptions Drawer / Modal */}
      {exceptionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-orange-200 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <h3 className="text-sm font-bold text-[#3A2E25] font-heading flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Report Delivery Issue</span>
              </h3>
              <button
                onClick={() => setExceptionsModalOpen(false)}
                className="text-[#7A6A5C] hover:text-[#3A2E25] p-1 rounded-lg hover:bg-orange-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {exceptionItems.map((ex) => (
                <button
                  key={ex.type}
                  onClick={() => {
                    handleRiderException(ex.type, ex.title);
                    setExceptionsModalOpen(false);
                    alert(`Exception logged: ${ex.title}. Central fleet operations updated.`);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-orange-50/50 border border-orange-100 hover:border-orange-300 transition space-y-0.5"
                >
                  <p className="font-bold text-[#3A2E25]">{ex.title}</p>
                  <p className="text-[11px] text-[#7A6A5C]">{ex.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shift Plan & Demand Forecast Modal */}
      {shiftPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-orange-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <h3 className="text-sm font-bold text-[#3A2E25] font-heading">
                Bangalore Shift Booking & Forecast
              </h3>
              <button
                onClick={() => setShiftPlanModalOpen(false)}
                className="text-[#7A6A5C] hover:text-[#3A2E25] p-1 rounded-lg hover:bg-orange-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {shiftSlots.map((slot) => (
                <div key={slot.id} className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#3A2E25]">{slot.day} · {slot.timeRange}</p>
                    <p className="text-[#7A6A5C] text-[11px]">{slot.zone} · {slot.incentiveBonus}</p>
                  </div>
                  <button
                    onClick={() => toggleShiftBooking(slot.id)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                      slot.booked ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-[#3A2E25]'
                    }`}
                  >
                    {slot.booked ? 'Booked' : 'Book Slot'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShiftPlanModalOpen(false)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* In-App Customer Chat Modal */}
      {customerChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-orange-200 rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-2xl flex flex-col h-[460px]">
            <div className="flex items-center justify-between border-b border-orange-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-[#3A2E25] font-heading">Masked Chat with Customer</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Numbers masked by Growth Falcon</p>
              </div>
              <button
                onClick={() => setCustomerChatOpen(false)}
                className="text-[#7A6A5C] hover:text-[#3A2E25] p-1 rounded-lg hover:bg-orange-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    msg.sender === 'rider'
                      ? 'ml-auto bg-orange-500 text-white shadow-xs'
                      : 'mr-auto bg-orange-50 border border-orange-100 text-[#3A2E25]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-80 block text-right mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex space-x-2 pt-2 border-t border-orange-100">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-orange-50/50 border border-orange-200 rounded-lg px-2.5 py-1.5 text-xs text-[#3A2E25] focus:outline-none focus:border-orange-500"
              />
              <button type="submit" className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
