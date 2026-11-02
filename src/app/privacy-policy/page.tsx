import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { Lock, Shield, EyeOff, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Modernwebbuild",
  description:
    "Privacy Policy for Modernwebbuild. Learn how we handle reader inquiries, respect privacy, and ensure data security.",
  alternates: {
    canonical: `${siteConfig.domain}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
      <section className="space-y-4 pb-8 border-b border-gray-200">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Legal &amp; Privacy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          At {siteConfig.name}, we believe in technical transparency. We do not track users across the web, sell reader data, or inject behavioral advertising beacons.
        </p>
      </section>

      <div className="prose text-gray-700 text-sm sm:text-base leading-relaxed space-y-10">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you visit Modernwebbuild, our servers collect standard, privacy-preserving HTTP request logs (such as IP address, user agent, requested URL, and timestamp) solely for operational uptime, security protection, and DDoS prevention.
          </p>
          <p>
            When you contact us via our <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link>, you provide your name, email address, subject, and message content. This data is used exclusively to evaluate your submission and correspond with you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <EyeOff className="w-6 h-6 text-blue-600" />
            <span>2. Cookies &amp; Tracking Technologies</span>
          </h2>
          <p>
            Modernwebbuild does not use invasive third-party tracking cookies or behavioral advertising pixels. We avoid third-party marketing scripts on all editorial pages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>3. How We Protect Your Information</span>
          </h2>
          <p>
            All communications are encrypted in transit using industry-standard TLS 1.3 / HTTPS encryption. We do not store credit card details or process user accounts on this publication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-gray-950 flex items-center space-x-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <span>4. Contacting Our Data Controller</span>
          </h2>
          <p>
            If you have questions regarding this privacy policy or wish to request the deletion of any correspondence sent to us, please contact:
          </p>
          <p className="font-medium text-gray-900">
            Email: <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline">{siteConfig.contactEmail}</a>
          </p>
        </section>
      </div>

      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
        Last updated: November 2026 • Modernwebbuild Digital Publication
      </div>
    </div>
  );
}
