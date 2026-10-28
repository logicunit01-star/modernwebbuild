"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { MobileNavigation } from "./MobileNavigation";
import { SearchModal } from "@/components/magazine/SearchModal";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Top Editorial Utility Bar */}
      <div className="border-b border-gray-100 bg-[#fafaf8] text-xs text-gray-500 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-700 tracking-wider uppercase text-[10px]">
              Digital Edition
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline">
              Architecture • Headless CMS • AI Engineering
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Wordmark with Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200 p-1 flex items-center justify-center shadow-xs">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-gray-950 group-hover:text-blue-900 transition-colors">
                {siteConfig.name}
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Technical Editorial
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
            >
              Home
            </Link>
            <Link
              href="/#articles"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
            >
              Articles
            </Link>
            <Link
              href="/#topics"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
            >
              Topics
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action: Search & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center space-x-2 text-sm border border-transparent hover:border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="hidden md:inline text-xs text-gray-600 font-medium">
                Search
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Open mobile navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
