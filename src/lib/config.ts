export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  domain: string;
  logo: string;
  ogImage: string;
  author: {
    name: string;
    role: string;
    bio: string;
  };
  navItems: { label: string; href: string }[];
  categories: string[];
  contactEmail: string;
  hubspotPortalId: string;
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Modernwebbuild",
  tagline: "Guides on Headless CMS, Web Architecture & Scalable Builds",
  description:
    "An independent technical publication exploring modern web architecture, headless CMS ecosystems, AI workflows, SaaS infrastructure, and digital engineering best practices.",
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "https://modernwebbuild.com",
  logo: "/images/logo.png",
  ogImage: "/images/og-image.png",
  author: {
    name: "Aamir Khan",
    role: "Lead Systems Architect & Technical Editor",
    bio: "Full-stack engineer and web systems architect specializing in Headless CMS migrations, Next.js App Router performance, and scalable web infrastructure.",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/#articles" },
    { label: "Topics", href: "/#topics" },
    { label: "About", href: "/about" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    "AI & Automation",
    "Headless & CMS",
    "Web Architecture",
    "E-Commerce & Scaling",
    "Business & Strategy",
  ],
  contactEmail: "editor@modernwebbuild.com",
  hubspotPortalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "246175508",
};
