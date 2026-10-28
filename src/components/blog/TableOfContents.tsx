"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract H2 headings from the rendered document
    const headingElements = document.querySelectorAll(".article-prose h2");
    const items: TOCItem[] = [];

    headingElements.forEach((el, index) => {
      let id = el.id;
      if (!id) {
        id = `section-${index + 1}`;
        el.id = id;
      }
      items.push({
        id,
        text: el.textContent?.trim() || `Section ${index + 1}`,
      });
    });

    setHeadings(items);

    // Intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <aside
      aria-label="Table of contents"
      className="my-8 p-6 bg-[#f9fafb] border border-gray-200 rounded-xl"
    >
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
        <List className="w-4 h-4 text-blue-600" />
        <span>Table of Contents</span>
      </div>

      <nav>
        <ol className="space-y-2.5 text-sm">
          {headings.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="flex items-start space-x-2">
                <span className="text-xs font-mono text-gray-400 mt-0.5">
                  {(index + 1).toString().padStart(2, "0")}.
                </span>
                <a
                  href={`#${item.id}`}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
