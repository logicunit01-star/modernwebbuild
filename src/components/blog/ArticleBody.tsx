import React from "react";
import { ArticleFAQ } from "@/types/article";
import { HelpCircle } from "lucide-react";

interface ArticleBodyProps {
  content: string;
  faqs?: ArticleFAQ[];
}

export function ArticleBody({ content, faqs }: ArticleBodyProps) {
  return (
    <div className="article-body">
      {/* Primary HTML Article Body */}
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Editorial FAQs Section (if present in article metadata) */}
      {faqs && faqs.length > 0 && (
        <section className="mt-14 pt-10 border-t border-gray-200" aria-label="Frequently Asked Questions">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Editorial FAQ</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-950 tracking-tight mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-5 bg-gray-50/70 border border-gray-200 rounded-xl"
              >
                <h3 className="text-base font-semibold text-gray-950 mb-2">
                  {faq.question}
                </h3>
                <div
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
