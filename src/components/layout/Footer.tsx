import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#fafaf8] border-t border-gray-200 mt-20 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Editorial Column with Logo */}
          <div className="md:col-span-6 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-200 p-1 flex items-center justify-center">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-extrabold text-gray-950 tracking-tight group-hover:text-blue-900 transition-colors">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              {siteConfig.description}
            </p>
            <p className="text-xs text-gray-400">
              Published with editorial independence and architectural rigor.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#articles"
                  className="hover:text-blue-600 transition-colors"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#topics"
                  className="hover:text-blue-600 transition-colors"
                >
                  Editorial Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact Editorial
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Pillars */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Focus Areas
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {siteConfig.categories.map((category) => (
                <li key={category}>
                  <span>{category}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Colophon */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Editorial Inquiries
            </Link>
            <span>•</span>
            <span>Independent Digital Magazine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
