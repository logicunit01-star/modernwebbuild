import React from "react";
import Link from "next/link";
import { getAllArticles, getAllCategories, getFeaturedArticle } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import { FeaturedArticle } from "@/components/magazine/FeaturedArticle";
import { LatestArticles } from "@/components/magazine/LatestArticles";
import { EditorialSections } from "@/components/magazine/EditorialSections";
import { ArrowRight, Code2 } from "lucide-react";

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

  // Homepage Schema (Organization + WebSite with SearchAction)
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.domain}/#website`,
        url: siteConfig.domain,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.domain}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteConfig.domain}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.domain}/#organization`,
        name: siteConfig.name,
        url: siteConfig.domain,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.domain}${siteConfig.logo}`,
          caption: siteConfig.name,
        },
        image: {
          "@id": `${siteConfig.domain}/#logo`,
        },
        description: siteConfig.description,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Homepage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      {/* A. Editorial Masthead with strong intent & keyword-aware intro */}
      <section className="border-b border-gray-200 pb-8 sm:pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Code2 className="w-4 h-4" />
              <span>Headless CMS, Web Architecture &amp; Scalable Builds</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1]">
              Architectural guides on headless CMS, web builds &amp; site architecture.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Independent engineering breakdowns, CMS migration benchmarks, and technical playbooks for developers, systems architects, and technology leaders.
            </p>
            <div className="pt-1 flex items-center space-x-4 text-xs font-medium text-gray-600">
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
              >
                <span>About our editorial standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Lead Editor: {siteConfig.author.name}</span>
            </div>
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
