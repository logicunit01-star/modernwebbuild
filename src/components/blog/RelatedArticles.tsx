import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-label="Related publications"
      className="mt-16 pt-12 border-t border-gray-200"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Further Reading
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-950 tracking-tight mt-1">
            Related Editorial Guides
          </h2>
        </div>

        <Link
          href="/#articles"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Publications</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group flex flex-col justify-between bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div>
              <Link
                href={`/blog/${article.slug}`}
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100"
              >
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {article.category}
                </span>

                <h3 className="font-serif text-base font-bold text-gray-950 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{article.readingTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Return to Articles Link */}
      <div className="mt-12 text-center">
        <Link
          href="/#articles"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Article Archive</span>
        </Link>
      </div>
    </section>
  );
}
