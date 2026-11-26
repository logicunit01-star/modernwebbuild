"use client";

import React, { useState, useMemo } from "react";
import {
  Server,
  Laptop,
  Layers,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Activity,
  Code2,
  Database,
  Sparkles,
  RefreshCw,
} from "lucide-react";

type ActiveTab = "decision" | "bundle-calculator" | "composition";

interface Requirement {
  id: string;
  label: string;
  description: string;
  category: "server" | "client";
  icon: React.ReactNode;
}

const REQUIREMENTS: Requirement[] = [
  {
    id: "db_access",
    label: "Direct Database or ORM Access",
    description: "Queries Prisma, Drizzle, Mongoose, or internal database pools directly.",
    category: "server",
    icon: <Database className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: "secret_keys",
    label: "Private API Keys / Server Secrets",
    description: "Uses backend credentials (e.g., STRIPE_SECRET_KEY, OpenAI API key) that must never touch the browser.",
    category: "server",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: "large_deps",
    label: "Heavy Backend Packages / Utilities",
    description: "Markdown parsers, syntax highlighters, or sanitizers that should not bloat client bundles.",
    category: "server",
    icon: <Server className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: "react_state",
    label: "React State Hooks (useState, useReducer)",
    description: "Maintains local component state that changes as users interact.",
    category: "client",
    icon: <Activity className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "effects",
    label: "Lifecycle & Side-Effects (useEffect)",
    description: "Runs timers, subscriptions, observers, or DOM synchronization on mount/update.",
    category: "client",
    icon: <RefreshCw className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "event_handlers",
    label: "DOM Event Handlers (onClick, onChange, onSubmit)",
    description: "Directly handles click, input, form submission, or touch interactions in the browser.",
    category: "client",
    icon: <Zap className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "browser_apis",
    label: "Browser-Only APIs (window, localStorage, navigator)",
    description: "Reads window dimensions, local storage, geolocation, or clipboard directly.",
    category: "client",
    icon: <Laptop className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "interactive_ui",
    label: "Interactive UI Controls (Modals, Dropdowns, Tabs)",
    description: "Toggles open/close visibility, tab selection, or accordions on user click.",
    category: "client",
    icon: <Layers className="w-4 h-4 text-sky-400" />,
  },
];

