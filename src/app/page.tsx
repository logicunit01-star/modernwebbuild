import React from "react";
import { getAllArticles, getAllCategories, getFeaturedArticle } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import { FeaturedArticle } from "@/components/magazine/FeaturedArticle";
import { LatestArticles } from "@/components/magazine/LatestArticles";
import { EditorialSections } from "@/components/magazine/EditorialSections";

export default function HomePage() {
  const allArticles = getAllArticles();
  const categories = getAllCategories();
  const featured = getFeaturedArticle() || allArticles[0];

  const archiveArticles = allArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    category: article.category,
    tags: article.tags,
    featuredImage: article.featuredImage,
    readingTime: article.readingTime,
    wordCount: article.wordCount,
    faqs: article.faqs,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* A. Editorial Masthead */}
      <section className="border-b border-gray-200 pb-8 sm:pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Journal of Web Engineering &amp; Modern Systems
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1]">
              Architectural insights for modern web builders.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              {siteConfig.description}
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-xs text-gray-500 space-y-1 border-l border-gray-200 pl-6">
            <span className="font-semibold text-gray-800">
              {allArticles.length} Editorial Guides Published
            </span>
            <span>Covering {categories.length} Specialized Disciplines</span>
            <span className="text-gray-400">Distraction-Free • Ad-Free</span>
          </div>
        </div>
      </section>

      {/* B. Featured Article */}
      {featured && (
        <section aria-label="Featured Story">
          <FeaturedArticle article={featured} />
        </section>
      )}

      {/* C, D, F. Latest Articles with Category Filters & Search */}
      <LatestArticles
        initialArticles={archiveArticles}
        categories={categories}
      />

      {/* E. Additional Editorial Sections (AI, Headless, E-Commerce, Strategy) */}
      <EditorialSections articles={archiveArticles} />
    </div>
  );
}
