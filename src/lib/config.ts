export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  domain: string;
  logo: string;
  navItems: { label: string; href: string }[];
  categories: string[];
  contactEmail: string;
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Modernwebbuild",
  tagline: "The Modern Publication for Engineers, Architects, and Tech Leaders",
  description:
    "An independent technical publication exploring modern web architecture, headless CMS ecosystems, AI workflows, SaaS infrastructure, and digital engineering best practices.",
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "https://modernwebbuild.com",
  logo: "/images/logo.png",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "editorial@modernwebbuild.com",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/#articles" },
    { label: "Topics", href: "/#topics" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    "AI & Automation",
    "Headless & CMS",
    "Web Architecture",
    "E-Commerce & Scaling",
    "Business & Strategy",
  ],
};
