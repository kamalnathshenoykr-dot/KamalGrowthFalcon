import React, { useState } from 'react';
import { useApp, MarketingSubTab } from '../context/AppContext';
import {
  CHANNEL_FUNNELS,
  INITIAL_CUSTOMERS,
  CAMPAIGN_RESULTS,
  BRANDS,
} from '../data/mockData';
import { CampaignResult } from '../types';
import {
  TrendingUp,
  Megaphone,
  Users,
  Target,
  Sparkles,
  Send,
  MessageSquare,
  Clock,
  ArrowRight,
  Filter,
  Percent,
  CheckCircle2,
  Copy,
  Zap,
  X,
  Database,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const MarketingView: React.FC = () => {
  const {
    marketingSubTab,
    setMarketingSubTab,
    campaigns,
    addCampaign,
    activeSegment,
    setActiveSegment,
  } = useApp();

  const [nudgeLanguage, setNudgeLanguage] = useState<'English' | 'Hinglish'>('English');
  const [targetBrand, setTargetBrand] = useState('Thali Theory');
  const [isGeneratingNudge, setIsGeneratingNudge] = useState(false);
  const [generatedNudgeText, setGeneratedNudgeText] = useState(
    '🌙 Craving midnight comfort in Koramangala? Midnight Maska is hot and rolling! Enjoy ₹120 OFF on Dum Biryani & Rolls + 2X Falcon Coins. Delivered hot in 28 mins: growthfalcon.in/midnight 🚀'
  );
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Drawers
  const [acquireDetailsOpen, setAcquireDetailsOpen] = useState(false);
  const [segmentDrawerOpen, setSegmentDrawerOpen] = useState(false);

  // Discount sensitivity data
  const discountSensitivityData = [
    { discount: '0%', orders: 120, marginPct: 46, profit: 5520 },
    { discount: '10%', orders: 280, marginPct: 38, profit: 10640 },
    { discount: '20% (Sweet Spot)', orders: 640, marginPct: 31, profit: 19840 },
    { discount: '30%', orders: 720, marginPct: 22, profit: 15840 },
    { discount: '40% (Promo Seekers)', orders: 810, marginPct: 12, profit: 9720 },
  ];

  // Pin Code x Hour Heatmap data
  const pinHeatmap = [
    { pin: '560034 Koramangala', lunch: '🔥 High (IT Park Lunch)', evening: '⚡ Surge (Filter Coffee)', midnight: '🔥 Peak (Late Rolls)' },
    { pin: '560038 Indiranagar', lunch: '⚡ Moderate', evening: '🔥 High (Café Snacks)', midnight: '🔥 High (Biryani Crave)' },
    { pin: '560102 HSR Layout', lunch: '🔥 High (Startup Lunches)', evening: '⚡ Moderate', midnight: '⚡ Moderate' },
    { pin: '560066 Whitefield', lunch: '🔥 Peak (ITPL Campus)', evening: '⚡ Moderate', midnight: '⚡ Low' },
    { pin: '560103 Bellandur', lunch: '🔥 Peak (EcoSpace Rush)', evening: '⚡ High', midnight: '⚡ Moderate' },
  ];

  // AI Smart Nudge Generation
  const handleGenerateSmartNudge = async () => {
    setIsGeneratingNudge(true);
    try {
      const response = await fetch('/api/gemini/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment: activeSegment,
          language: nudgeLanguage,
          targetBrand,
        }),
      });
      const data = await response.json();
      if (data.message) {
        setGeneratedNudgeText(data.message);
      }
    } catch (err) {
      console.warn('AI nudge generation failed, fallback active:', err);
    } finally {
      setIsGeneratingNudge(false);
    }
  };

  const handleCopyNudge = () => {
    navigator.clipboard?.writeText(generatedNudgeText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleDispatchCampaign = () => {
    const recipientsMap: Record<string, number> = {
      'Late-night regulars': 1420,
      'High-value': 890,
      'Lapsed': 3240,
      'New': 1120,
      'Regular': 2400,
    };
    const count = recipientsMap[activeSegment] || 1200;
    const estOrders = Math.round(count * (activeSegment === 'Late-night regulars' ? 0.28 : 0.21));
    const estRev = estOrders * 460;

    const newCampaign: CampaignResult = {
      id: `camp-${Date.now().toString().slice(-4)}`,
      name: `${activeSegment} WhatsApp Boost (${nudgeLanguage})`,
      segment: activeSegment,
      channel: 'WhatsApp AI Nudge',
      sentAt: 'Just now',
      recipientsCount: count,
      openRate: 81.4,
      ordersCount: estOrders,
      conversionRate: Math.round((estOrders / count) * 100),
      revenueGenerated: estRev,
      roi: '7.8x',
    };

    addCampaign(newCampaign);
    setSegmentDrawerOpen(false);
    setMarketingSubTab('campaigns');
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* View Header with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">Growth & AI Marketing</h1>
          <p className="text-xs sm:text-sm text-[#7A6A5C] mt-0.5">
            Converting aggregator traffic to Direct App loyalty with hyper-local Bangalore data.
          </p>
        </div>

        {/* Sub-Tabs: Acquire | Retain | Campaigns */}
        <div className="inline-flex items-center p-1 bg-white border border-orange-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setMarketingSubTab('acquire')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              marketingSubTab === 'acquire'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Acquire
          </button>
          <button
            onClick={() => setMarketingSubTab('retain')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              marketingSubTab === 'retain'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Retain
          </button>
          <button
            onClick={() => setMarketingSubTab('campaigns')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              marketingSubTab === 'campaigns'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
        </div>
      </div>

      {/* ================= SUB-TAB 1: ACQUIRE ================= */}
      {marketingSubTab === 'acquire' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Direct App CAC</span>
              <div className="text-2xl font-black text-emerald-600">₹48</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Aggregator CPA is ₹146</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Direct Channel GMV</span>
              <div className="text-2xl font-black text-[#3A2E25]">₹61.4L</div>
              <p className="text-xs text-emerald-600 font-bold">Zero commissions paid</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Blended ROAS</span>
              <div className="text-2xl font-black text-[#3A2E25]">8.4x</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Across organic & WhatsApp</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Direct Contribution</span>
              <div className="text-2xl font-black text-emerald-600">24.8%</div>
              <p className="text-xs text-[#7A6A5C] font-medium">vs 7.1% on aggregators</p>
            </div>
          </div>

          {/* 1 Main Chart: Channel Funnel */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Customer Acquisition by Channel</h3>
                <p className="text-xs text-[#7A6A5C]">Order volumes and contribution margins across channels</p>
              </div>

              <button
                onClick={() => setAcquireDetailsOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFF8EE] hover:bg-orange-100/80 text-[#3A2E25] border border-orange-200 transition self-start sm:self-auto"
              >
                View Search & Elasticity Details
              </button>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_FUNNELS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FDE8D3" vertical={false} />
                  <XAxis dataKey="channel" stroke="#9E8D7C" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9E8D7C" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}`, String(name)]}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#FDBA74', borderRadius: 12, color: '#3A2E25' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="orders" name="Orders (90D)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cpa" name="CPA (₹)" fill="#E5484D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netContributionMargin" name="Margin %" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 1 Heatmap Table: Bangalore Pin Code Demand */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#3A2E25]">Bangalore Pin Code Demand Heatmap</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-orange-200 text-[#7A6A5C]">
                    <th className="pb-3 font-bold">Delivery Zone</th>
                    <th className="pb-3 font-bold">Lunch Demand (12-3 PM)</th>
                    <th className="pb-3 font-bold">Evening Tiffin (5-7 PM)</th>
                    <th className="pb-3 font-bold">Midnight Comfort (11-3 AM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 text-[#3A2E25]">
                  {pinHeatmap.map((row, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50 transition">
                      <td className="py-3 font-bold text-[#3A2E25]">{row.pin}</td>
                      <td className="py-3 text-orange-600 font-semibold">{row.lunch}</td>
                      <td className="py-3 text-[#7A6A5C]">{row.evening}</td>
                      <td className="py-3 text-emerald-700 font-semibold">{row.midnight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: RETAIN ================= */}
      {marketingSubTab === 'retain' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">30-Day Retention</span>
              <div className="text-2xl font-black text-emerald-600">58.4%</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Industry average is 24%</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Cohort LTV</span>
              <div className="text-2xl font-black text-[#3A2E25]">₹18,450</div>
              <p className="text-xs text-[#7A6A5C] font-medium">High-value segments</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">At-Risk Diners</span>
              <div className="text-2xl font-black text-amber-600">3,240</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Overdue for reorder</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Avg Reorder Gap</span>
              <div className="text-2xl font-black text-[#3A2E25]">3.5 days</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Direct App users</p>
            </div>
          </div>

          {/* Segment Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#3A2E25]">Customer Segments for AI Retention Nudges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'Late-night regulars',
                  name: 'Late-Night Comfort Regulars',
                  count: '1,420 customers',
                  behavior: 'Biryani, kathi rolls & Irani chai after 11 PM in Koramangala & Indiranagar',
                  badge: 'Highest Margins',
                  brand: 'Midnight Maska',
                },
                {
                  id: 'High-value',
                  name: 'High-Value Corporate Regulars',
                  count: '890 customers',
                  behavior: 'AOV ₹560+, corporate orders, 40+ lifetime orders across Bellandur & HSR',
                  badge: '₹24k+ LTV',
                  brand: 'Thali Theory',
                },
                {
                  id: 'Lapsed',
                  name: 'At-Risk Lapsed Diners',
                  count: '3,240 customers',
                  behavior: 'No order in 20+ days. Previously ordered quinoa bowls & dosas weekly',
                  badge: 'High Re-engagement',
                  brand: 'Bowl Republic',
                },
                {
                  id: 'Regular',
                  name: 'Weekly Health Enthusiasts',
                  count: '2,400 customers',
                  behavior: 'Order foxtail millet & high-protein bowls 2–3 times a week for lunch',
                  badge: 'Stable MRR',
                  brand: 'Bowl Republic',
                },
              ].map((seg) => (
                <div
                  key={seg.id}
                  onClick={() => {
                    setActiveSegment(seg.id);
                    setTargetBrand(seg.brand);
                    setSegmentDrawerOpen(true);
                  }}
                  className="bg-white border border-orange-100 p-5 rounded-2xl cursor-pointer hover:border-orange-300 shadow-xs hover:shadow-md transition food-card group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                      {seg.badge}
                    </span>
                    <span className="text-xs text-[#7A6A5C] font-mono">{seg.count}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#3A2E25] text-base group-hover:text-orange-600 transition">
                      {seg.name}
                    </h4>
                    <p className="text-xs text-[#7A6A5C] mt-1 leading-relaxed">{seg.behavior}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-orange-600">
                    <span>Generate AI Smart Nudge</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: CAMPAIGNS ================= */}
      {marketingSubTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Campaigns Sent</span>
              <div className="text-2xl font-black text-[#3A2E25]">{campaigns.length}</div>
              <p className="text-xs text-[#7A6A5C] font-medium">WhatsApp direct API</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Revenue Driven</span>
              <div className="text-2xl font-black text-emerald-600">
                ₹{Math.round(campaigns.reduce((s, c) => s + c.revenueGenerated, 0) / 1000)}k
              </div>
              <p className="text-xs text-[#7A6A5C] font-medium">Attributed sales</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Avg Open Rate</span>
              <div className="text-2xl font-black text-[#3A2E25]">78.5%</div>
              <p className="text-xs text-emerald-600 font-bold">+40% vs email</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Avg Conversion</span>
              <div className="text-2xl font-black text-orange-600">23.5%</div>
              <p className="text-xs text-[#7A6A5C] font-medium">Click-to-order</p>
            </div>
          </div>

          {/* Past Campaigns Table */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-[#3A2E25]">Campaign Performance Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-orange-200 text-[#7A6A5C]">
                    <th className="pb-3 font-bold">Campaign Name</th>
                    <th className="pb-3 font-bold">Segment</th>
                    <th className="pb-3 font-bold">Sent</th>
                    <th className="pb-3 font-bold">Open Rate</th>
                    <th className="pb-3 font-bold">Orders</th>
                    <th className="pb-3 font-bold">Revenue</th>
                    <th className="pb-3 font-bold">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 text-[#3A2E25]">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-orange-50/50 transition">
                      <td className="py-3 font-bold text-[#3A2E25]">{camp.name}</td>
                      <td className="py-3 text-[#7A6A5C]">{camp.segment}</td>
                      <td className="py-3 font-mono font-semibold">{camp.recipientsCount}</td>
                      <td className="py-3 text-emerald-700 font-bold">{camp.openRate}%</td>
                      <td className="py-3 font-bold text-[#3A2E25]">{camp.ordersCount}</td>
                      <td className="py-3 font-extrabold text-emerald-700">₹{camp.revenueGenerated.toLocaleString()}</td>
                      <td className="py-3 font-bold text-orange-600">{camp.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Smart Nudge Drawer */}
      {segmentDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSegmentDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FFF8EE] text-[#3A2E25] border-l border-orange-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-orange-200 pb-3">
                  <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>Gemini AI WhatsApp Nudge</span>
                  </h3>
                  <button onClick={() => setSegmentDrawerOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#3A2E25] font-bold block mb-1">Target Segment</label>
                    <div className="p-2.5 rounded-xl bg-white border border-orange-200 font-bold text-orange-800">
                      {activeSegment}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#3A2E25] font-bold block mb-1">Brand to Promote</label>
                    <select
                      value={targetBrand}
                      onChange={(e) => setTargetBrand(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25] font-semibold"
                    >
                      {BRANDS.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[#3A2E25] font-bold block mb-1">Language Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNudgeLanguage('English')}
                        className={`p-2 rounded-xl border font-bold ${
                          nudgeLanguage === 'English'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-[#7A6A5C] border-orange-200'
                        }`}
                      >
                        English (Crisp)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNudgeLanguage('Hinglish')}
                        className={`p-2 rounded-xl border font-bold ${
                          nudgeLanguage === 'Hinglish'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-[#7A6A5C] border-orange-200'
                        }`}
                      >
                        Hinglish (Colloquial)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateSmartNudge}
                    disabled={isGeneratingNudge}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-xs transition hover:scale-105"
                  >
                    {isGeneratingNudge ? 'Synthesizing with Gemini...' : 'Generate New Copy with AI'}
                  </button>

                  <div className="p-4 rounded-2xl bg-white border border-orange-200 space-y-2 shadow-xs">
                    <span className="font-bold text-[#7A6A5C] text-[11px] block">WhatsApp Message Preview:</span>
                    <p className="text-xs text-[#3A2E25] leading-relaxed font-medium bg-[#FFF8EE] p-3 rounded-xl border border-orange-100">
                      {generatedNudgeText}
                    </p>
                    <button
                      onClick={handleCopyNudge}
                      className="text-xs font-bold text-orange-600 flex items-center space-x-1 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSuccess ? 'Copied to clipboard!' : 'Copy message text'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDispatchCampaign}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  🚀 Dispatch WhatsApp Blast Now
                </button>
                <button
                  onClick={() => setSegmentDrawerOpen(false)}
                  className="w-full py-2 bg-white text-[#7A6A5C] border border-orange-200 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer for Acquisition */}
      {acquireDetailsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setAcquireDetailsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FFF8EE] text-[#3A2E25] border-l border-orange-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-orange-200 pb-3">
                  <h3 className="text-base font-extrabold text-[#3A2E25]">Search & Discount Elasticity</h3>
                  <button onClick={() => setAcquireDetailsOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#7A6A5C] uppercase tracking-wider">
                    Discount Elasticity Curve
                  </h4>
                  <div className="space-y-2">
                    {discountSensitivityData.map((d, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-orange-100 flex justify-between text-xs shadow-2xs">
                        <div>
                          <p className="font-bold text-[#3A2E25]">{d.discount}</p>
                          <p className="text-[#7A6A5C] text-[11px]">{d.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-emerald-700">{d.marginPct}% Margin</p>
                          <p className="text-[#7A6A5C] text-[11px]">Net: ₹{d.profit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAcquireDetailsOpen(false)}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
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
