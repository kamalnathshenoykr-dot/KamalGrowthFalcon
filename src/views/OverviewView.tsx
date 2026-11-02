import React, { useState } from 'react';
import { useApp, OverviewSubTab } from '../context/AppContext';
import { HOURLY_ORDER_LOAD } from '../data/mockData';
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Users,
  Coins,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ChefHat,
  Bike,
  Database,
  Megaphone,
  Landmark,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
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
  Legend,
  CartesianGrid,
} from 'recharts';

export const OverviewView: React.FC = () => {
  const {
    overviewSubTab,
    setOverviewSubTab,
    setCurrentView,
    demoMode,
    setDemoMode,
    orders,
  } = useApp();

  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState<boolean>(false);

  // Key metrics
  const totalOrdersCount = orders.length + 1284;
  const avgOrderValue = Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / (orders.length || 1));
  const directOrders = orders.filter((o) => o.channel === 'Direct App' || o.channel === 'WhatsApp').length;
  const directSharePct = Math.round((directOrders / (orders.length || 1)) * 100);

  // Unit economics stacked bar data
  const unitEconomicsData = [
    {
      channel: 'Direct App',
      foodCost: 118,
      packaging: 25,
      delivery: 55,
      commission: 0,
      marketing: 21,
      margin: 193,
    },
    {
      channel: 'Aggregator (22% take)',
      foodCost: 118,
      packaging: 25,
      delivery: 59,
      commission: 92,
      marketing: 50,
      margin: 76,
    },
  ];

  const flywheelStages = [
    {
      id: 'customer',
      title: '1. Order Capture',
      desc: 'Direct App, ONDC & Aggregator demand routed to nearest Bangalore kitchen hub',
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" />,
      color: 'border-orange-200 bg-orange-50/60 text-orange-900',
      view: 'customer' as const,
    },
    {
      id: 'kitchen',
      title: '2. Kitchen Ops',
      desc: 'Shared cloud capacity prepares 3 brands with packaging SLA and real-time timers',
      icon: <ChefHat className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
      view: 'kitchen' as const,
    },
    {
      id: 'delivery',
      title: '3. EV Delivery',
      desc: '12 dedicated riders delivering under 27 mins across Koramangala, Indiranagar, HSR & Whitefield',
      icon: <Bike className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
      view: 'rider' as const,
    },
    {
      id: 'data',
      title: '4. Granular Data',
      desc: 'Pin code demand, SKU margins, travel scores, customer reorder intervals',
      icon: <Database className="w-5 h-5 text-teal-600" />,
      color: 'border-teal-200 bg-teal-50/60 text-teal-900',
      view: 'marketing' as const,
    },
    {
      id: 'marketing',
      title: '5. AI Marketing',
      desc: 'Gemini WhatsApp campaigns re-engage lapsed diners at peak conversion windows',
      icon: <Megaphone className="w-5 h-5 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/60 text-rose-900',
      view: 'marketing' as const,
    },
    {
      id: 'bank',
      title: '6. Embedded Bank',
      desc: 'Partner Bank underwrites working capital, EWA & micro-insurance using verified cash flow',
      icon: <Landmark className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/60 text-purple-900',
      view: 'finance' as const,
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Page Header with One-line Pitch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">
            Growth Falcon Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A5C] mt-1">
            Bangalore cloud kitchens generate data → data drives AI marketing → Partner Bank finances the ecosystem.
          </p>
        </div>

        {/* Pill-Style Segmented Sub-Tabs */}
        <div className="inline-flex items-center p-1 bg-white border border-orange-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setOverviewSubTab('summary')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              overviewSubTab === 'summary'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setOverviewSubTab('unit_economics')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              overviewSubTab === 'unit_economics'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Unit Economics
          </button>
          <button
            onClick={() => setOverviewSubTab('how_it_works')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              overviewSubTab === 'how_it_works'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            How It Works
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SUMMARY ================= */}
      {overviewSubTab === 'summary' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Orders Today</span>
              <div className="text-2xl font-black text-[#3A2E25]">{totalOrdersCount}</div>
              <p className="text-xs text-emerald-600 flex items-center font-bold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +24% vs yesterday
              </p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Avg Order Value</span>
              <div className="text-2xl font-black text-[#3A2E25]">₹{avgOrderValue}</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Bangalore cloud avg</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Customer Rating</span>
              <div className="text-2xl font-black text-[#3A2E25] flex items-center">
                4.72 <Star className="w-4 h-4 text-amber-500 fill-amber-400 ml-1.5" />
              </div>
              <p className="text-xs text-[#7A6A5C] font-medium">Across 3 virtual brands</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">90-Day Repeat Rate</span>
              <div className="text-2xl font-black text-[#3A2E25]">58.4%</div>
              <p className="text-xs text-emerald-600 font-bold">Industry baseline is 24%</p>
            </div>
          </div>

          {/* 1 Main Chart: Hourly Orders Load Trend */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Hourly Order Demand & Kitchen Load</h3>
                <p className="text-xs text-[#7A6A5C]">Real-time order volume curve across Bangalore cloud hubs</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDemoMode((p) => !p)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    demoMode
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm animate-pulse'
                      : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{demoMode ? 'Demo Burst Active' : 'Start Demo Burst'}</span>
                </button>
                <button
                  onClick={() => setDetailsDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFF8EE] hover:bg-orange-100/80 text-[#3A2E25] border border-orange-200 transition"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_ORDER_LOAD} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FDE8D3" vertical={false} />
                  <XAxis dataKey="hour" stroke="#9E8D7C" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9E8D7C" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val} orders`, 'Volume']}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#FDBA74', borderRadius: 12, color: '#3A2E25', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#orderGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A6A5C] pt-2 border-t border-orange-100">
              <span>Peak surge: 8 PM – 10 PM (Dinner & Midnight comfort cravings)</span>
              <span className="text-orange-600 font-bold cursor-pointer hover:underline" onClick={() => setCurrentView('customer')}>
                Open Customer App →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: UNIT ECONOMICS ================= */}
      {overviewSubTab === 'unit_economics' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards for Economics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Direct Order Margin</span>
              <div className="text-2xl font-black text-emerald-600">₹193.20</div>
              <p className="text-xs text-emerald-700 font-bold">46.0% net contribution</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Aggregator Margin</span>
              <div className="text-2xl font-black text-rose-600">₹75.60</div>
              <p className="text-xs text-rose-700 font-bold">18.0% net contribution</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Margin Multiplier</span>
              <div className="text-2xl font-black text-[#3A2E25]">2.55x</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Direct vs Swiggy/Zomato</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1.5">
              <span className="text-xs font-semibold text-[#7A6A5C]">Direct Channel Share</span>
              <div className="text-2xl font-black text-orange-600">{directSharePct}%</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Zero-toll volume rail</p>
            </div>
          </div>

          {/* 1 Main Chart: Stacked Margin Breakdown */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Unit Economics: Direct App vs Aggregator</h3>
                <p className="text-xs text-[#7A6A5C]">Based on standard ₹420 Bangalore order basket</p>
              </div>

              <button
                onClick={() => setDetailsDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFF8EE] hover:bg-orange-100/80 text-[#3A2E25] border border-orange-200 transition self-start sm:self-auto"
              >
                Cost Schedule Breakdown
              </button>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitEconomicsData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FDE8D3" horizontal={false} />
                  <XAxis type="number" stroke="#9E8D7C" unit="₹" domain={[0, 420]} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="channel" type="category" stroke="#3A2E25" width={140} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [`₹${val}`, String(name)]}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#FDBA74', borderRadius: 12, color: '#3A2E25', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Bar dataKey="foodCost" name="Food Cost (₹118)" stackId="a" fill="#3B82F6" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="packaging" name="Packaging (₹25)" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="delivery" name="Delivery (₹55)" stackId="a" fill="#14B8A6" />
                  <Bar dataKey="commission" name="Aggregator Take (₹92)" stackId="a" fill="#E5484D" />
                  <Bar dataKey="marketing" name="Marketing (₹21-50)" stackId="a" fill="#FBBF24" />
                  <Bar dataKey="margin" name="Contribution Margin" stackId="a" fill="#16A34A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-[#3A2E25] space-y-1">
              <span className="font-extrabold text-orange-900">Why Direct Channel Matters for the MBA Case:</span>
              <p className="text-[#7A6A5C] leading-relaxed">
                Aggregators charge 22% commission (₹92 on a ₹420 order) and mask the customer's phone number. Growth Falcon uses direct ordering to capture full diner profile history, powering zero-CAC AI nudges and underwriting Partner Bank credit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: HOW IT WORKS ================= */}
      {overviewSubTab === 'how_it_works' && (
        <div className="space-y-6">
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#3A2E25]">The Growth Falcon Value Loop (Interactive)</h3>
              <p className="text-xs text-[#7A6A5C]">
                Click any node in the flywheel to inspect the live operational view
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flywheelStages.map((stage, idx) => (
                <div
                  key={stage.id}
                  onClick={() => setCurrentView(stage.view)}
                  className={`p-5 rounded-2xl border cursor-pointer hover:border-orange-400 transition-all group space-y-3 food-card bg-white ${stage.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs border border-orange-100">
                      {stage.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#7A6A5C] group-hover:text-[#3A2E25] transition">
                      Step 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#3A2E25] group-hover:text-orange-600 transition">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-[#7A6A5C] mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform space-x-1">
                    <span>Open View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progressive Disclosure Slide-In Drawer */}
      {detailsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setDetailsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FFF8EE] text-[#3A2E25] border-l border-orange-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-orange-200 pb-3">
                  <h3 className="text-base font-extrabold text-[#3A2E25]">Full Operational Breakdown</h3>
                  <button
                    onClick={() => setDetailsDrawerOpen(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Table of Brands */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-[#7A6A5C] uppercase tracking-wider">
                    Virtual Brands Capacity
                  </span>
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl bg-white border border-orange-100 flex justify-between items-center text-xs shadow-xs">
                      <div>
                        <p className="font-bold text-[#3A2E25]">Thali Theory</p>
                        <p className="text-[#7A6A5C]">South Indian Meals & Tiffin</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">4.8★</p>
                        <p className="text-[#7A6A5C]">18.2k Orders</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-orange-100 flex justify-between items-center text-xs shadow-xs">
                      <div>
                        <p className="font-bold text-[#3A2E25]">Bowl Republic</p>
                        <p className="text-[#7A6A5C]">High-Protein Millets & Salads</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">4.7★</p>
                        <p className="text-[#7A6A5C]">14.1k Orders</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-orange-100 flex justify-between items-center text-xs shadow-xs">
                      <div>
                        <p className="font-bold text-[#3A2E25]">Midnight Maska</p>
                        <p className="text-[#7A6A5C]">Comfort Rolls & Handi Biryani</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">4.6★</p>
                        <p className="text-[#7A6A5C]">22.4k Orders</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pin Codes */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-[#7A6A5C] uppercase tracking-wider">
                    Bangalore Delivery Zones
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-orange-100 text-[#3A2E25] font-semibold">
                      560034 Koramangala
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-orange-100 text-[#3A2E25] font-semibold">
                      560038 Indiranagar
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-orange-100 text-[#3A2E25] font-semibold">
                      560102 HSR Layout
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-orange-100 text-[#3A2E25] font-semibold">
                      560066 Whitefield
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailsDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
