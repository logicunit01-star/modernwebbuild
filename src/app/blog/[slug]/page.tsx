import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const url = `${siteConfig.domain}/blog/${article.slug}`;
  const imageUrl = article.featuredImage.startsWith("http")
    ? article.featuredImage
    : `${siteConfig.domain}${article.featuredImage}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      siteName: siteConfig.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [`${siteConfig.name} Editorial Staff`],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);

  // Structured JSON-LD Data (Article Schema + Breadcrumbs + optional FAQ)
  const schemaGraph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${siteConfig.domain}/blog/${article.slug}#article`,
      isPartOf: {
        "@id": `${siteConfig.domain}/blog/${article.slug}`,
      },
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteConfig.domain}/blog/${article.slug}`,
      },
      wordCount: article.wordCount,
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.domain,
      },
      image: {
        "@type": "ImageObject",
        url: article.featuredImage.startsWith("http")
          ? article.featuredImage
          : `${siteConfig.domain}${article.featuredImage}`,
      },
      articleSection: [article.category],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.domain,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: `${siteConfig.domain}/#articles`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `${siteConfig.domain}/blog/${article.slug}`,
        },
      ],
    },
  ];

  if (article.faqs && article.faqs.length > 0) {
    schemaGraph.push({
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": schemaGraph,
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header (Breadcrumb, Title, Metadata, Hero Image) */}
      <ArticleHeader article={article} />

      {/* Comfortable reading width column (~768px) */}
      <div className="max-w-3xl mx-auto">
        {/* Table of Contents for longer articles */}
        <TableOfContents content={article.content} />

        {/* Complete, distraction-free article body */}
        <ArticleBody content={article.content} faqs={article.faqs} />

        {/* Editorial Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </div>
    </article>
  );
}
