import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { ChevronRight, Calendar, Clock, RefreshCw, User, ShieldCheck } from "lucide-react";

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

      {/* Category Tag & Peer-reviewed badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
          {article.category}
        </span>
        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Technical Review</span>
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

      {/* Publishing & Author Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 py-3 border-y border-gray-200">
        <div className="flex items-center space-x-1.5">
          <User className="w-4 h-4 text-gray-400" />
          <span>
            By{" "}
            <Link
              href="/about"
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {siteConfig.author.name}
            </Link>
          </span>
        </div>

        <span className="text-gray-300">•</span>

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

      {/* Featured Image - Capped max size & LCP Priority */}
      {article.featuredImage && (
        <div className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl bg-gray-100 border border-gray-200 mt-6">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 768px, 768px"
            className="object-cover"
          />
        </div>
      )}
    </header>
  );
}
