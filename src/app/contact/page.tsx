import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Clock, MessageSquareQuote } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Editorial",
  description: `Get in touch with the editorial team at ${siteConfig.name} for technical inquiries, story tips, or architectural contributions.`,
  alternates: {
    canonical: `${siteConfig.domain}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="space-y-4 pb-8 border-b border-gray-200 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Editorial Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Contact Us
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
          Have an architectural question, a research correction, or an in-depth case study to suggest? Reach out directly to our editorial board.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-8">
          <ContactForm />
        </div>

        {/* Right Column: Editorial Contact Details */}
        <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-200 lg:pl-8 text-sm text-gray-600">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Direct Contact
            </h2>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{siteConfig.contactEmail}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Response Times
            </h2>
            <div className="flex items-start space-x-2 text-gray-700">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Editorial submissions and corrections are typically reviewed within 2 business days.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-800">
              <MessageSquareQuote className="w-4 h-4 text-blue-600" />
              <span>Editorial Independence</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              We do not accept paid product placements, sponsored link exchanges, or promotional guest advertorials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
