import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export function AuthorBio() {
  return (
    <div className="mt-12 p-6 sm:p-8 bg-[#fafaf8] border border-gray-200 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-blue-600 flex items-center justify-center text-white font-serif text-xl font-bold flex-shrink-0">
          AK
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-lg font-bold text-gray-950">
              {siteConfig.author.name}
            </h3>
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>Verified Author</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {siteConfig.author.role} • Modernwebbuild
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        {siteConfig.author.bio}
      </p>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1.5 text-gray-700">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Independent Technical Editorial • No Sponsored Placements</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/about"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
          >
            <span>Author Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/editorial-policy"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Editorial Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
