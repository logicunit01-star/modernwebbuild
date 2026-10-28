import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="group relative border-b border-gray-200 pb-12 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Image with 16:9 ratio and high priority for LCP */}
        <div className="lg:col-span-7">
          <Link
            href={`/blog/${article.slug}`}
            className="block relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Right Column: Editorial metadata and prominent headline */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center space-x-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>{article.category}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 font-medium normal-case">Featured Story</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight leading-[1.2] group-hover:text-blue-900 transition-colors">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h2>

          <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
            {article.description}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTime}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-0.5"
            >
              <span>Read Full Article</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
