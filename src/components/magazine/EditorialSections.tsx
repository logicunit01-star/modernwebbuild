import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleMeta } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface EditorialSectionsProps {
  articles: ArticleMeta[];
}

export function EditorialSections({ articles }: EditorialSectionsProps) {
  // Curate articles into editorial pillars
  const aiArticles = articles
    .filter((a) => a.category === "AI & Automation")
    .slice(0, 2);

  const headlessArticles = articles
    .filter((a) => a.category === "Headless & CMS")
    .slice(0, 3);

  const architectureArticles = articles
    .filter((a) => a.category === "Web Architecture")
    .slice(0, 3);

  const ecommerceArticles = articles
    .filter((a) => a.category === "E-Commerce & Scaling")
    .slice(0, 3);

  return (
    <div id="topics" className="space-y-16 py-8 border-t border-gray-200">
      {/* Section 1: AI & Automation Spotlight */}
      {aiArticles.length > 0 && (
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-10 overflow-hidden relative">
          <div className="max-w-xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
              Special Report
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              AI &amp; Developer Automation
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Analyzing the rapid shift toward agentic code generation, rapid prototyping, and automated cloud deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group block bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-blue-500/50 rounded-xl p-5 transition-all"
              >
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-4 bg-slate-900">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-400 mb-2 font-semibold uppercase tracking-wider">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span className="text-slate-400 normal-case">{article.readingTime}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Headless CMS & Enterprise Modernization */}
      {headlessArticles.length > 0 && (
        <section>
          <div className="flex items-end justify-between pb-4 border-b border-gray-200 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Architectural In-Depth
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Headless CMS &amp; Decoupled Architecture
              </h3>
            </div>
            <Link
              href="/#articles"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {headlessArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {article.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors mt-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    {article.description}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Web Architecture & Frameworks */}
      {architectureArticles.length > 0 && (
        <section>
          <div className="flex items-end justify-between pb-4 border-b border-gray-200 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Frameworks &amp; Systems
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Web Architecture &amp; Frameworks
              </h3>
            </div>
            <Link
              href="/#articles"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architectureArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {article.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors mt-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    {article.description}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 4: E-Commerce & Scaling Infrastructure */}
      {ecommerceArticles.length > 0 && (
        <section>
          <div className="flex items-end justify-between pb-4 border-b border-gray-200 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Scaling &amp; Platforms
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                E-Commerce, ERP &amp; Payments
              </h3>
            </div>
            <Link
              href="/#articles"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecommerceArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {article.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors mt-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    {article.description}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
