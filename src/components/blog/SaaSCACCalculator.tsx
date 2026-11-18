"use client";

import React, { useState, useId } from "react";
import {
  Calculator,
  TrendingUp,
  Users,
  PieChart,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";

interface ChannelItem {
  id: string;
  name: string;
  spend: number;
  customers: number;
}

export function SaaSCACCalculator() {
  const compId = useId();
  const [activeTab, setActiveTab] = useState<"quick" | "channels" | "payback">("quick");

  // Mode 1: Fully Loaded vs Paid Media Calculator
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "annual">("quarterly");
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(true);

  // Line items (defaulting to the article's worked example)
  const [paidAds, setPaidAds] = useState<number>(18000);
  const [mktgSalaries, setMktgSalaries] = useState<number>(12000);
  const [salesSalaries, setSalesSalaries] = useState<number>(20000);
  const [crmTools, setCrmTools] = useState<number>(3000);
  const [contentFees, setContentFees] = useState<number>(7000);
  const [agencyFees, setAgencyFees] = useState<number>(5000);
  const [customers, setCustomers] = useState<number>(130);

  // Mode 2: Multi-Channel Attribution
  const [channels, setChannels] = useState<ChannelItem[]>([
    { id: "1", name: "Paid Search", spend: 12000, customers: 30 },
    { id: "2", name: "Organic Search", spend: 8000, customers: 40 },
    { id: "3", name: "Outbound Sales", spend: 15000, customers: 15 },
    { id: "4", name: "Partner Referrals", spend: 5000, customers: 15 },
  ]);

  // Mode 3: Payback & LTV:CAC
  const [monthlyArpu, setMonthlyArpu] = useState<number>(120);
  const [grossMarginPct, setGrossMarginPct] = useState<number>(80);
  const [monthlyChurnPct, setMonthlyChurnPct] = useState<number>(2.0);

  // Copied indicator
  const [copied, setCopied] = useState<boolean>(false);

  // Computed Values - Mode 1
  const fullyLoadedSpend =
    paidAds + mktgSalaries + salesSalaries + crmTools + contentFees + agencyFees;
  const paidOnlySpend = paidAds;
  const effectiveSpend = isFullyLoaded ? fullyLoadedSpend : paidOnlySpend;
  const calculatedCac = customers > 0 ? effectiveSpend / customers : 0;
  const paidCac = customers > 0 ? paidOnlySpend / customers : 0;
  const loadedCac = customers > 0 ? fullyLoadedSpend / customers : 0;

  // Computed Values - Mode 2 (Channels)
  const totalChannelSpend = channels.reduce((acc, c) => acc + (Number(c.spend) || 0), 0);
  const totalChannelCustomers = channels.reduce((acc, c) => acc + (Number(c.customers) || 0), 0);
  const blendedChannelCac =
    totalChannelCustomers > 0 ? totalChannelSpend / totalChannelCustomers : 0;

  // Computed Values - Mode 3 (Payback & LTV)
  const monthlyGrossProfit = monthlyArpu * (grossMarginPct / 100);
  const ltv =
    monthlyChurnPct > 0 ? (monthlyGrossProfit / (monthlyChurnPct / 100)) : 0;
  const activeCacForModel = calculatedCac > 0 ? calculatedCac : 500;
  const ltvCacRatio = activeCacForModel > 0 ? ltv / activeCacForModel : 0;
  const paybackMonths =
    monthlyGrossProfit > 0 ? activeCacForModel / monthlyGrossProfit : 0;

  // Reset to default
  const handleReset = () => {
    setPeriod("quarterly");
    setIsFullyLoaded(true);
    setPaidAds(18000);
    setMktgSalaries(12000);
    setSalesSalaries(20000);
    setCrmTools(3000);
    setContentFees(7000);
    setAgencyFees(5000);
    setCustomers(130);
    setChannels([
      { id: "1", name: "Paid Search", spend: 12000, customers: 30 },
      { id: "2", name: "Organic Search", spend: 8000, customers: 40 },
      { id: "3", name: "Outbound Sales", spend: 15000, customers: 15 },
      { id: "4", name: "Partner Referrals", spend: 5000, customers: 15 },
    ]);
    setMonthlyArpu(120);
    setGrossMarginPct(80);
    setMonthlyChurnPct(2.0);
  };

  // Channel helper handlers
  const handleAddChannel = () => {
    const newId = Date.now().toString();
    setChannels([
      ...channels,
      { id: newId, name: `Channel ${channels.length + 1}`, spend: 5000, customers: 10 },
    ]);
  };

  const handleRemoveChannel = (id: string) => {
    if (channels.length <= 1) return;
    setChannels(channels.filter((c) => c.id !== id));
  };

  const handleUpdateChannel = (
    id: string,
    field: "name" | "spend" | "customers",
    value: string | number
  ) => {
    setChannels(
      channels.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Copy Summary
  const handleCopySummary = () => {
    const summary = `--- SaaS CAC Financial Report (${period.toUpperCase()}) ---
CAC Type: ${isFullyLoaded ? "Fully Loaded CAC" : "Paid-Media Only CAC"}
Total Eligible Spend: $${effectiveSpend.toLocaleString()}
New Paying Customers: ${customers}
Calculated CAC: $${calculatedCac.toFixed(2)}
(Paid CAC: $${paidCac.toFixed(2)} | Fully Loaded CAC: $${loadedCac.toFixed(2)})

Unit Economics & Payback:
- Monthly ARPU: $${monthlyArpu}
- Gross Margin: ${grossMarginPct}% ($${monthlyGrossProfit.toFixed(2)} / mo gross profit)
- Monthly Churn: ${monthlyChurnPct}%
- Projected LTV: $${ltv.toFixed(2)}
- LTV:CAC Ratio: ${ltvCacRatio.toFixed(1)}:1
- CAC Payback Period: ${paybackMonths.toFixed(1)} Months

Generated via Modernwebbuild SaaS CAC Calculator (https://modernwebbuild.com/blog/how-to-calculate-saas-cac)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="my-10 bg-white border border-gray-200/90 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600/30 border border-blue-400/30 rounded-xl text-blue-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                Interactive Engineering Tool
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                SaaS Customer Acquisition Cost (CAC) Calculator
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
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
              title="Copy calculation summary"
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
            onClick={() => setActiveTab("quick")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "quick"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>1. Fully Loaded vs. Paid CAC</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("channels")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "channels"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>2. Multi-Channel Attribution</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("payback")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "payback"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>3. Payback & LTV:CAC Velocity</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 bg-gray-50/50">
        {/* TAB 1: QUICK & FULLY LOADED */}
        {activeTab === "quick" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Reporting Scope</h4>
                    <p className="text-xs text-gray-500">
                      Configure your reporting timeframe and expense coverage
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-100 text-xs">
                    {(["monthly", "quarterly", "annual"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                          period === p
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fully Loaded vs Paid Only Toggle */}
                <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                  <div>
                    <div className="text-xs font-bold text-blue-900">
                      Include Salaries, Tools & Agencies?
                    </div>
                    <div className="text-[11px] text-blue-700">
                      {isFullyLoaded
                        ? "Fully Loaded CAC (Recommended: all acquisition costs)"
                        : "Paid-Media Only CAC (Excludes internal team & tools)"}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFullyLoaded}
                      onChange={(e) => setIsFullyLoaded(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Line Items */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                      <label htmlFor={`${compId}-paidAds`}>Paid Advertising (Search, Social, Ads)</label>
                      <span className="text-gray-500 font-mono">${paidAds.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                      <input
                        id={`${compId}-paidAds`}
                        type="number"
                        min="0"
                        value={paidAds}
                        onChange={(e) => setPaidAds(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {isFullyLoaded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <div>
                        <label htmlFor={`${compId}-mktgSalaries`} className="block text-xs font-medium text-gray-700 mb-1">
                          Marketing Salaries & Benefits
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                          <input
                            id={`${compId}-mktgSalaries`}
                            type="number"
                            min="0"
                            value={mktgSalaries}
                            onChange={(e) => setMktgSalaries(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`${compId}-salesSalaries`} className="block text-xs font-medium text-gray-700 mb-1">
                          Sales Salaries & Commissions
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                          <input
                            id={`${compId}-salesSalaries`}
                            type="number"
                            min="0"
                            value={salesSalaries}
                            onChange={(e) => setSalesSalaries(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`${compId}-crmTools`} className="block text-xs font-medium text-gray-700 mb-1">
                          CRM & Marketing Software
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                          <input
                            id={`${compId}-crmTools`}
                            type="number"
                            min="0"
                            value={crmTools}
                            onChange={(e) => setCrmTools(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`${compId}-contentFees`} className="block text-xs font-medium text-gray-700 mb-1">
                          Content & Creative Production
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                          <input
                            id={`${compId}-contentFees`}
                            type="number"
                            min="0"
                            value={contentFees}
                            onChange={(e) => setContentFees(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor={`${compId}-agencyFees`} className="block text-xs font-medium text-gray-700 mb-1">
                          Agency Retainers & Contractors
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                          <input
                            id={`${compId}-agencyFees`}
                            type="number"
                            min="0"
                            value={agencyFees}
                            onChange={(e) => setAgencyFees(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer count */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                      <label htmlFor={`${compId}-customers`} className="flex items-center space-x-1 font-bold text-gray-900">
                        <Users className="w-3.5 h-3.5 text-blue-600 mr-1" />
                        <span>New Paying Customers Acquired</span>
                      </label>
                      <span className="text-blue-600 font-bold">{customers} accounts</span>
                    </div>
                    <input
                      id={`${compId}-customers`}
                      type="number"
                      min="1"
                      value={customers}
                      onChange={(e) => setCustomers(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-sm font-semibold border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      * Count new paying subscription accounts only. Do not include free trials or leads.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  {isFullyLoaded ? "Fully Loaded CAC Result" : "Paid-Media CAC Result"}
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="font-serif text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
                    ${calculatedCac.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/ new customer</span>
                </div>

                {/* Mathematical Formula Preview */}
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-700 space-y-1">
                  <div className="text-gray-400 text-[10px] uppercase font-sans font-semibold">Calculation Breakdown</div>
                  <div>CAC = ${effectiveSpend.toLocaleString()} ÷ {customers}</div>
                  <div className="text-blue-600 font-bold">= ${calculatedCac.toFixed(2)}</div>
                </div>

                {/* Paid vs Fully Loaded Comparison */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-700">Cost Perspective Comparison</div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Paid-Media CAC (Ad spend only):</span>
                    <span className="font-semibold text-gray-900">${paidCac.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                    <span className="text-blue-900 font-medium">Fully Loaded CAC (Full team & tools):</span>
                    <span className="font-bold text-blue-700">${loadedCac.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 leading-snug pt-1">
                    {loadedCac > paidCac ? (
                      <span>
                        Internal team, software, and content multiply your direct media cost by{" "}
                        <strong>{(loadedCac / paidCac).toFixed(1)}x</strong>.
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Cost Distribution Progress Bar */}
                {isFullyLoaded && (
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Ad Spend Share</span>
                      <span className="font-medium">
                        {((paidAds / (fullyLoadedSpend || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${(paidAds / (fullyLoadedSpend || 1)) * 100}%` }}
                        title="Paid Ads"
                      ></div>
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${((mktgSalaries + salesSalaries) / (fullyLoadedSpend || 1)) * 100}%`,
                        }}
                        title="Salaries"
                      ></div>
                      <div
                        className="bg-indigo-400 h-full"
                        style={{
                          width: `${((crmTools + contentFees + agencyFees) / (fullyLoadedSpend || 1)) * 100}%`,
                        }}
                        title="Tools & Agency"
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span> Ads</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Salaries</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></span> Tools/Agencies</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-CHANNEL ATTRIBUTION */}
        {activeTab === "channels" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Channel-Specific Acquisition Performance
                  </h4>
                  <p className="text-xs text-gray-500">
                    Blended CAC hides channel variations. Measure spend and conversions per channel.
                  </p>
                </div>
                <button
                  onClick={handleAddChannel}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Acquisition Channel
                </button>
              </div>

              {/* Channel Table / Inputs */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Channel Name</th>
                      <th className="py-2.5 px-3">Direct Spend ($)</th>
                      <th className="py-2.5 px-3">New Customers</th>
                      <th className="py-2.5 px-3">Channel CAC</th>
                      <th className="py-2.5 px-3">% of Total Acquired</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {channels.map((ch) => {
                      const channelCac = ch.customers > 0 ? ch.spend / ch.customers : 0;
                      const pctOfCustomers =
                        totalChannelCustomers > 0
                          ? ((ch.customers / totalChannelCustomers) * 100).toFixed(0)
                          : "0";
                      return (
                        <tr key={ch.id} className="hover:bg-gray-50/70">
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={ch.name}
                              onChange={(e) => handleUpdateChannel(ch.id, "name", e.target.value)}
                              className="font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-600 focus:outline-none py-0.5"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="relative w-28">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 text-xs">$</span>
                              <input
                                type="number"
                                min="0"
                                value={ch.spend}
                                onChange={(e) =>
                                  handleUpdateChannel(ch.id, "spend", Math.max(0, Number(e.target.value)))
                                }
                                className="w-full pl-5 pr-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min="0"
                              value={ch.customers}
                              onChange={(e) =>
                                handleUpdateChannel(ch.id, "customers", Math.max(0, Number(e.target.value)))
                              }
                              className="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 font-semibold text-gray-900">
                            ${channelCac.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-gray-500">
                            {pctOfCustomers}%
                          </td>
                          <td className="py-3 px-3 text-right">
                            {channels.length > 1 && (
                              <button
                                onClick={() => handleRemoveChannel(ch.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                title="Remove channel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold text-gray-900 bg-gray-50/70">
                      <td className="py-3 px-3">Totals & Blended CAC</td>
                      <td className="py-3 px-3">${totalChannelSpend.toLocaleString()}</td>
                      <td className="py-3 px-3">{totalChannelCustomers} customers</td>
                      <td className="py-3 px-3 text-blue-600 font-extrabold text-sm">
                        ${blendedChannelCac.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">100%</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Strategic Insight Alert */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Channel Decision Rule:</strong> A higher CAC does not automatically make a channel inferior. For instance, Outbound Sales may carry a $1,000 CAC compared to Organic’s $200, but if outbound accounts yield $10,000 ACV enterprise contracts while organic yields $600 self-serve accounts, outbound remains highly lucrative.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYBACK & LTV:CAC */}
        {activeTab === "payback" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Customer Economics & Retention Inputs
                </h4>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-monthlyArpu`}>Monthly ARPU (Average Revenue Per User/Account)</label>
                    <span className="font-mono text-gray-500">${monthlyArpu}/mo</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">$</span>
                    <input
                      id={`${compId}-monthlyArpu`}
                      type="number"
                      min="1"
                      value={monthlyArpu}
                      onChange={(e) => setMonthlyArpu(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-grossMarginPct`}>Gross Margin % (Revenue minus Hosting, APIs & Support)</label>
                    <span className="font-semibold text-blue-600">{grossMarginPct}%</span>
                  </div>
                  <input
                    id={`${compId}-grossMarginPct`}
                    type="range"
                    min="20"
                    max="95"
                    step="1"
                    value={grossMarginPct}
                    onChange={(e) => setGrossMarginPct(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>20% (Services heavy)</span>
                    <span>75%-85% (Typical pure SaaS)</span>
                    <span>95% (Infra scale)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <label htmlFor={`${compId}-monthlyChurnPct`}>Monthly Customer Churn Rate %</label>
                    <span className="font-semibold text-red-600">{monthlyChurnPct}%</span>
                  </div>
                  <input
                    id={`${compId}-monthlyChurnPct`}
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={monthlyChurnPct}
                    onChange={(e) => setMonthlyChurnPct(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>0.5% (Enterprise sticky)</span>
                    <span>2.0% (Healthy B2B)</span>
                    <span>5.0%+ (SMB churn risk)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payback Diagnostics Card */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    CAC Payback Period
                  </div>
                  <div className="mt-1 flex items-baseline space-x-2">
                    <span className="font-serif text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
                      {paybackMonths.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-gray-500">months to cash break-even</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formula: ${activeCacForModel.toFixed(0)} CAC ÷ (${monthlyArpu} × {grossMarginPct}% = ${monthlyGrossProfit.toFixed(1)} gross profit/mo)
                  </p>
                </div>

                {/* Health Badge */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs ${
                    paybackMonths <= 12
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : paybackMonths <= 18
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  {paybackMonths <= 12 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-bold">
                      {paybackMonths <= 12
                        ? "Optimal Capital Velocity (<12 Months)"
                        : paybackMonths <= 18
                        ? "Manageable Payback (12-18 Months)"
                        : "High Cash Runway Risk (>18 Months)"}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      {paybackMonths <= 12
                        ? "Recovers acquisition investment quickly, allowing reinvestment back into marketing."
                        : paybackMonths <= 18
                        ? "Standard for enterprise contracts with multi-year upfront billing."
                        : "Requires significant external working capital to sustain customer growth."}
                    </div>
                  </div>
                </div>

                {/* LTV & LTV:CAC Ratio */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] uppercase font-semibold text-gray-400">Customer Lifetime Value (LTV)</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">${ltv.toFixed(0)}</div>
                    <div className="text-[10px] text-gray-500">Gross-margin adjusted</div>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                    <div className="text-[10px] uppercase font-semibold text-blue-700">LTV : CAC Ratio</div>
                    <div className="text-lg font-bold text-blue-900 mt-1">{ltvCacRatio.toFixed(1)} : 1</div>
                    <div className="text-[10px] text-blue-600">Target benchmark is 3:1+</div>
                  </div>
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
              <strong>Private &amp; Client-Side:</strong> All calculations execute in your browser. No financial data is sent to external servers or analytics.
            </span>
          </div>
          <div>Modernwebbuild Engineering Resources</div>
        </div>
      </div>
    </div>
  );
}
