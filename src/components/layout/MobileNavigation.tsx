"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { siteConfig } from "@/lib/config";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export function MobileNavigation({
  isOpen,
  onClose,
  onOpenSearch,
}: MobileNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-md lg:hidden transition-all duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-200 p-0.5 flex items-center justify-center">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={30}
              height={30}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-gray-950">
            {siteConfig.name}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-6 py-8 flex flex-col justify-between">
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            onClick={onClose}
            className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
          >
            Home
          </Link>
          <Link
            href="/#articles"
            onClick={onClose}
            className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
          >
            Articles
          </Link>
          <Link
            href="/#topics"
            onClick={onClose}
            className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
          >
            Topics
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
          >
            Contact
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
          {onOpenSearch && (
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium border border-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-500" />
              <span>Search Publication</span>
            </button>
          )}

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>
      </nav>
    </div>
  );
}
