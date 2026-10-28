"use client";

import React from "react";

interface CategoryNavigationProps {
  categories: { name: string; count: number }[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryNavigation({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryNavigationProps) {
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {/* "All" Filter */}
      <button
        onClick={() => onSelectCategory("All")}
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
          activeCategory === "All"
            ? "bg-gray-950 text-white border-gray-950 shadow-sm"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        All Articles ({totalCount})
      </button>

      {/* Dynamic Categories supported by content */}
      {categories.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              isActive
                ? "bg-gray-950 text-white border-gray-950 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        );
      })}
    </div>
  );
}
