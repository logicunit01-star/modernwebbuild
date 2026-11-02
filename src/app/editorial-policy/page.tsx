import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { ShieldCheck, AlertCircle, RefreshCw, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy & Standards | Modernwebbuild",
  description:
    "Our editorial standards, code testing methodology, fact-checking principles, and disclosure policies for technical web architecture guides.",
  alternates: {
    canonical: `${siteConfig.domain}/editorial-policy`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
      <section className="space-y-4 pb-8 border-b border-gray-200">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Standards &amp; Governance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Editorial Policy &amp; Code of Practice
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          At Modernwebbuild, we maintain strict editorial standards to ensure our technical documentation, CMS comparisons, and architectural playbooks remain truthful, actionable, and independent.
        </p>
      </section>

      <div className="prose text-gray-700 text-sm sm:text-base leading-relaxed space-y-10">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>1. Editorial Independence &amp; Commercial Non-Bias</span>
          </h2>
          <p>
            Modernwebbuild is an independent technical publication. Our editorial recommendations, platform comparisons, and technical evaluations are produced free from commercial influence.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>We do not accept sponsored guest articles or paid vendor placements.</li>
            <li>No software provider, CMS vendor, or hosting platform pays for favorable positioning in our comparison guides.</li>
            <li>External citations and reference links are selected strictly on merit, utility, and relevance to the reader.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>2. Technical Accuracy &amp; Code Testing Methodology</span>
          </h2>
          <p>
            To prevent outdated advice or broken dependencies from reaching our readers, all code snippets, terminal commands, and API patterns undergo verification:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Local Reproduction:</strong> Integration steps are tested against active Node.js, Next.js, and framework runtimes.</li>
            <li><strong>Security Review:</strong> Code examples involving authentication, webhooks, or payment processing are checked against OWASP and PCI-DSS best practices.</li>
            <li><strong>Version Tagging:</strong> Guides specify framework versions (e.g., Next.js App Router, React 19) to contextualize compatibility.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <span>3. Corrections, Revisions &amp; Updates</span>
          </h2>
          <p>
            Web technologies evolve rapidly. When a library publishes breaking changes or when an external API alters its behavior, we proactively revise affected articles.
          </p>
          <p>
            Each published article includes both an original publication date and a revision timestamp. If you spot a technical inaccuracy or outdated recommendation, we invite you to report it directly to our editorial team via our <Link href="/contact" className="text-blue-600 hover:underline">Contact Desk</Link>.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <span>4. Responsible AI Usage Policy</span>
          </h2>
          <p>
            While our reporting covers artificial intelligence, code generation tools, and developer automation, our published analysis and editorial synthesis are governed by experienced human engineering architects.
          </p>
          <p>
            AI tools are never used to publish unverified code, fabricate benchmark figures, or bypass human architectural evaluation.
          </p>
        </section>
      </div>

      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs text-gray-500">
        <span>Policy effective date: November 2026</span>
        <Link href="/about" className="font-semibold text-blue-600 hover:underline">
          Meet our Editorial Team →
        </Link>
      </div>
    </div>
  );
}
