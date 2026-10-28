"use client";

import React, { useState, useMemo } from "react";
import { ArticleMeta } from "@/types/article";
import { CategoryNavigation } from "./CategoryNavigation";
import { ArticleGrid } from "./ArticleGrid";
import { Pagination } from "./Pagination";
import { Search } from "lucide-react";

interface LatestArticlesProps {
  initialArticles: ArticleMeta[];
  categories: { name: string; count: number }[];
}

const ITEMS_PER_PAGE = 6;

export function LatestArticles({
  initialArticles,
  categories,
}: LatestArticlesProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section id="articles" className="scroll-mt-24 pt-4 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Browse Archive
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-gray-950 tracking-tight">
            Latest Publications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            In-depth guides, architectural comparisons, and engineering analyses.
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Filter articles..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="mb-8">
        <CategoryNavigation
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Article Results Counter */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
        <span>
          Showing {filteredArticles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)} of{" "}
          {filteredArticles.length} articles
        </span>
        {selectedCategory !== "All" && (
          <button
            onClick={() => handleCategoryChange("All")}
            className="text-blue-600 hover:underline"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Article Grid */}
      <ArticleGrid
        articles={paginatedArticles}
        emptyMessage={
          searchQuery
            ? `No articles found matching "${searchQuery}".`
            : "No articles found in this category."
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          const el = document.getElementById("articles");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </section>
  );
}
