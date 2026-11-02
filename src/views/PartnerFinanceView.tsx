import React, { useState } from 'react';
import { useApp, FinanceSegment, FinanceSubTab } from '../context/AppContext';
import { RIDERS } from '../data/mockData';
import {
  Landmark,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Bike,
  ChefHat,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  PiggyBank,
  X,
  FileText,
  Sliders,
  DollarSign,
  HeartHandshake,
} from 'lucide-react';

export const PartnerFinanceView: React.FC = () => {
  const {
    financeSegment,
    setFinanceSegment,
    financeSubTab,
    setFinanceSubTab,
    activeRiderId,
    dataSharingConsent,
    setDataSharingConsent,
    instantSettlementDone,
    triggerInstantSettlement,
    riderWithdrawalDone,
    triggerRiderWithdrawal,
    riderAutoSaveVal,
    setRiderAutoSaveVal,
    rules,
  } = useApp();

  const [explainLanguage, setExplainLanguage] = useState<'English' | 'Hindi' | 'Kannada'>('English');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [selectedOfferTitle, setSelectedOfferTitle] = useState('Working Capital Loan');
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [loanTenureMonths, setLoanTenureMonths] = useState(12);

  const activeRider = RIDERS.find((r) => r.id === activeRiderId) || RIDERS[0];

  // Settlement Ledger
  const settlementLedger = [
    { date: '23 Oct (Today)', gross: 14280, platformFee: Math.round(14280 * (rules.rollingPayoutReservePct / 100)), net: 14280 - Math.round(14280 * (rules.rollingPayoutReservePct / 100)), status: 'Settled Instant' },
    { date: '22 Oct (Yesterday)', gross: 38450, platformFee: Math.round(38450 * (rules.rollingPayoutReservePct / 100)), net: 38450 - Math.round(38450 * (rules.rollingPayoutReservePct / 100)), status: 'Settled via IMPS' },
    { date: '21 Oct', gross: 32100, platformFee: Math.round(32100 * (rules.rollingPayoutReservePct / 100)), net: 32100 - Math.round(32100 * (rules.rollingPayoutReservePct / 100)), status: 'Settled via IMPS' },
    { date: '20 Oct', gross: 29800, platformFee: Math.round(29800 * (rules.rollingPayoutReservePct / 100)), net: 29800 - Math.round(29800 * (rules.rollingPayoutReservePct / 100)), status: 'Settled via IMPS' },
  ];

  const handleExplainOffer = async (offerType: string, offerDetails: any) => {
    setSelectedOfferTitle(offerType);
    setIsExplaining(true);
    setCalculatorModalOpen(true);
    try {
      const response = await fetch('/api/gemini/explain-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerType,
          offerDetails,
          language: explainLanguage,
          audience:
            financeSegment === 'kitchen'
              ? 'Cloud Kitchen Partner'
              : financeSegment === 'rider'
              ? 'Delivery Gig Rider'
              : 'Home Cook Micro-Vendor',
        }),
      });
      const data = await response.json();
      if (data.explanation) {
        setExplanationText(data.explanation);
      }
    } catch (err) {
      console.warn('Finance explanation error, fallback:', err);
      setExplanationText(
        `Growth Falcon & Partner Bank offer ${offerType} calculated strictly against your verified on-platform transaction history. Automated daily micro-repayments (${rules.rollingPayoutReservePct}%) prevent bulky lump-sum debt burdens.`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Header with Segment Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Landmark className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-[#3A2E25] font-heading tracking-tight">
              Partner Bank Embedded Finance
            </h1>
          </div>
          <p className="text-sm text-[#7A6A5C] mt-1">
            Verified cash flow underwriting for kitchens, gig delivery partners, and women home cooks.
          </p>
        </div>

        {/* Segment Switcher: Kitchen Partner | Delivery Rider | Financial Inclusion */}
        <div className="inline-flex items-center p-1 bg-white border border-orange-200/80 rounded-xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setFinanceSegment('kitchen')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              financeSegment === 'kitchen'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Kitchen Partner
          </button>
          <button
            onClick={() => setFinanceSegment('rider')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              financeSegment === 'rider'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Delivery Rider
          </button>
          <button
            onClick={() => setFinanceSegment('inclusion')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              financeSegment === 'inclusion'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Financial Inclusion
          </button>
        </div>
      </div>

      {/* Sub-Tabs within Segment: Overview | Offers | Insurance | Data Consent */}
      <div className="flex items-center space-x-2 border-b border-orange-100/80 pb-3">
        {(['overview', 'offers', 'insurance', 'data_consent'] as FinanceSubTab[]).map((tab) => {
          const labels: Record<FinanceSubTab, string> = {
            overview: 'Overview',
            offers: 'Credit & Loans',
            insurance: 'Insurance',
            data_consent: 'Data Consent',
          };
          return (
            <button
              key={tab}
              onClick={() => setFinanceSubTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                financeSubTab === tab
                  ? 'bg-white text-orange-600 border border-orange-300 shadow-xs'
                  : 'text-[#7A6A5C] hover:text-[#3A2E25] hover:bg-orange-50/50'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ================= SUB-TAB 1: OVERVIEW ================= */}
      {financeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Exactly 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {financeSegment === 'kitchen' && (
              <>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Today's Gross Sales</span>
                  <div className="text-2xl font-black text-[#3A2E25] font-heading">₹38,450</div>
                  <p className="text-xs text-emerald-600 font-semibold">+18% vs weekly avg</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Available Credit Line</span>
                  <div className="text-2xl font-black text-orange-600 font-heading">₹5,00,000</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">11.5% p.a. pre-approved</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Partner Credit Score</span>
                  <div className="text-2xl font-black text-emerald-600 font-heading">784</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">AA verified cash flow</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Instant Settlement</span>
                  <div className="text-2xl font-black text-amber-600 font-heading">Active</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">T+0 direct to HDFC Bank</p>
                </div>
              </>
            )}

            {financeSegment === 'rider' && (
              <>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Accrued Payout</span>
                  <div className="text-2xl font-black text-[#3A2E25] font-heading">₹{activeRider.accruedBalance}</div>
                  <p className="text-xs text-emerald-600 font-semibold">Earned Wage Access (EWA)</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Micro-Savings (7.2% RD)</span>
                  <div className="text-2xl font-black text-orange-600 font-heading">₹{activeRider.accumulatedSavings}</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">₹{activeRider.autoSavePerTrip}/trip auto-invest</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Cash-in-Hand Limit</span>
                  <div className="text-2xl font-black text-amber-600 font-heading">
                    ₹{activeRider.cashInHand} / ₹{rules.dailyRiderCashInHandLimit}
                  </div>
                  <p className="text-xs text-[#7A6A5C] font-medium">Zero COD lockouts</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Accident Insurance</span>
                  <div className="text-2xl font-black text-emerald-600 font-heading">₹5,00,000</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">Sponsored by platform</p>
                </div>
              </>
            )}

            {financeSegment === 'inclusion' && (
              <>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Home Cooks Onboarded</span>
                  <div className="text-2xl font-black text-[#3A2E25] font-heading">14 Cooks</div>
                  <p className="text-xs text-emerald-600 font-semibold">Shared cloud hub slots</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Capital Disbursed</span>
                  <div className="text-2xl font-black text-orange-600 font-heading">₹6,80,000</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">Zero collateral lines</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Repayment Track Record</span>
                  <div className="text-2xl font-black text-emerald-600 font-heading">99.4%</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">Daily automated micro-deduct</p>
                </div>
                <div className="bg-white border border-orange-100 p-5 rounded-2xl space-y-1 shadow-xs food-card">
                  <span className="text-xs font-medium text-[#7A6A5C]">Underwriting TAT</span>
                  <div className="text-2xl font-black text-amber-600 font-heading">2 Hours</div>
                  <p className="text-xs text-[#7A6A5C] font-medium">vs 21 days at traditional branch</p>
                </div>
              </>
            )}
          </div>

          {/* Settlement / Financial Activity Log */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#3A2E25] font-heading">
                  {financeSegment === 'kitchen' ? 'Daily Settlement Ledger' : 'Recent Payouts & Transfers'}
                </h3>
                <p className="text-xs text-[#7A6A5C]">
                  Automated Account Aggregator (AA) data clearing · Reserve Rate {rules.rollingPayoutReservePct}%
                </p>
              </div>

              {financeSegment === 'kitchen' ? (
                <button
                  onClick={triggerInstantSettlement}
                  disabled={instantSettlementDone}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    instantSettlementDone
                      ? 'bg-orange-50 text-[#7A6A5C] border border-orange-200 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{instantSettlementDone ? 'Settled to HDFC' : 'Trigger Instant T+0 Settlement'}</span>
                </button>
              ) : (
                <button
                  onClick={triggerRiderWithdrawal}
                  disabled={riderWithdrawalDone}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{riderWithdrawalDone ? 'Transferred via UPI' : 'Instant EWA Cashout'}</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-orange-100 text-[#7A6A5C]">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Gross Volume</th>
                    <th className="pb-3 font-semibold">Platform Reserve ({rules.rollingPayoutReservePct}%)</th>
                    <th className="pb-3 font-semibold">Net Payout</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50 text-[#3A2E25]">
                  {settlementLedger.map((row, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/40 transition">
                      <td className="py-3 font-medium text-[#3A2E25]">{row.date}</td>
                      <td className="py-3 font-medium">₹{row.gross.toLocaleString()}</td>
                      <td className="py-3 text-[#7A6A5C]">₹{row.platformFee}</td>
                      <td className="py-3 font-bold text-emerald-600">₹{row.net.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: OFFERS (CREDIT & LOANS) ================= */}
      {financeSubTab === 'offers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offer 1 */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-xs food-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  Pre-Approved
                </span>
                <span className="text-xs text-[#7A6A5C]">Zero Paperwork</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#3A2E25] font-heading">
                  {financeSegment === 'kitchen' ? 'Kitchen Working Capital Line' : 'EV Bike Upgrade Loan'}
                </h3>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  {financeSegment === 'kitchen'
                    ? 'Flexible revolving overdraft for bulk ingredient procurement during peak holiday spikes.'
                    : 'Low-interest EMI financing to transition from petrol scooters to Ather 450X or Ola S1.'}
                </p>
              </div>

              <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 text-xs flex justify-between">
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Sanction Amount</span>
                  <span className="text-base font-black text-[#3A2E25] font-heading">
                    {financeSegment === 'kitchen' ? '₹3,50,000' : '₹95,000'}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Interest Rate</span>
                  <span className="text-base font-black text-emerald-600 font-heading">
                    {financeSegment === 'kitchen' ? '11.2% p.a.' : '8.9% p.a.'}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Disbursal Time</span>
                  <span className="text-base font-black text-orange-600 font-heading">30 Mins</span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleExplainOffer(
                    financeSegment === 'kitchen' ? 'Working Capital Line' : 'EV Loan',
                    { amount: '₹3,50,000', rate: '11.2%' }
                  )
                }
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain Offer with AI & Calculate EMI</span>
              </button>
            </div>

            {/* Offer 2 */}
            <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-xs food-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Instant Virtual Line
                </span>
                <span className="text-xs text-[#7A6A5C]">100% Digital</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#3A2E25] font-heading">
                  {financeSegment === 'kitchen' ? 'Equipment Upgrade Term Loan' : 'Falcon Fuel & Battery Card'}
                </h3>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  {financeSegment === 'kitchen'
                    ? 'Finance commercial rational combi-ovens & automated packing stations.'
                    : 'Charge at Ather Grid / Sun Mobility battery swap stations with zero upfront charge.'}
                </p>
              </div>

              <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 text-xs flex justify-between">
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Limit</span>
                  <span className="text-base font-black text-[#3A2E25] font-heading">
                    {financeSegment === 'kitchen' ? '₹7,50,000' : '₹15,000/mo'}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Repayment</span>
                  <span className="text-base font-black text-emerald-600 font-heading">
                    Daily {rules.rollingPayoutReservePct}% deduct
                  </span>
                </div>
                <div>
                  <span className="text-[#7A6A5C] block text-[11px]">Cashback</span>
                  <span className="text-base font-black text-orange-600 font-heading">3.5%</span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleExplainOffer(
                    financeSegment === 'kitchen' ? 'Equipment Loan' : 'Fuel Card',
                    { amount: '₹7,50,000', rate: '10.5%' }
                  )
                }
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Explain Offer with AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: INSURANCE ================= */}
      {financeSubTab === 'insurance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-xs food-card">
              <div className="flex items-center space-x-2 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-[#3A2E25] font-heading text-base">Active Safety Policy</h3>
              </div>
              <p className="text-xs text-[#7A6A5C] leading-relaxed">
                Every Growth Falcon partner receives comprehensive cashless hospitalization and loss-of-income coverage backed by Partner Bank and ICICI Lombard.
              </p>
              <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7A6A5C]">Sum Insured:</span>
                  <span className="text-[#3A2E25] font-bold">₹5,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6A5C]">Hospital Network:</span>
                  <span className="text-emerald-700 font-semibold">180+ Bangalore Hospitals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6A5C]">Status:</span>
                  <span className="text-emerald-700 font-bold">Active & Pre-Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-4 shadow-xs food-card">
              <div className="flex items-center space-x-2 text-orange-600">
                <PiggyBank className="w-5 h-5" />
                <h3 className="font-bold text-[#3A2E25] font-heading text-base">7.2% RD Micro-Savings</h3>
              </div>
              <p className="text-xs text-[#7A6A5C] leading-relaxed">
                Set a small micro-saving per order or trip to automatically compound into a high-yield recurring deposit account with Partner Bank.
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs text-[#3A2E25]">
                  <span className="font-medium text-[#7A6A5C]">Auto-save per order / trip:</span>
                  <span className="font-black text-orange-600">₹{riderAutoSaveVal}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={riderAutoSaveVal}
                  onChange={(e) => setRiderAutoSaveVal(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-[11px] text-[#7A6A5C] text-right">
                  Projected 1-Year Total: <strong className="text-emerald-600">₹{(riderAutoSaveVal * 15 * 26 * 12).toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: DATA CONSENT ================= */}
      {financeSubTab === 'data_consent' && (
        <div className="space-y-6">
          <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#3A2E25] font-heading">
                Partner Bank Account Aggregator (AA) Consent
              </h3>
              <p className="text-xs text-[#7A6A5C] mt-1">
                You control exactly which operational telemetry streams are shared to calculate your pre-approved credit lines.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'sales' as const,
                  title: 'Daily Order Volumes & Gross GMV',
                  desc: 'Used to verify business turnover and calculate working capital limit',
                },
                {
                  key: 'settlements' as const,
                  title: 'Daily Settlement Payouts & Banking Transits',
                  desc: 'Proves timely cash flow clearing and eliminates bank statement paper collection',
                },
                {
                  key: 'ratings' as const,
                  title: 'Customer Food & Packaging Ratings',
                  desc: 'Higher hygiene ratings qualify for a 0.75% interest rate discount',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 bg-orange-50/40 rounded-xl border border-orange-100 flex items-center justify-between"
                >
                  <div className="max-w-md">
                    <h4 className="text-xs font-bold text-[#3A2E25]">{item.title}</h4>
                    <p className="text-[11px] text-[#7A6A5C] mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataSharingConsent[item.key]}
                      onChange={(e) =>
                        setDataSharingConsent((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>All data encrypted under RBI Account Aggregator guidelines. Zero third-party marketing brokers.</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation & Calculator Modal */}
      {calculatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-orange-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <h3 className="text-base font-bold text-[#3A2E25] font-heading flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span>{selectedOfferTitle} — AI Explainer</span>
              </h3>
              <button
                onClick={() => setCalculatorModalOpen(false)}
                className="text-[#7A6A5C] hover:text-[#3A2E25] p-1 rounded-lg hover:bg-orange-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6A5C]">Language:</span>
                <div className="flex space-x-1">
                  {(['English', 'Hindi', 'Kannada'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setExplainLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        explainLanguage === lang
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-100 text-[#7A6A5C] hover:bg-stone-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {isExplaining ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[#7A6A5C]">Generating plain-language explanation with Gemini...</p>
                </div>
              ) : explanationText ? (
                <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-100 text-[#3A2E25] leading-relaxed font-sans text-xs">
                  {explanationText}
                </div>
              ) : null}

              {/* Repayment Calculator */}
              <div className="p-3.5 bg-orange-50/40 rounded-xl border border-orange-100 space-y-2">
                <span className="font-bold text-[#3A2E25] block">Repayment Calculator</span>
                <div className="flex justify-between text-[#7A6A5C]">
                  <span>Tenure: {loanTenureMonths} Months</span>
                  <span className="text-emerald-700 font-bold">
                    Est. Daily Deduct: ₹{Math.round((350000 * 1.112) / (loanTenureMonths * 30))}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  step="3"
                  value={loanTenureMonths}
                  onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <button
              onClick={() => setCalculatorModalOpen(false)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#3A2E25] text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
