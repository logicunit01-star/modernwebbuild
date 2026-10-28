export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  readingTime: string;
  wordCount: number;
  faqs?: ArticleFAQ[];
}

export interface Article extends ArticleMeta {
  content: string;
}

export interface ArticleSearchParams {
  query?: string;
  category?: string;
  page?: number;
}
