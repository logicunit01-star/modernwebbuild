"use client";

import React, { useState, useId } from "react";
import {
  Calculator,
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CohortMonth {
  month: number;
  retentionPct: number;
}

export function SaaSLTVCalculator() {
  const compId = useId();
  const [activeTab, setActiveTab] = useState<"churn" | "cohort" | "benchmarks">("churn");

  // Inputs for Churn Shortcut Model
  const [monthlyArpa, setMonthlyArpa] = useState<number>(150);
  const [grossMarginPct, setGrossMarginPct] = useState<number>(80);
  const [monthlyChurnPct, setMonthlyChurnPct] = useState<number>(3.0);
  const [cac, setCac] = useState<number>(900);

  // Inputs for Cohort Retention Model (Month 0 to Month 5)
  const [cohort, setCohort] = useState<CohortMonth[]>([
    { month: 0, retentionPct: 100 },
    { month: 1, retentionPct: 90 },
    { month: 2, retentionPct: 82 },
    { month: 3, retentionPct: 76 },
    { month: 4, retentionPct: 70 },
    { month: 5, retentionPct: 66 },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  // Computed Values - Churn Model
  const safeChurn = Math.max(0.001, monthlyChurnPct / 100);
  const monthlyGrossProfit = monthlyArpa * (grossMarginPct / 100);
  const avgLifetimeMonths = 1 / safeChurn;
  const grossProfitLtv = monthlyGrossProfit / safeChurn;
  const revenueLtv = monthlyArpa / safeChurn;
  const safeCac = Math.max(1, cac);
  const ltvCacRatio = grossProfitLtv / safeCac;
  const cacPaybackMonths = monthlyGrossProfit > 0 ? safeCac / monthlyGrossProfit : 0;

  // Computed Values - Cohort Model
  const activeCustomerMonths = cohort.reduce(
    (acc, m) => acc + (Number(m.retentionPct) || 0) / 100,
    0
  );
  const cohortGrossProfitRealized = activeCustomerMonths * monthlyGrossProfit;
  const cohortCacRecoveredPct = Math.min(
    100,
    (cohortGrossProfitRealized / safeCac) * 100
  );

  // Handlers
  const handleReset = () => {
    setMonthlyArpa(150);
    setGrossMarginPct(80);
    setMonthlyChurnPct(3.0);
    setCac(900);
    setCohort([
      { month: 0, retentionPct: 100 },
      { month: 1, retentionPct: 90 },
      { month: 2, retentionPct: 82 },
      { month: 3, retentionPct: 76 },
      { month: 4, retentionPct: 70 },
      { month: 5, retentionPct: 66 },
    ]);
  };

  const handleCohortChange = (index: number, val: number) => {
    const updated = [...cohort];
    updated[index].retentionPct = Math.max(0, Math.min(100, val));
    setCohort(updated);
  };

  const handleCopySummary = () => {
    const summary = `--- SaaS Customer Lifetime Value (LTV) Executive Report ---
Methodology: Churn-Based Gross-Profit LTV
Inputs:
- Monthly ARPA: $${monthlyArpa}
- Gross Margin: ${grossMarginPct}%
- Monthly Customer Churn: ${monthlyChurnPct}%
- Fully Loaded CAC: $${cac}

Core Outputs:
- Expected Customer Lifetime: ${avgLifetimeMonths.toFixed(1)} Months
- Gross-Profit LTV: $${grossProfitLtv.toFixed(2)}
- Top-line Revenue LTV: $${revenueLtv.toFixed(2)} (Overstates margin by $${(revenueLtv - grossProfitLtv).toFixed(2)})
- LTV : CAC Ratio: ${ltvCacRatio.toFixed(2)}:1 (${ltvCacRatio >= 3 ? "Healthy Planning Benchmark" : "High Acquisition Risk"})
- CAC Payback Period: ${cacPaybackMonths.toFixed(1)} Months

Observed 6-Month Cohort Trajectory:
- Active Customer-Months Delivered: ${activeCustomerMonths.toFixed(2)} Months
- Cumulative Gross Profit Realized: $${cohortGrossProfitRealized.toFixed(2)} (${cohortCacRecoveredPct.toFixed(0)}% of CAC recovered in initial 6 months)

Generated via Modernwebbuild SaaS LTV Calculator (https://modernwebbuild.com/blog/saas-customer-lifetime-value)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="my-10 bg-white border border-gray-200/90 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-600/30 border border-indigo-400/30 rounded-xl text-indigo-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Financial Architecture Tool
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                SaaS Customer Lifetime Value (LTV) Calculator
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
              title="Reset to article example"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Example
            </button>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              title="Copy calculation report"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 border-b border-slate-700/80 pb-px text-sm">
          <button
            onClick={() => setActiveTab("churn")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "churn"
                ? "bg-slate-800 text-white border-indigo-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>1. Churn Shortcut Model</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("cohort")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "cohort"
                ? "bg-slate-800 text-white border-indigo-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>2. Cohort Retention Model</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("benchmarks")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "benchmarks"
                ? "bg-slate-800 text-white border-indigo-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>3. LTV:CAC Benchmarks</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 bg-gray-50/50">
        {/* TAB 1: CHURN SHORTCUT MODEL */}
        {activeTab === "churn" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm font-bold text-gray-900">Model Input Parameters</h4>
                  <p className="text-xs text-gray-500">
                    Calculates gross-profit-adjusted LTV based on recurring revenue and churn rate.
                  </p>
                </div>

                {/* ARPA */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-monthlyArpa`} className="font-semibold text-gray-900">
                      Monthly ARPA (Average Revenue Per Account)
                    </label>
                    <span className="font-mono text-gray-500">${monthlyArpa} / mo</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                    <input
                      id={`${compId}-monthlyArpa`}
                      type="number"
                      min="1"
                      value={monthlyArpa}
                      onChange={(e) => setMonthlyArpa(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    MRR divided by total paying accounts (e.g., $150).
                  </p>
                </div>

                {/* Gross Margin Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-grossMarginPct`} className="font-semibold text-gray-900">
                      Gross Margin % (Revenue minus Hosting, APIs & Support)
                    </label>
                    <span className="font-bold text-indigo-600">{grossMarginPct}%</span>
                  </div>
                  <input
                    id={`${compId}-grossMarginPct`}
                    type="range"
                    min="20"
                    max="95"
                    step="1"
                    value={grossMarginPct}
                    onChange={(e) => setGrossMarginPct(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>20% (Services/API heavy)</span>
                    <span>80% (Pure SaaS benchmark)</span>
                    <span>95% (Infra scale)</span>
                  </div>
                </div>

                {/* Churn Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-monthlyChurnPct`} className="font-semibold text-gray-900">
                      Monthly Customer Logo Churn Rate %
                    </label>
                    <span className="font-bold text-red-600">{monthlyChurnPct}%</span>
                  </div>
                  <input
                    id={`${compId}-monthlyChurnPct`}
                    type="range"
                    min="0.2"
                    max="10"
                    step="0.1"
                    value={monthlyChurnPct}
                    onChange={(e) => setMonthlyChurnPct(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>0.5% (Enterprise sticky)</span>
                    <span>3.0% (Worked example)</span>
                    <span>8.0%+ (Early churn cliff)</span>
                  </div>
                </div>

                {/* CAC Input */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-cac`} className="font-semibold text-gray-900">
                      Fully Loaded Customer Acquisition Cost (CAC)
                    </label>
                    <span className="font-mono text-gray-500">${cac}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                    <input
                      id={`${compId}-cac`}
                      type="number"
                      min="1"
                      value={cac}
                      onChange={(e) => setCac(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Used to benchmark your LTV:CAC ratio and cash payback velocity.
                  </p>
                </div>
              </div>

              {/* Churn Assumption Disclaimer */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Model Limitation Warning:</strong> The churn shortcut (1 ÷ Churn) assumes an infinitely stable, steady-state customer base. It can drastically overstate value if churn spikes in early months. Validate against rolling cohort curves.
                </div>
              </div>
            </div>

            {/* Results Display Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    Gross-Profit Adjusted LTV
                  </div>
                  <div className="mt-1 flex items-baseline space-x-2">
                    <span className="font-serif text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
                      ${grossProfitLtv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-sm font-medium text-gray-500">/ account lifetime</span>
                  </div>
                </div>

                {/* Mathematical Formula Preview */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-700 space-y-1">
                  <div className="text-gray-400 text-[10px] uppercase font-sans font-semibold">Mathematical Derivation</div>
                  <div>Monthly Contribution: ${monthlyArpa} × {grossMarginPct}% = ${monthlyGrossProfit.toFixed(2)}</div>
                  <div>Avg Lifetime: 1 ÷ {monthlyChurnPct}% = {avgLifetimeMonths.toFixed(1)} Months</div>
                  <div className="text-indigo-600 font-bold">LTV = ${monthlyGrossProfit.toFixed(2)} ÷ {safeChurn} = ${grossProfitLtv.toFixed(2)}</div>
                </div>

                {/* Overinflated Revenue LTV Warning */}
                <div className="p-3 bg-red-50/60 border border-red-100 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-red-900">
                    <span>Revenue-Only LTV:</span>
                    <span>${revenueLtv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-[11px] text-red-700 leading-snug">
                    Ignoring COGS inflates customer value by <strong>${(revenueLtv - grossProfitLtv).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>, risking fatal overspending on customer acquisition.
                  </p>
                </div>

                {/* LTV:CAC & Payback */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg">
                    <div className="text-[10px] uppercase font-semibold text-indigo-700">LTV : CAC Ratio</div>
                    <div className="text-xl font-black text-indigo-950 mt-1">{ltvCacRatio.toFixed(1)} : 1</div>
                    <div className="text-[10px] text-indigo-600">Benchmark: 3:1+</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] uppercase font-semibold text-gray-500">CAC Payback</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{cacPaybackMonths.toFixed(1)} mo</div>
                    <div className="text-[10px] text-gray-500">Target: &lt;12 mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COHORT RETENTION MODEL */}
        {activeTab === "cohort" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Observed Customer Retention Curve
                  </h4>
                  <p className="text-xs text-gray-500">
                    Enter the percentage of accounts remaining active each month to calculate actual customer-months.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
                  6-Month Cumulative Window
                </div>
              </div>

              {/* Monthly Input Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {cohort.map((item, idx) => (
                  <div key={item.month} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-gray-700 flex justify-between">
                      <span>Month {item.month}</span>
                      {item.month === 0 && <span className="text-[10px] text-indigo-600 uppercase font-bold">Base</span>}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={item.month === 0}
                        value={item.retentionPct}
                        onChange={(e) => handleCohortChange(idx, Number(e.target.value))}
                        className={`w-full pr-6 pl-2.5 py-1 text-sm font-semibold rounded-lg border ${
                          item.month === 0
                            ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-900 border-gray-300 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                        }`}
                      />
                      <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 text-xs">%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.retentionPct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cohort Summary Metrics */}
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer-Months Delivered
                  </div>
                  <div className="text-2xl font-black text-gray-950 mt-1">
                    {activeCustomerMonths.toFixed(2)} Months
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Sum of active retention proportions (M0–M5)
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                  <div className="text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Realized Gross Profit (M0–M5)
                  </div>
                  <div className="text-2xl font-black text-indigo-950 mt-1">
                    ${cohortGrossProfitRealized.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-indigo-700 mt-1">
                    ${monthlyGrossProfit.toFixed(0)}/mo contribution × {activeCustomerMonths.toFixed(2)} mo
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    CAC Recovery in 6 Months
                  </div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    {cohortCacRecoveredPct.toFixed(0)}%
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    ${cohortGrossProfitRealized.toFixed(0)} of ${safeCac} CAC recovered
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BENCHMARKS */}
        {activeTab === "benchmarks" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                LTV:CAC Health &amp; Operational Action Matrix
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Below 1:1 (Capital Destructive)</span>
                  </div>
                  <p className="text-xs text-red-900 mt-2 leading-relaxed">
                    Customer lifetime gross profit is lower than the cost to acquire them. Every new customer burns cash. Halt paid acquisition immediately; re-evaluate pricing, onboarding, and churn.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>1:1 to 2:1 (Fragile Economics)</span>
                  </div>
                  <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                    Accounts return slightly more than CAC, but leave inadequate gross margin to cover engineering R&amp;D, general operations, or expansion. Trim acquisition waste and improve retention.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>3:1 to 4:1 (Healthy Planning Reference)</span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                    The standard planning reference for sustainable venture-backed or bootstrapped SaaS. Balances growth investment with healthy operating gross margin.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Above 5:1 (High Efficiency or Under-Investment)</span>
                  </div>
                  <p className="text-xs text-blue-900 mt-2 leading-relaxed">
                    Indicates phenomenal unit economics—or a sign the company is severely under-investing in marketing expansion and leaving addressable market share to competitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Security / Privacy Guarantee */}
        <div className="mt-8 pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Private &amp; Client-Side:</strong> All calculations execute strictly in your local browser. No financial data is ever transmitted to external servers.
            </span>
          </div>
          <div>Modernwebbuild Financial Engineering Resources</div>
        </div>
      </div>
    </div>
  );
}
