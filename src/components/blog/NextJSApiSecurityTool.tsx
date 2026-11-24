"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Cpu,
  Lock,
  Flame,
} from "lucide-react";

interface AuditItem {
  id: string;
  title: string;
  description: string;
  owasp: string;
  weight: number;
}

const AUDIT_ITEMS: AuditItem[] = [
  {
    id: "auth",
    title: "Server-Side Session Verification",
    description: "Every protected Route Handler verifies authentication on the server; no reliance on hidden frontend buttons.",
    owasp: "API2:2023 Broken Authentication",
    weight: 20,
  },
  {
    id: "bola",
    title: "Resource Ownership Scoping (BOLA Prevention)",
    description: "Database queries enforce ownership condition (e.g. where: { id, ownerId }) to prevent IDOR/BOLA attacks.",
    owasp: "API1:2023 Broken Object Level Authorization",
    weight: 20,
  },
  {
    id: "zod",
    title: "Runtime Schema Validation with Zod",
    description: "All incoming request payloads are validated via z.object().safeParse(body); compile-time types are never trusted alone.",
    owasp: "API3:2023 Broken Object Property Level Authorization",
    weight: 15,
  },
  {
    id: "mass_assign",
    title: "Strict Mass-Assignment Prevention",
    description: "Data updates only persist explicitly whitelisted fields from validated schema; never db.update({ data: body }).",
    owasp: "API3:2023 Mass Assignment",
    weight: 15,
  },
  {
    id: "ratelimit",
    title: "Distributed Rate Limiting on Expensive Endpoints",
    description: "Login, search, and compute-heavy endpoints are protected by sliding-window token bucket limiters (returning 429).",
    owasp: "API4:2023 Unrestricted Resource Consumption",
    weight: 15,
  },
  {
    id: "errors",
    title: "Sanitized Production Error Responses",
    description: "Exceptions never leak stack traces, database schema details, or file paths in production; generic 500s returned.",
    owasp: "API8:2023 Security Misconfiguration",
    weight: 10,
  },
  {
    id: "secrets",
    title: "Server-Side Secret Hygiene",
    description: "Private keys and DB credentials never use NEXT_PUBLIC_ prefix and are accessed strictly in server-side code.",
    owasp: "API8:2023 Sensitive Data Exposure",
    weight: 5,
  },
];

export function NextJSApiSecurityTool() {
  const [activeTab, setActiveTab] = useState<"audit" | "ratelimit" | "generator">("audit");

  // Tab 1: Audit state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    auth: true,
    zod: true,
    secrets: true,
  });

  // Tab 2: Rate Limit state
  const [endpointType, setEndpointType] = useState<"auth" | "search" | "mutation" | "public">("auth");
  const [windowSeconds, setWindowSeconds] = useState<number>(60);
  const [maxRequests, setMaxRequests] = useState<number>(5);

  // Tab 3: Code Generator state
  const [method, setMethod] = useState<"GET" | "POST" | "PATCH" | "DELETE">("PATCH");
  const [authLevel, setAuthLevel] = useState<"owner" | "user" | "admin">("owner");
  const [includeZod, setIncludeZod] = useState<boolean>(true);
  const [includeRateLimit, setIncludeRateLimit] = useState<boolean>(true);

  // Copied indicator
  const [copied, setCopied] = useState<boolean>(false);

  // Audit Calculations
  const totalScore = AUDIT_ITEMS.reduce(
    (acc, item) => acc + (checkedItems[item.id] ? item.weight : 0),
    0
  );

  const getScoreBadge = () => {
    if (totalScore >= 85) {
      return {
        label: "Production Hardened",
        color: "bg-emerald-50 text-emerald-800 border-emerald-300",
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      };
    }
    if (totalScore >= 50) {
      return {
        label: "Moderate Security Posture",
        color: "bg-amber-50 text-amber-800 border-amber-300",
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      };
    }
    return {
      label: "Critical Security Vulnerabilities",
      color: "bg-red-50 text-red-800 border-red-300",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
    };
  };

  const handleToggleAudit = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetAudit = () => {
    setCheckedItems({
      auth: true,
      zod: true,
      secrets: true,
    });
  };

  // Endpoint Presets for Rate Limiting
  const handleSelectPreset = (type: "auth" | "search" | "mutation" | "public") => {
    setEndpointType(type);
    if (type === "auth") {
      setWindowSeconds(60);
      setMaxRequests(5);
    } else if (type === "search") {
      setWindowSeconds(60);
      setMaxRequests(30);
    } else if (type === "mutation") {
      setWindowSeconds(60);
      setMaxRequests(10);
    } else {
      setWindowSeconds(60);
      setMaxRequests(120);
    }
  };

  // Generated Code
  const generateRouteCode = () => {
    return `// src/app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
${includeZod ? 'import { z } from "zod";\n' : ""}${includeRateLimit ? 'import { checkRateLimit } from "@/lib/rate-limit";\n' : ""}import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

${
  includeZod
    ? `// Runtime validation schema to reject unexpected fields
const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
});
`
    : ""
}export async function ${method}(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
${
  includeRateLimit
    ? `    // 1. Sliding-window rate limit check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const allowed = await checkRateLimit(\`api:\${ip}\`, { limit: ${maxRequests}, window: ${windowSeconds} });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "${windowSeconds}" } }
      );
    }
