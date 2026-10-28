import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ChevronRight, Calendar, Clock, RefreshCw } from "lucide-react";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const isUpdated =
    article.updatedAt &&
    article.updatedAt.split("T")[0] !== article.publishedAt.split("T")[0];

  return (
    <header className="mb-10 space-y-6">
      {/* Editorial Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <ol className="flex items-center flex-wrap gap-1.5">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <Link
              href="/#articles"
              className="hover:text-blue-600 transition-colors"
            >
              Articles
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <span className="text-gray-700 font-medium">{article.category}</span>
          </li>
        </ol>
      </nav>

      {/* Category Tag */}
      <div className="inline-block">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
          {article.category}
        </span>
      </div>

      {/* H1 Headline */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.18]">
        {article.title}
      </h1>

      {/* Standfirst / Excerpt */}
      {article.description && (
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal">
          {article.description}
        </p>
      )}

      {/* Publishing Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 py-3 border-y border-gray-200">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Published {formatDate(article.publishedAt)}</span>
        </div>

        {isUpdated && (
          <>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1.5 text-gray-600">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              <span>Updated {formatDate(article.updatedAt)}</span>
            </div>
          </>
        )}

        <span className="text-gray-300">•</span>
        <div className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{article.readingTime} ({article.wordCount} words)</span>
        </div>
      </div>

      {/* Featured Image - LCP with fetchpriority="high" */}
      {article.featuredImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 mt-6">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      )}
    </header>
  );
}
