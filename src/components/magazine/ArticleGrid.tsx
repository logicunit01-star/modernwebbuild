import React from "react";
import { ArticleMeta } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  articles: ArticleMeta[];
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  emptyMessage = "No articles found in this category.",
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {articles.map((article, idx) => (
        <ArticleCard
          key={article.slug}
          article={article}
          priority={idx < 3}
        />
      ))}
    </div>
  );
}
