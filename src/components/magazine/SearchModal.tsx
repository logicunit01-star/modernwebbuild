"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, BookOpen } from "lucide-react";
import { ArticleMeta } from "@/types/article";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";

      // Load article index
      setIsLoading(true);
      fetch("/api/articles")
        .then((res) => res.json())
        .then((data) => {
          setArticles(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-gray-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, headless CMS, React, AI, scaling..."
            className="w-full text-base sm:text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading articles...
            </div>
          ) : query.trim() === "" ? (
            <div className="py-12 text-center text-sm text-gray-500 space-y-2">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>Type keywords to search across 27 editorial publications.</p>
              <p className="text-xs text-gray-400">
                Examples: Next.js, Headless CMS, Shopify vs WooCommerce, AI
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No articles found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                onClick={onClose}
                className="group block p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.readingTime}</span>
                </div>
                <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mt-1 line-clamp-1">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {article.description}
                </p>
                <div className="flex items-center text-xs font-medium text-blue-600 mt-2">
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
