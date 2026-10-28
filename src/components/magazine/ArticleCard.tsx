import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleMeta } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

interface ArticleCardProps {
  article: ArticleMeta;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
      {/* Thumbnail */}
      <Link
        href={`/blog/${article.slug}`}
        className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100"
      >
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Category */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            {article.category}
          </div>

          {/* Headline */}
          <h3 className="font-serif text-lg font-bold text-gray-950 tracking-tight leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{article.readingTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
