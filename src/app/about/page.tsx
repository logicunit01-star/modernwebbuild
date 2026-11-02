import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { ShieldCheck, Code2, BookOpen, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Modernwebbuild | Mission, Leadership & Editorial Standards",
  description:
    "Learn about Modernwebbuild, our technical publishing standards, and our focus on headless CMS architecture, Next.js engineering, and modern web platforms.",
  alternates: {
    canonical: `${siteConfig.domain}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-14">
      {/* Masthead */}
      <section className="space-y-4 pb-8 border-b border-gray-200">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          About the Publication
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Architectural rigor for engineers and modern web builders.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          Modernwebbuild is an independent technical journal dedicated to documenting production-grade web architecture, headless CMS migrations, frontend performance, and scalable digital platforms.
        </p>
      </section>

      {/* Editorial Lead Profile (E-E-A-T) */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-900 border-2 border-blue-600 flex-shrink-0 flex items-center justify-center text-white font-serif text-3xl font-bold">
            AK
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Technical Editor &amp; Lead Systems Architect
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-950">
              {siteConfig.author.name}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Specialist in Headless CMS, React/Next.js Architecture, and API Integrations
            </p>
          </div>
        </div>

        <div className="prose text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            {siteConfig.author.name} leads the technical research and editorial direction at Modernwebbuild. With over a decade of hands-on software development and website infrastructure experience, he has architected and delivered enterprise headless migrations, scalable ecommerce platforms, and high-throughput web applications.
          </p>
          <p>
            Our publishing philosophy is rooted in concrete implementation details: we prioritize benchmark-backed analysis, verifiable configuration code, and architecture trade-offs over promotional marketing fluff.
          </p>
        </div>
      </section>

      {/* Core Editorial Pillars */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-gray-950">
          Our Primary Focus Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Headless &amp; Decoupled Architecture
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              In-depth evaluations of modern content infrastructure (Contentful, Strapi, Sanity, WordPress REST/GraphQL) and migration blueprints for growing enterprises.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Frontend Systems &amp; Next.js
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Practical guides on React Server Components, App Router file conventions, Core Web Vitals optimization, and cache management for production applications.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Payments &amp; Platform Integrations
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Integration guides for Stripe, payment webhooks, PCI-DSS compliance, ERP synchronization, and friction-free multi-currency checkout systems.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Technical Due Diligence &amp; Rebuilds
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Checklists, budget models, and risk mitigations for rebuilding legacy monoliths without sacrificing SEO rankings, customer data, or operational continuity.
            </p>
          </div>
        </div>
      </section>

      {/* Review Standards & Quality Guarantee */}
      <section className="p-8 rounded-2xl bg-[#fafaf8] border border-gray-200 space-y-4">
        <h2 className="font-serif text-xl font-bold text-gray-950">
          Editorial Integrity &amp; Independence
        </h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Zero Paid Reviews:</strong> We do not accept payment to review or favorably recommend any software vendor or CMS provider.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Tested in Real Environments:</strong> Code samples, terminal commands, and configuration snippets are validated before publication.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Transparent Corrections:</strong> When architectural updates or breaking changes occur in modern libraries, we update our guides with clear revision stamps.</span>
          </li>
        </ul>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/editorial-policy"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Read full Editorial Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Contact the Editorial Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