export function NextJSComponentArchitectTool() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("decision");

  // Tab 1 State
  const [selectedReqs, setSelectedReqs] = useState<Record<string, boolean>>({
    db_access: true,
    secret_keys: true,
  });
  const [componentName, setComponentName] = useState<string>("ProductShowcase");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Tab 2 State (Bundle & Hydration Simulator)
  const [clientComponentCount, setClientComponentCount] = useState<number>(6);
  const [includedLibraries, setIncludedLibraries] = useState<Record<string, boolean>>({
    chartjs: false,
    framer: true,
    richtext: false,
    datefns: true,
  });
  const [networkSpeed, setNetworkSpeed] = useState<"4g" | "3g" | "wifi">("4g");
  const [cpuTier, setCpuTier] = useState<"mobile_budget" | "mobile_mid" | "desktop">("mobile_mid");

  // Tab 3 State (Composition Pattern)
  const [copiedPattern, setCopiedPattern] = useState<boolean>(false);

  // Toggle Requirement
  const toggleReq = (id: string) => {
    setSelectedReqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Determine Component Recommendation
  const recommendation = useMemo(() => {
    const hasServerReqs =
      selectedReqs["db_access"] || selectedReqs["secret_keys"] || selectedReqs["large_deps"];
    const hasClientReqs =
      selectedReqs["react_state"] ||
      selectedReqs["effects"] ||
      selectedReqs["event_handlers"] ||
      selectedReqs["browser_apis"] ||
      selectedReqs["interactive_ui"];

    if (hasServerReqs && hasClientReqs) {
      return {
        type: "composite",
        badge: "Composite Island Architecture",
        badgeColor: "bg-purple-900/60 border-purple-500/50 text-purple-300",
        summary:
          "Splitting Required: Do not make this a monolithic Client Component! Keep data fetching and secrets in a Server Component shell, and extract interactive handlers into client leaf components.",
        recommendation:
          "Render the page/shell as an async Server Component to query your database and pass serializable props (or children slots) down to a lightweight 'use client' component.",
        isClient: false,
        bundlePenalty: "0 KB for shell (interactive leaf hydrates ~4-8 KB)",
      };
    }

    if (hasClientReqs) {
      return {
        type: "client",
        badge: "Client Component ('use client')",
        badgeColor: "bg-sky-900/60 border-sky-500/50 text-sky-300",
        summary:
          "Client Component Required: This component relies on browser state, event handlers, or browser APIs.",
        recommendation:
          "Add 'use client' at the top of this file. Keep it at the smallest practical leaf boundary to prevent its parent tree from entering the client module graph.",
        isClient: true,
        bundlePenalty: "Hydrated on client (~6-18 KB JS bundle)",
      };
    }

    return {
      type: "server",
      badge: "React Server Component (Default)",
      badgeColor: "bg-emerald-900/60 border-emerald-500/50 text-emerald-300",
      summary:
        "Pure Server Component: 100% server-side execution with ZERO client-side JavaScript bundle footprint.",
      recommendation:
        "No 'use client' directive needed. You can fetch data directly with async/await, query databases, and read private environment variables with zero hydration cost.",
      isClient: false,
      bundlePenalty: "0 KB JavaScript sent to browser (Pure HTML)",
    };
  }, [selectedReqs]);

  // Generate Dynamic Code Snippet
  const generatedCode = useMemo(() => {
    const safeName = componentName.trim().replace(/\s+/g, "") || "CustomComponent";

    if (recommendation.type === "composite") {
      return `// 1. Server Component Shell: src/app/${safeName.toLowerCase()}/page.tsx
import { db } from "@/lib/db";
import { ${safeName}InteractiveControls } from "./interactive-controls";

export default async function ${safeName}Page() {
  // Direct server-side data fetching with zero client bundle overhead
  const data = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">${safeName} Catalog</h1>
      
      {/* Interactive client controls passed serializable server data */}
      <${safeName}InteractiveControls initialItems={data} />
    </main>
  );
}

// 2. Client Leaf Component: src/app/${safeName.toLowerCase()}/interactive-controls.tsx
"use client";

import { useState } from "react";

interface Item {
  id: string;
  name: string;
  price: number;
}

export function ${safeName}InteractiveControls({ initialItems }: { initialItems: Item[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {initialItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className="p-4 rounded-lg border text-left hover:bg-slate-50 transition"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">\${item.price.toFixed(2)}</p>
          </button>
        ))}
      </div>
      {selectedId && <p className="text-sm text-emerald-600">Selected Item ID: {selectedId}</p>}
    </div>
  );
}`;
    }

    if (recommendation.type === "client") {
      return `"use client";

import React, { useState } from "react";

export function ${safeName}() {
  const [count, setCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleAction = () => {
    setCount((prev) => prev + 1);
    setIsActive(true);
  };

  return (
    <div className="p-6 rounded-xl border border-slate-700 bg-slate-900 text-slate-100">
      <h3 className="text-lg font-semibold mb-2">${safeName} (Client Interactive)</h3>
      <p className="text-sm text-slate-400 mb-4">Interactions: {count}</p>
      <button
        onClick={handleAction}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm transition"
      >
        Trigger Action
      </button>
    </div>
  );
}`;
    }

    return `// src/app/components/${safeName.toLowerCase()}.tsx
// React Server Component (Default in Next.js App Router)
import { db } from "@/lib/db";

export async function ${safeName}() {
  // Directly query your database without an extra API route
  const records = await db.article.findMany({
    take: 5,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-100">
      <h2 className="text-xl font-bold mb-4">${safeName} (0 KB Client Bundle)</h2>
      <ul className="space-y-2">
        {records.map((record) => (
          <li key={record.id} className="p-3 bg-slate-800/60 rounded-lg">
            <h3 className="font-semibold">{record.title}</h3>
            <p className="text-xs text-slate-400">{record.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`;
  }, [componentName, recommendation]);

  // Tab 2: Bundle & Hydration Metrics Calculation
  const bundleMetrics = useMemo(() => {
    const basePerComponentKb = 4.2; // average client component JS footprint
    let libKb = 0;
    if (includedLibraries["chartjs"]) libKb += 150;
    if (includedLibraries["framer"]) libKb += 92;
    if (includedLibraries["richtext"]) libKb += 220;
    if (includedLibraries["datefns"]) libKb += 38;

    const totalClientJsKb = Math.round(clientComponentCount * basePerComponentKb + libKb);

    // Speed multiplier (KB/s)
    let speedKbPerSec = 1500; // 4G ~ 1.5MB/s mobile throttled
    if (networkSpeed === "3g") speedKbPerSec = 350;
    if (networkSpeed === "wifi") speedKbPerSec = 8000;

    const downloadTimeMs = Math.round((totalClientJsKb / speedKbPerSec) * 1000);

    // CPU parse + hydration multiplier per KB
    let cpuHydrateMsPerKb = 0.85; // Mid-range phone
    if (cpuTier === "mobile_budget") cpuHydrateMsPerKb = 2.4;
    if (cpuTier === "desktop") cpuHydrateMsPerKb = 0.25;

    const hydrationTimeMs = Math.round(totalClientJsKb * cpuHydrateMsPerKb);
    const totalTbtImpactMs = Math.round(hydrationTimeMs * 0.75);

    // Theoretical savings if non-interactive parts are RSC
    const rscSavingsKb = Math.round(totalClientJsKb * 0.62);
    const rscTimeSavedMs = Math.round(hydrationTimeMs * 0.62 + downloadTimeMs * 0.62);

    let inpRating = "Good (≤ 200ms)";
    let inpColor = "text-emerald-400";
    if (totalTbtImpactMs > 350) {
      inpRating = "Poor (> 500ms risk)";
      inpColor = "text-red-400";
    } else if (totalTbtImpactMs > 150) {
      inpRating = "Needs Improvement";
      inpColor = "text-amber-400";
    }

    return {
      totalClientJsKb,
      downloadTimeMs,
      hydrationTimeMs,
      totalTbtImpactMs,
      rscSavingsKb,
      rscTimeSavedMs,
      inpRating,
      inpColor,
    };
  }, [clientComponentCount, includedLibraries, networkSpeed, cpuTier]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPattern = () => {
    const patternCode = `// Modal Client Wrapper: src/components/Modal.tsx
"use client";

import { useState } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 rounded">
        Open Cart
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-lg w-full">
            <button onClick={() => setOpen(false)} className="text-sm text-gray-400 float-right">
              ✕ Close
            </button>
            {/* Server Component rendered as children slot: 0 KB JS bundled! */}
            {children}
          </div>
        </div>
      )}
    </>
  );
}

// Server Component: src/components/CartSummary.tsx
import { db } from "@/lib/db";

export async function CartSummary() {
  const cart = await db.cart.findFirst({ include: { items: true } });
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Cart Contents</h3>
      <p>Items in cart: {cart?.items.length ?? 0}</p>
    </div>
  );
}

// Parent Page (Server Component): src/app/page.tsx
import { Modal } from "@/components/Modal";
import { CartSummary } from "@/components/CartSummary";

export default function Page() {
  return (
    <main className="p-8">
      <h1>Storefront</h1>
      <Modal>
        {/* Passed as children prop: remains an unhydrated Server Component! */}
        <CartSummary />
      </Modal>
    </main>
  );
}`;
    navigator.clipboard.writeText(patternCode);
    setCopiedPattern(true);
    setTimeout(() => setCopiedPattern(false), 2000);
  };

  return (
    <section
      className="my-12 rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 text-slate-100 shadow-2xl relative overflow-hidden"
      aria-label="Next.js Component Architecture & Hydration Studio"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Engineering Studio • Next.js 15 & React 19</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Component Architect & Hydration Simulator
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Evaluate component boundaries, compute client-side bundle weight, simulate mobile main-thread hydration, and generate production-hardened composition patterns.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Client-Side Simulation</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800/80 mt-6 text-sm overflow-x-auto relative z-10">
        <button
          onClick={() => setActiveTab("decision")}
          className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "decision"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>1. Component Decision Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("bundle-calculator")}
          className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "bundle-calculator"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>2. Bundle & Hydration Cost Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("composition")}
          className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "composition"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Slot Composition Pattern</span>
        </button>
      </div>

      {/* TAB 1: COMPONENT DECISION ENGINE */}
      {activeTab === "decision" && (
        <div className="mt-8 space-y-8 relative z-10">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Step 1: Define Component Capabilities</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check all requirements that apply to the component you are architecting.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="comp-name" className="text-xs text-slate-400 whitespace-nowrap">
                  Component Name:
                </label>
                <input
                  id="comp-name"
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. ProductGrid"
                />
              </div>
            </div>

            {/* Capability Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {REQUIREMENTS.map((req) => {
                const isSelected = !!selectedReqs[req.id];
                return (
                  <div
                    key={req.id}
                    onClick={() => toggleReq(req.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 select-none ${
                      isSelected
                        ? req.category === "server"
                          ? "bg-emerald-950/30 border-emerald-500/60 shadow-sm shadow-emerald-900/20"
                          : "bg-sky-950/30 border-sky-500/60 shadow-sm shadow-sky-900/20"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isSelected ? (
                        <CheckCircle2
                          className={`w-5 h-5 ${
                            req.category === "server" ? "text-emerald-400" : "text-sky-400"
                          }`}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-800" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {req.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                            req.category === "server"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                          }`}
                        >
                          {req.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {req.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-5 rounded-xl border bg-slate-900/90 border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Architectural Verdict:
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${recommendation.badgeColor}`}
                >
                  {recommendation.badge}
                </span>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono">
                Payload impact: <strong className="text-white">{recommendation.bundlePenalty}</strong>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {recommendation.summary}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Best Practice Implementation:</strong> {recommendation.recommendation}
            </p>
          </div>

          {/* Generated Code Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Generated Next.js 15 Implementation</span>
              </h4>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-mono overflow-x-auto leading-relaxed max-h-[380px]">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: BUNDLE & HYDRATION COST SIMULATOR */}
      {activeTab === "bundle-calculator" && (
        <div className="mt-8 space-y-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="flex items-center justify-between text-sm font-semibold text-white mb-2">
                  <span>Number of Client Components on Page</span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono text-xs border border-blue-500/30">
                    {clientComponentCount} components
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={clientComponentCount}
                  onChange={(e) => setClientComponentCount(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>0 (Pure RSC)</span>
                  <span>15 (Balanced)</span>
                  <span>30 (Heavy SPA)</span>
                </div>
              </div>

              {/* Third-Party Client Libraries */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white block">
                  Third-Party Client-Side Packages Included
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { key: "chartjs", name: "Chart.js / Recharts", size: "+150 KB" },
                    { key: "framer", name: "Framer Motion", size: "+92 KB" },
                    { key: "richtext", name: "Monaco / Rich Text Editor", size: "+220 KB" },
                    { key: "datefns", name: "Moment / Date-fns Client", size: "+38 KB" },
                  ].map((lib) => (
                    <label
                      key={lib.key}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                        includedLibraries[lib.key]
                          ? "bg-blue-950/40 border-blue-500/50 text-white"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-medium">{lib.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {lib.size}
                      </span>
                      <input
                        type="checkbox"
                        checked={includedLibraries[lib.key]}
                        onChange={() =>
                          setIncludedLibraries((prev) => ({
                            ...prev,
                            [lib.key]: !prev[lib.key],
                          }))
                        }
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Hardware & Network Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Client Device CPU Tier
                  </label>
                  <select
                    value={cpuTier}
                    onChange={(e) =>
                      setCpuTier(
                        e.target.value as "mobile_budget" | "mobile_mid" | "desktop"
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="mobile_budget">Budget Mobile (Slow Core)</option>
                    <option value="mobile_mid">Mid-Range Mobile (Average)</option>
                    <option value="desktop">High-End Laptop / Desktop</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Network Profile
                  </label>
                  <select
                    value={networkSpeed}
                    onChange={(e) =>
                      setNetworkSpeed(e.target.value as "4g" | "3g" | "wifi")
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="4g">4G Mobile (~1.5 MB/s)</option>
                    <option value="3g">Throttled 3G (~350 KB/s)</option>
                    <option value="wifi">Fast Broadband / Wi-Fi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Metrics Output Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Computed Real-World Performance Impact</span>
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Client JS Bundle
                    </span>
                    <span className="text-2xl font-mono font-bold text-white">
                      {bundleMetrics.totalClientJsKb} <span className="text-xs text-slate-400 font-sans">KB</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Hydration Block Time
                    </span>
                    <span className="text-2xl font-mono font-bold text-amber-300">
                      ~{bundleMetrics.hydrationTimeMs} <span className="text-xs text-slate-400 font-sans">ms</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Network Download Time
                    </span>
                    <span className="text-2xl font-mono font-bold text-slate-200">
                      ~{bundleMetrics.downloadTimeMs} <span className="text-xs text-slate-400 font-sans">ms</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      INP Risk Assessment
                    </span>
                    <span className={`text-base font-bold font-mono ${bundleMetrics.inpColor}`}>
                      {bundleMetrics.inpRating}
                    </span>
                  </div>
                </div>

                {/* Savings Callout */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5 text-emerald-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Server Components Architecture Dividend</span>
                  </div>
                  <p className="text-emerald-300/80 leading-relaxed">
                    By keeping non-interactive sections in Server Components, you prevent{" "}
                    <strong>{bundleMetrics.rscSavingsKb} KB</strong> of JavaScript from loading, saving{" "}
                    <strong>~{bundleMetrics.rscTimeSavedMs} ms</strong> of main-thread CPU parsing on mobile devices!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SLOT COMPOSITION PATTERN */}
      {activeTab === "composition" && (
        <div className="mt-8 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                How to Interleave Server and Client Components
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The most important Next.js architectural secret: passing a Server Component into a Client Component without hydrating it.
              </p>
            </div>

            <button
              onClick={handleCopyPattern}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition self-start sm:self-auto"
            >
              {copiedPattern ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Pattern Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Slot Pattern</span>
                </>
              )}
            </button>
          </div>

          {/* Visual Architecture Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-red-900/40 bg-red-950/20 space-y-3">
              <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                <XCircle className="w-4 h-4" />
                <span>Anti-Pattern: Monolithic &apos;use client&apos; Shell</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Importing a component directly inside a <code>&quot;use client&quot;</code> file automatically converts that child into a Client Component, pulling all its dependencies into the browser bundle.
              </p>
              <div className="p-3 bg-slate-900/90 rounded-lg font-mono text-[11px] text-red-300 border border-red-900/30">
                {`"use client";\nimport { ServerReport } from "./report"; // ⚠️ FORCED INTO CLIENT BUNDLE!`}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Best Practice: React Slot (children prop)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pass the Server Component as <code>children</code> from a Server Component parent. Next.js executes it on the server and passes the pre-rendered virtual DOM to the client shell!
              </p>
              <div className="p-3 bg-slate-900/90 rounded-lg font-mono text-[11px] text-emerald-300 border border-emerald-900/30">
                {`// Server Page\n<ClientModal>\n  <ServerReport /> {/* Stays 0 KB on Server! */}\n</ClientModal>`}
              </div>
            </div>
          </div>

          {/* Architectural Diagram Representation */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Visual Execution Boundary
            </h4>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Server className="w-4 h-4" />
                <span>Page.tsx [Server Component] — Fetches DB, 0 KB Bundle</span>
              </div>
              <div className="pl-6 border-l border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400">
                  <Laptop className="w-4 h-4" />
                  <span>└── &lt;Modal&gt; [Client Component with &apos;use client&apos;] — Manages open/close state</span>
                </div>
                <div className="pl-6 border-l border-slate-800">
                  <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                    <Server className="w-4 h-4" />
                    <span>└── &lt;CartSummary /&gt; [Server Component passed as children] — 0 KB Client JS!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