`
    : ""
}    // 2. Server-side session verification
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
${
  authLevel === "admin"
    ? `    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }\n`
    : ""
}    const { id } = await params;
${
  includeZod
    ? `
    // 3. Runtime body validation (prevents mass-assignment)
    const body = await request.json().catch(() => null);
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
`
    : ""
}${
      authLevel === "owner"
        ? `    // 4. Resource authorization: Enforce tenant / user ownership (BOLA Safe)
    const project = await db.project.findFirst({
      where: {
        id,
        ownerId: user.id, // CRITICAL: Never query by id alone!
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
`
        : ""
    }    // 5. Execute safe operation
    return NextResponse.json({
      success: true,
      message: "Operation completed safely",
    });
  } catch (error) {
    // 6. Safe error response: Never leak stack traces or connection strings in production
    console.error("[API_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateRouteCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badge = getScoreBadge();

  return (
    <div className="my-10 bg-white border border-gray-200/90 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600/30 border border-blue-400/30 rounded-xl text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                Interactive Engineering Utility
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Next.js API Security Hardening &amp; Rate Limit Tool
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetAudit}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
              title="Reset audit checklist"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </button>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 border-b border-slate-700/80 pb-px text-sm">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "audit"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Security Posture Audit ({totalScore}%)</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("ratelimit")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "ratelimit"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>2. Rate Limit Policy Calculator</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === "generator"
                ? "bg-slate-800 text-white border-blue-400"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <span className="flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>3. Secure Route Handler Generator</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 bg-gray-50/50">
        {/* TAB 1: AUDIT CHECKLIST */}
        {activeTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h4 className="text-sm font-bold text-gray-900">
                  Route Handler Hardening Audit Checklist
                </h4>
                <p className="text-xs text-gray-500">
                  Select the controls currently implemented on your Next.js API endpoints.
                </p>
              </div>

              <div className="space-y-3">
                {AUDIT_ITEMS.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleAudit(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-white border-blue-200 shadow-sm"
                          : "bg-gray-50/70 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-700 border border-slate-200">
                              {item.owasp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scorecard Display */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    Security Scorecard
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="font-serif text-5xl font-black text-gray-950 tracking-tight">
                      {totalScore}%
                    </span>
                    <span className="text-xs text-gray-500 font-medium">/ 100% hardened</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      totalScore >= 80
                        ? "bg-emerald-500"
                        : totalScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${totalScore}%` }}
                  ></div>
                </div>

                {/* Diagnostic Badge */}
                <div className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs ${badge.color}`}>
                  {badge.icon}
                  <div>
                    <div className="font-bold">{badge.label}</div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      {totalScore >= 80
                        ? "Protected against top OWASP API security risks."
                        : totalScore >= 50
                        ? "Review unchecked items to prevent BOLA or rate abuse."
                        : "Critical risks present. Public requests can bypass safety checks."}
                    </div>
                  </div>
                </div>

                {/* Critical Missing Controls Alert */}
                {!checkedItems["bola"] && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Vulnerable to BOLA attacks. Users can tamper with IDs in the URL to view or edit other users&apos; records.
                    </span>
                  </div>
                )}
                {!checkedItems["zod"] && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> TypeScript types do not validate incoming JSON at runtime. Malicious clients can submit invalid data.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RATE LIMIT CALCULATOR */}
        {activeTab === "ratelimit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Endpoint Traffic &amp; Threshold Configuration
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Select Endpoint Profile Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(
                      [
                        { type: "auth", label: "Login / Auth (Strict)", icon: <Lock className="w-3.5 h-3.5 mr-1" /> },
                        { type: "search", label: "Search / Read (Medium)", icon: <Cpu className="w-3.5 h-3.5 mr-1" /> },
                        { type: "mutation", label: "Reports / Heavy (Low)", icon: <Flame className="w-3.5 h-3.5 mr-1" /> },
                        { type: "public", label: "Public Read (High)", icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.type}
                        onClick={() => handleSelectPreset(p.type)}
                        className={`p-2.5 rounded-lg border flex items-center justify-center font-medium transition-all ${
                          endpointType === p.type
                            ? "bg-blue-50 border-blue-300 text-blue-900 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p.icon}
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Window Duration (Seconds)</span>
                    <span className="font-mono text-gray-500">{windowSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    value={windowSeconds}
                    onChange={(e) => setWindowSeconds(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Max Requests Allowed per Window</span>
                    <span className="font-mono text-blue-600 font-bold">{maxRequests} req</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    step="1"
                    value={maxRequests}
                    onChange={(e) => setMaxRequests(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Response Specification Card */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Recommended HTTP Headers &amp; Payloads
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase font-sans font-semibold">Response Headers on Rejection (HTTP 429)</div>
                    <div>HTTP/1.1 429 Too Many Requests</div>
                    <div className="text-cyan-400">Retry-After: {windowSeconds}</div>
                    <div className="text-slate-300">X-RateLimit-Limit: {maxRequests}</div>
                    <div className="text-slate-300">X-RateLimit-Remaining: 0</div>
                    <div className="text-slate-300">X-RateLimit-Reset: {Math.floor(Date.now() / 1000) + windowSeconds}</div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    <div className="text-gray-400 text-[10px] uppercase font-sans font-semibold mb-1">Client Rejection JSON Body</div>
                    <pre className="text-xs">
{`{
  "error": "Too many requests. Please try again later.",
  "retryAfter": ${windowSeconds}
}`}
                    </pre>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 leading-snug">
                  * In serverless edge environments, store counters in a shared low-latency Redis store (Upstash/Redis) rather than in-memory maps to ensure limits persist across isolated container cold starts.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CODE GENERATOR */}
        {activeTab === "generator" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">HTTP Method:</span>
                {(["GET", "POST", "PATCH", "DELETE"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-2.5 py-1 rounded font-mono font-bold transition-all ${
                      method === m
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Authorization Scope:</span>
                <select
                  value={authLevel}
                  onChange={(e) => setAuthLevel(e.target.value as "owner" | "user" | "admin")}
                  className="px-2.5 py-1 border border-gray-300 rounded font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="owner">Resource Owner (BOLA Safe)</option>
                  <option value="user">Authenticated User</option>
                  <option value="admin">Admin Role Required</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeZod}
                    onChange={(e) => setIncludeZod(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Zod Validation</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRateLimit}
                    onChange={(e) => setIncludeRateLimit(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Rate Limiting</span>
                </label>
              </div>
            </div>

            {/* Code Output Window */}
            <div className="relative">
              <pre className="bg-gray-950 text-gray-100 p-5 rounded-xl overflow-x-auto text-xs font-mono border border-gray-800 leading-relaxed max-h-[460px]">
                <code>{generateRouteCode()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Security & Client-Side Guarantee Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>100% Client-Side Evaluation:</strong> All security audits and code generations execute in your local browser. No application data is transmitted.
            </span>
          </div>
          <div>Modernwebbuild Application Security Series</div>
        </div>
      </div>
    </div>
  );
}
