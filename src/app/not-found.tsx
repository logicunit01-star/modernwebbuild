import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-2">
        <BookOpen className="w-8 h-8" />
      </div>

      <span className="block text-xs font-bold uppercase tracking-widest text-blue-600">
        404 — Document Not Located
      </span>

      <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
        Article Not Found
      </h1>

      <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
        The requested publication does not exist or may have been retired as part of an editorial consolidation.
      </p>

      <div className="pt-4 flex items-center justify-center space-x-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/#articles"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-colors"
        >
          <span>Browse Publications</span>
        </Link>
      </div>
    </div>
  );
}
