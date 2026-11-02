import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  CheckCircle2,
  Clock,
  Bike,
  ShieldAlert,
  Coins,
  Scale,
  ChefHat,
  HeartHandshake,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const RulesView: React.FC = () => {
  const { rules, updateRule, resetRulesToDefault, setCurrentView } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Platform Governance & Policy Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">
            Rules & Operational Thresholds
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A5C] mt-1 max-w-2xl">
            Configure live operational guardrails, dispute resolution rules, and financial underwriting limits. All customer, kitchen, rider, and bank flows dynamically read from these values.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={resetRulesToDefault}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#7A6A5C] bg-orange-50/80 hover:bg-orange-100 border border-orange-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={() => setCurrentView('flowmap')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm transition"
          >
            <span>View in Flow Map →</span>
          </button>
        </div>
      </div>

      {/* Grid of Rules by Functional Domain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Kitchen & Order Intake */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-orange-100">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#3A2E25]">Kitchen & Order Intake SLA</h2>
              <p className="text-xs text-[#7A6A5C]">Preparation speed and hub capacity guardrails</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Order cutoff before closing */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Order Cutoff Before Closing</label>
                <span className="text-[#7A6A5C] text-[11px]">Direct app stop window before kitchen shifts end</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={rules.orderCutoffBeforeClosingMin}
                  onChange={(e) => updateRule('orderCutoffBeforeClosingMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">min</span>
              </div>
            </div>

            {/* Kitchen accept window */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Kitchen Accept Window</label>
                <span className="text-[#7A6A5C] text-[11px]">Tablet chime before supervisor escalation</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rules.kitchenAcceptWindowMin}
                  onChange={(e) => updateRule('kitchenAcceptWindowMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">min</span>
              </div>
            </div>

            {/* Busy Mode Thresholds */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-[#3A2E25] block">Busy Mode: Kitchen Open Orders Cap</label>
                  <span className="text-[#7A6A5C] text-[11px]">Throttles aggregators when tickets cross cap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={rules.busyModeKitchenOpenOrdersCap}
                    onChange={(e) => updateRule('busyModeKitchenOpenOrdersCap', Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                  />
                  <span className="font-semibold text-slate-500">orders</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/40">
                <span className="text-[#7A6A5C] text-[11px]">Max concurrent orders per single rider</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rules.busyModeRiderOpenOrdersCap}
                    onChange={(e) => updateRule('busyModeRiderOpenOrdersCap', Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                  />
                  <span className="font-semibold text-slate-500">orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Delivery Fleet, Dispatch & Reassignments */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-orange-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#3A2E25]">Delivery Fleet & Reassignment</h2>
              <p className="text-xs text-[#7A6A5C]">Auto-reassign triggers, countdowns, and safety caps</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Rider No-Show Reassign */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Rider No-Show Reassign Window</label>
                <span className="text-[#7A6A5C] text-[11px]">Time to auto-swap if accepted rider fails to move</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="2"
                  max="15"
                  value={rules.riderNoShowReassignMin}
                  onChange={(e) => updateRule('riderNoShowReassignMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">min</span>
              </div>
            </div>

            {/* Max Reassignments */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Max Rider Reassignments per Order</label>
                <span className="text-[#7A6A5C] text-[11px]">Before manual supervisor intervention is triggered</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={rules.maxRiderReassignments}
                  onChange={(e) => updateRule('maxRiderReassignments', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">times</span>
              </div>
            </div>

            {/* Customer-Absent Wait */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Customer-Absent Waiting Countdown</label>
                <span className="text-[#7A6A5C] text-[11px]">Rider gate wait before photo proof & drop clearance</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={rules.customerAbsentWaitMin}
                  onChange={(e) => updateRule('customerAbsentWaitMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">min</span>
              </div>
            </div>

            {/* Mid-Delivery Address Change Rules */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-[#3A2E25] block">Mid-Delivery Free Reroute Radius</label>
                  <span className="text-[#7A6A5C] text-[11px]">Free change under this distance (+₹25 rider bonus)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={rules.midDeliveryAddressChangeMaxKm}
                    onChange={(e) => updateRule('midDeliveryAddressChangeMaxKm', Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                  />
                  <span className="font-semibold text-slate-500">km</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/40">
                <span className="text-[#7A6A5C] text-[11px]">Reroute fee required if beyond free distance</span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-700">₹</span>
                  <input
                    type="number"
                    min="20"
                    max="100"
                    value={rules.midDeliveryAddressChangeFee}
                    onChange={(e) => updateRule('midDeliveryAddressChangeFee', Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Customer Care, Delays & Refund Schedules */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-orange-100">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#3A2E25]">Customer Care & Refund Schedules</h2>
              <p className="text-xs text-[#7A6A5C]">Delay auto-credits, complaint SLAs, and refund tiers</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* ETA Slip Alert Threshold */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">ETA Slip Alert Trigger</label>
                <span className="text-[#7A6A5C] text-[11px]">Proactive apology push notification threshold</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={rules.etaSlipAlertMin}
                  onChange={(e) => updateRule('etaSlipAlertMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">min</span>
              </div>
            </div>

            {/* Late Delivery Credit Tiers */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2">
              <div className="font-bold text-[#3A2E25]">Late-Delivery Auto-Credit Tiers</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-orange-100">
                  <div className="text-[11px] text-[#7A6A5C]">10–20 min late:</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="font-bold text-emerald-700">₹</span>
                    <input
                      type="number"
                      value={rules.lateDeliveryTier1Credit}
                      onChange={(e) => updateRule('lateDeliveryTier1Credit', Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 bg-slate-50 border rounded font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400">credit</span>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-orange-100">
                  <div className="text-[11px] text-[#7A6A5C]">20+ min late:</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="font-bold text-emerald-700">₹</span>
                    <input
                      type="number"
                      value={rules.lateDeliveryTier2Credit}
                      onChange={(e) => updateRule('lateDeliveryTier2Credit', Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 bg-slate-50 border rounded font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400">credit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Rule & Cap */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2">
              <div>
                <label className="font-bold text-[#3A2E25] block">Cancellation & Refund Policy</label>
                <div className="mt-1 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-[11px] font-semibold text-orange-900">
                  {rules.refundRule}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/40">
                <span className="text-[#7A6A5C] text-[11px]">Monthly per-customer refund cap:</span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-700">₹</span>
                  <input
                    type="number"
                    value={rules.perCustomerRefundCapMonth}
                    onChange={(e) => updateRule('perCustomerRefundCapMonth', Number(e.target.value))}
                    className="w-16 px-1.5 py-0.5 bg-white border border-orange-200 rounded font-bold text-center"
                  />
                  <span className="text-[10px] text-slate-500">/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Payments, COD Limits & FinTech Underwriting */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-orange-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#3A2E25]">Payments, Cash & Embedded FinTech</h2>
              <p className="text-xs text-[#7A6A5C]">COD fraud prevention and Partner Bank underwriting rules</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* COD Cap and Rider Cash in hand */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-[#3A2E25] block">COD Order Max Cap</label>
                  <span className="text-[#7A6A5C] text-[11px]">Max order value permitted on Cash on Delivery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-700">₹</span>
                  <input
                    type="number"
                    value={rules.codOrderCap}
                    onChange={(e) => updateRule('codOrderCap', Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-white border border-orange-200 rounded font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-orange-200/40">
                <div>
                  <label className="font-bold text-[#3A2E25] block">Daily Rider Cash-in-Hand Cap</label>
                  <span className="text-[#7A6A5C] text-[11px]">App requires UPI deposit before new COD drops</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-700">₹</span>
                  <input
                    type="number"
                    value={rules.dailyRiderCashInHandLimit}
                    onChange={(e) => updateRule('dailyRiderCashInHandLimit', Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-white border border-orange-200 rounded font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Rolling Payout Reserve & No-Fault Rule */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-[#3A2E25] block">Rolling Payout Reserve</label>
                  <span className="text-[#7A6A5C] text-[11px]">Daily settlement escrow retention for chargebacks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={rules.rollingPayoutReservePct}
                    onChange={(e) => updateRule('rollingPayoutReservePct', Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                  />
                  <span className="font-semibold text-slate-500">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-orange-200/40">
                <div>
                  <label className="font-bold text-[#3A2E25] block">No-Fault Rule Absorption</label>
                  <span className="text-[#7A6A5C] text-[11px]">Falcon absorbs first customer refund per partner/month</span>
                </div>
                <button
                  onClick={() => updateRule('noFaultRuleFalconAbsorbsFirstMonthly', !rules.noFaultRuleFalconAbsorbsFirstMonthly)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    rules.noFaultRuleFalconAbsorbsFirstMonthly
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {rules.noFaultRuleFalconAbsorbsFirstMonthly ? 'Active ✓' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Slow Week EMI Protection Cap */}
            <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-[#3A2E25] block">Slow Week EMI Max Revenue Cap</label>
                <span className="text-[#7A6A5C] text-[11px]">Partner bank loan deductions capped at % of weekly revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="10"
                  max="40"
                  value={rules.slowWeekEmiCapPct}
                  onChange={(e) => updateRule('slowWeekEmiCapPct', Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-lg text-center font-bold text-[#3A2E25]"
                />
                <span className="font-semibold text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
