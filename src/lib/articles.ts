import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "@/types/article";

const articlesDirectory = path.join(process.cwd(), "src", "content", "articles");

let cachedArticles: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cachedArticles && process.env.NODE_ENV === "production") {
    return cachedArticles;
  }

  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles: Article[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;

    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = data.slug || fileName.replace(/\.md$/, "");

    allArticles.push({
      slug,
      title: data.title || "Untitled Article",
      description: data.description || "",
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
      category: data.category || "Web Architecture",
      tags: data.tags || [data.category || "Web Architecture"],
      featuredImage: data.featuredImage || "/images/placeholder.svg",
      readingTime: data.readingTime || "5 min read",
      wordCount: data.wordCount || 800,
      faqs: data.faqs || [],
      content,
    });
  }

  // Sort by publication date descending
  allArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  cachedArticles = allArticles;
  return allArticles;
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export function getAllCategories(): { name: string; count: number }[] {
  const articles = getAllArticles();
  const counts: Record<string, number> = {};

  for (const article of articles) {
    const cat = article.category || "Web Architecture";
    counts[cat] = (counts[cat] || 0) + 1;
  }

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }));
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  if (!category || category === "All") return articles;
  return articles.filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedArticle(): Article | null {
  const articles = getAllArticles();
  return articles.length > 0 ? articles[0] : null;
}

export function getLatestArticles(limit: number = 6): Article[] {
  const articles = getAllArticles();
  return articles.slice(0, limit);
}

export function getRelatedArticles(
  currentSlug: string,
  category: string,
  limit: number = 3
): Article[] {
  const articles = getAllArticles();
  const related = articles.filter(
    (a) => a.slug !== currentSlug && a.category.toLowerCase() === category.toLowerCase()
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  // Fallback to latest other articles if category has fewer
  const fallbacks = articles.filter(
    (a) => a.slug !== currentSlug && !related.some((r) => r.slug === a.slug)
  );

  return [...related, ...fallbacks].slice(0, limit);
}

export function searchArticles(query: string, category?: string): Article[] {
  let articles = getAllArticles();

  if (category && category !== "All") {
    articles = articles.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (!query || query.trim() === "") {
    return articles;
  }

  const cleanQuery = query.toLowerCase().trim();
  return articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(cleanQuery) ||
      article.description.toLowerCase().includes(cleanQuery) ||
      article.category.toLowerCase().includes(cleanQuery) ||
      article.tags.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });
}
