---
title: "Server vs Client Components in Next.js: When to Use Each"
slug: "react-server-vs-client-components"
description: "Learn when to use React Server Components and Client Components in Next.js. Understand performance, state, data fetching, hydration, and practical examples."
publishedAt: "2026-11-26T12:00:00+00:00"
updatedAt: "2026-11-26T12:00:00+00:00"
category: "Web Architecture"
featuredImage: "/images/articles/react-server-vs-client-components/featured.webp"
wordCount: 3450
readingTime: "14 min read"
tags: ["Next.js", "React Server Components", "Client Components", "Web Architecture", "Performance"]
faqs:
  - question: "What is the primary difference between Server and Client Components in Next.js?"
    answer: "Server Components execute exclusively on the server, sending pre-rendered HTML and a lightweight JSON payload to the browser with zero client JavaScript bundle overhead. Client Components are declared with the 'use client' directive, are pre-rendered into HTML on the server, and hydrate in the browser to support React state (useState), lifecycle hooks (useEffect), and DOM event listeners."
  - question: "Does adding 'use client' mean a component only renders in the browser?"
    answer: "No. 'use client' defines a boundary between server and client module graphs. On initial page load, Next.js pre-renders Client Components to static HTML on the server for fast visual paint (FCP), after which the browser downloads the component's JavaScript bundle and hydrates its interactive listeners."
  - question: "Can a Client Component render a Server Component?"
    answer: "A Client Component cannot directly import a Server Component. However, you can pass a Server Component as a child or slot (via props.children) to a Client Component from a parent Server Component. The Server Component executes on the server, and its pre-rendered output is rendered inside the client shell without pulling its server dependencies into the client bundle."
  - question: "Can I fetch data inside a Client Component?"
    answer: "Yes, you can fetch data inside Client Components using useEffect or third-party client data-fetching libraries like TanStack Query or SWR. However, idiomatic Next.js App Router architecture recommends fetching data directly inside async Server Components close to your database, reducing client JavaScript and eliminating waterfall requests."
  - question: "Why should I avoid placing 'use client' in root layouts?"
    answer: "Placing 'use client' in root layout files causes the entire subtree of your application to fall into the client module graph. This drastically increases your client-side JavaScript bundle, forces unnecessary browser hydration, slows down Time to Interactive (TTI), and inflates Interaction to Next Paint (INP)."
  - question: "How do Server Components improve Core Web Vitals?"
    answer: "Server Components keep heavy libraries (like Markdown parsers, date formatting tools, and syntax highlighters) on the server, eliminating hundreds of kilobytes from the client bundle. This significantly reduces main-thread Total Blocking Time (TBT) and improves Interaction to Next Paint (INP) because the browser doesn't have to parse and hydrate unnecessary code."
  - question: "Can Server Components access browser APIs like localStorage or window?"
    answer: "No. Because Server Components run exclusively during server-side rendering, they do not have access to browser-specific globals like window, document, localStorage, or geolocation. When you need browser APIs, move that logic into an isolated Client Component."
  - question: "Are Server Components re-executed on client-side navigation?"
    answer: "On client-side page transitions, Next.js makes a fetch request for the Server Component payload (RSC payload) from the server. The client React runtime reconciles this stream and updates the DOM without performing a full page reload or re-downloading JavaScript for unhydrated Server Components."
---

<h1 class="wp-block-heading">React Server Components vs Client Components in Next.js: When to Use Each</h1>

<p class="wp-block-paragraph">When building applications with Next.js, one of the most common architectural decisions is whether a component should run on the server or the client.</p>

<p class="wp-block-paragraph">You might have a page that displays products from a database, a dashboard with interactive charts, a search bar, a navigation menu, or a form with validation.</p>

<ul class="wp-block-list">
  <li>Should all these components use <code>"use client"</code>?</li>
  <li>Should you fetch data inside a Client Component using <code>useEffect()</code>?</li>
  <li>Can a Server Component contain a button? Can a Client Component render a Server Component?</li>
  <li>And what happens when you add <code>"use client"</code> to a large component tree?</li>
</ul>

<p class="wp-block-paragraph">Understanding these questions is essential for building fast, maintainable Next.js applications.</p>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-lg text-sm text-slate-700">
  <strong>The Fundamental Rule:</strong> Use <strong>Server Components</strong> for data fetching, backend database access, and content that does not require client-side interactivity. Use <strong>Client Components</strong> when you need React state (<code>useState</code>), event handlers (<code>onClick</code>), browser lifecycle side-effects (<code>useEffect</code>), or browser-only APIs.
</div>

<p class="wp-block-paragraph">You do not need to choose one approach for your entire application. The best Next.js architecture combines both into a composite island system. In this guide, you will learn how Server Components and Client Components work, how they differ, when to use each, and how to structure real-world applications without unnecessarily bloating your JavaScript bundle.</p>

<figure class="my-8">
  <img 
    src="/images/articles/react-server-vs-client-components/react-server-vs-client-components-hero.webp" 
    alt="React Server Components vs Client Components in Next.js: Architectural comparison of server-side data fetching and client-side interactivity" 
    width="1200" 
    height="675" 
    class="rounded-xl border border-gray-200 shadow-sm w-full h-auto" 
  />
  <figcaption class="text-xs text-gray-500 text-center mt-2">
    Next.js App Router component boundary: Server Components handle direct database queries and secrets with zero JS bundle, while Client Components manage interactive browser state across the network boundary.
  </figcaption>
</figure>

<h2 class="wp-block-heading" id="quick-answer-comparison">Quick Answer: Server Components vs Client Components</h2>

<figure class="wp-block-table is-style-stripes my-6 overflow-x-auto">
  <table class="has-fixed-layout min-w-full text-sm">
    <thead class="bg-slate-100 text-slate-800">
      <tr>
        <th class="has-text-align-left p-3 font-semibold" data-align="left">Feature</th>
        <th class="has-text-align-left p-3 font-semibold" data-align="left">Server Component</th>
        <th class="has-text-align-left p-3 font-semibold" data-align="left">Client Component</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200">
      <tr>
        <td class="p-3 font-medium">Default in Next.js App Router</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes</td>
        <td class="p-3 text-slate-600">No (requires <code>"use client"</code>)</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Runs as part of server rendering</td>
        <td class="p-3 text-emerald-700">Yes (server-only)</td>
        <td class="p-3 text-slate-600">Pre-rendered on server, then hydrated</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">React State (<code>useState</code>, <code>useReducer</code>)</td>
        <td class="p-3 text-red-600">No</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Side Effects (<code>useEffect</code>)</td>
        <td class="p-3 text-red-600">No</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">DOM Event Handlers (<code>onClick</code>, <code>onChange</code>)</td>
        <td class="p-3 text-red-600">No</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Browser APIs (<code>window</code>, <code>localStorage</code>)</td>
        <td class="p-3 text-red-600">No</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Direct database & ORM access</td>
        <td class="p-3 text-emerald-700 font-semibold">Yes, directly via async/await</td>
        <td class="p-3 text-red-600">No (requires API route or Server Action)</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Secret Environment Variables</td>
        <td class="p-3 text-emerald-700 font-semibold">Safe (never sent to client)</td>
        <td class="p-3 text-red-600">Must not expose backend secrets</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Client JavaScript Bundle Footprint</td>
        <td class="p-3 text-emerald-700 font-bold">0 KB (Zero bundle cost)</td>
        <td class="p-3 text-amber-700 font-medium">Component JS + imports downloaded & parsed</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Ideal For</td>
        <td class="p-3">Data fetching, static copy, SEO content, layouts</td>
        <td class="p-3">Forms, modal dialogs, search inputs, interactive charts</td>
      </tr>
    </tbody>
  </table>
</figure>

<p class="wp-block-paragraph">Server Components and Client Components are not competing technologies. They are complementary parts of the same modern React application.</p>

<h2 class="wp-block-heading" id="what-are-react-server-components">1. What are React Server Components?</h2>

<p class="wp-block-paragraph">React Server Components (RSC) are components that render exclusively on the server as part of the React server rendering pipeline.</p>

<p class="wp-block-paragraph">In the Next.js App Router, every file inside the <code>app/</code> directory (including pages, layouts, and subcomponents) is a Server Component by default unless explicitly decorated with <code>"use client"</code>.</p>

<p class="wp-block-paragraph">This means you can fetch data, query an internal database, access protected infrastructure resources, and render markup without shipping the component's own code or third-party server libraries to the browser for client-side hydration.</p>

<h3 class="wp-block-heading" id="example-server-component-data-fetching">Example: Fetching Data in an Async Server Component</h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// src/app/blog/page.tsx
import { db } from "@/lib/db";

export default async function BlogPage() {
  // Directly queries PostgreSQL or SQLite during server render
  const posts = await db.post.findMany({
    orderBy: {
      publishedAt: "desc",
    },
    take: 10,
  });

  return (
    &lt;main className="max-w-4xl mx-auto py-10"&gt;
      &lt;h1 className="text-3xl font-bold mb-6"&gt;Latest Articles&lt;/h1&gt;
      &lt;ul className="space-y-4"&gt;
        {posts.map((post) => (
          &lt;li key={post.id} className="p-4 border rounded-lg hover:shadow-sm"&gt;
            &lt;h2 className="text-xl font-semibold"&gt;{post.title}&lt;/h2&gt;
            &lt;p className="text-gray-600"&gt;{post.description}&lt;/p&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>

<p class="wp-block-paragraph">Notice how clean this architecture is: the component runs as an asynchronous function. You query your database directly without building an intermediate REST API route just to retrieve data for the initial page load.</p>

<p class="wp-block-paragraph">Crucially, database connection strings, ORM libraries (like Prisma or Drizzle), and query logic remain strictly on the server. The browser receives only pure, static HTML and a lightweight React Server Component payload.</p>

<h3 class="wp-block-heading" id="core-benefits-of-rsc">Core Architectural Benefits of Server Components</h3>

<ul class="wp-block-list">
  <li><strong>Colocated Data Fetching:</strong> Fetch data right next to your database or internal microservices, drastically lowering Time to First Byte (TTFB).</li>
  <li><strong>Complete Credential Protection:</strong> Secure API tokens, database passwords, and private SDK keys never leave server memory.</li>
  <li><strong>Zero Client JavaScript:</strong> Dependencies used solely for data transformation or markdown rendering do not inflate the browser bundle.</li>
  <li><strong>Elimination of Waterfall Requests:</strong> Server-to-database round trips have sub-millisecond local latency compared to multi-round-trip mobile network handshakes.</li>
  <li><strong>Async/Await Simplicity:</strong> Write asynchronous code directly in the component body without managing complex <code>useEffect</code> or loading state booleans.</li>
</ul>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-lg text-sm text-slate-700">
  <strong>API Route Hardening:</strong> When you do need to expose dedicated public API routes or server endpoints alongside your server components, follow our complete guide on <a href="/blog/secure-nextjs-api-routes" class="text-blue-600 font-medium hover:underline">How to Build Secure APIs in Next.js: Authentication, Validation, and Rate Limiting</a>.
</div>

<h2 class="wp-block-heading" id="what-are-client-components">2. What are Client Components?</h2>

<p class="wp-block-paragraph">Client Components are React components that participate in client-side interactivity, hydration, and browser lifecycle event loops.</p>

<p class="wp-block-paragraph">They are required whenever your application needs to handle:</p>

<ul class="wp-block-list">
  <li><strong>Interactive State:</strong> Managing UI state with <code>useState</code>, <code>useReducer</code>, or React Context.</li>
  <li><strong>DOM Event Listeners:</strong> Responding to user actions like <code>onClick</code>, <code>onChange</code>, <code>onKeyDown</code>, and <code>onSubmit</code>.</li>
  <li><strong>Browser Side Effects:</strong> Running subscriptions, animations, or DOM measurements with <code>useEffect</code> and <code>useLayoutEffect</code>.</li>
  <li><strong>Browser-Specific Web APIs:</strong> Accessing <code>window</code>, <code>document</code>, <code>localStorage</code>, <code>navigator.clipboard</code>, or <code>IntersectionObserver</code>.</li>
  <li><strong>Custom React Hooks:</strong> Using hooks that depend on client state or browser context.</li>
</ul>

<p class="wp-block-paragraph">To mark a component as a Client Component, insert the <code>"use client"</code> directive at the very top of the file, above all imports.</p>

<h3 class="wp-block-heading" id="example-interactive-counter">Example: Interactive Counter with <code>useState</code></h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// src/components/counter.tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div className="inline-flex items-center space-x-3 p-3 border rounded-xl"&gt;
      &lt;span className="font-mono font-bold text-lg"&gt;Count: {count}&lt;/span&gt;
      &lt;button 
        onClick={() =&gt; setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      &gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p class="wp-block-paragraph">Without <code>"use client"</code>, Next.js will throw a build error immediately upon encountering <code>useState</code> or <code>onClick</code> inside a Server Component.</p>

<h3 class="wp-block-heading" id="example-live-search-filter">Example: Live Search Filter Input</h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// src/components/search.tsx
"use client";

import { useState } from "react";

export default function SearchInput({ onSearch }: { onSearch?: (q: string) =&gt; void }) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    &lt;div className="relative w-full max-w-md"&gt;
      &lt;input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search articles..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      /&gt;
      {query && (
        &lt;p className="text-xs text-gray-500 mt-1"&gt;Filtering by: "{query}"&lt;/p&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>

<h2 class="wp-block-heading" id="what-use-client-actually-does">3. What Does "use client" Actually Do?</h2>

<p class="wp-block-paragraph">A widespread misconception is that <code>"use client"</code> means a component renders <em>only</em> on the client browser. <strong>This is incorrect.</strong></p>

<p class="wp-block-paragraph">The <code>"use client"</code> directive is an architectural declaration that defines a boundary between the server and client module dependency graphs.</p>

<figure class="my-8">
  <img 
    src="/images/articles/react-server-vs-client-components/nextjs-request-hydration-lifecycle.webp" 
    alt="Next.js Request and Hydration Lifecycle: Step by step flow of Server Components pre-rendering, streaming HTML, and selective client hydration" 
    width="1200" 
    height="675" 
    class="rounded-xl border border-gray-200 shadow-sm w-full h-auto" 
  />
  <figcaption class="text-xs text-gray-500 text-center mt-2">
    Next.js Request & Hydration Lifecycle: Initial HTML streams immediately for fast First Contentful Paint (FCP), while only Client Components download JS bundles and hydrate in the browser.
  </figcaption>
</figure>

<p class="wp-block-paragraph">Here is what actually happens during execution:</p>

<ol class="wp-block-list">
  <li><strong>Initial Server Pre-Rendering:</strong> On the first page load, Next.js pre-renders Client Components to HTML on the server. The user gets fast First Contentful Paint (FCP) and readable markup before any JavaScript executes.</li>
  <li><strong>Selective Hydration:</strong> Once the browser downloads the client JavaScript bundle, React hydrates only the Client Components, attaching event listeners and synchronizing local state.</li>
  <li><strong>Client Module Boundary:</strong> Any file imported by a <code>"use client"</code> file is automatically considered part of the client bundle. If you import a heavy 200 KB utility inside a Client Component, that utility becomes part of the client bundle.</li>
</ol>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-lg text-sm text-slate-700">
  <strong>Performance Warning:</strong> Never place <code>"use client"</code> at the top of a page layout or high-level container simply to provide a single interactive feature. Placing it too high drags the entire component tree into the client bundle, degrading your site's Core Web Vitals.
</div>

<h2 class="wp-block-heading" id="when-to-use-server-components">4. When Should You Use Server Components?</h2>

<p class="wp-block-paragraph">Use Server Components whenever your component primarily displays data, performs backend computations, or generates content that does not require real-time client state.</p>

<h3 class="wp-block-heading">Top Use Cases for Server Components:</h3>

<ul class="wp-block-list">
  <li><strong>Database & ORM Queries:</strong> Fetching customer data, articles, product catalogs, or invoices directly via SQL, Prisma, or Drizzle.</li>
  <li><strong>Blog & Editorial Content:</strong> Articles, author biographies, category indexes, breadcrumbs, and metadata.</li>
  <li><strong>SEO-Critical Landing Pages:</strong> Above-the-fold content that search crawlers must index without running JavaScript.</li>
  <li><strong>Server-Side Integrations:</strong> Interacting with payment processors, third-party microservices, or private internal endpoints.</li>
  <li><strong>User Session & Permission Verification:</strong> Validating authentication cookies and role-based access before rendering secure administrative dashboards.</li>
</ul>

<h3 class="wp-block-heading" id="example-product-detail-page">Example: E-Commerce Product Detail Architecture</h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// src/app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise&lt;{ slug: string }&gt;;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    &lt;main className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8"&gt;
      &lt;div&gt;
        &lt;img 
          src={product.imageUrl} 
          alt={product.name} 
          className="rounded-xl w-full h-auto object-cover border" 
        /&gt;
      &lt;/div&gt;

      &lt;div className="space-y-4"&gt;
        &lt;h1 className="text-3xl font-extrabold"&gt;{product.name}&lt;/h1&gt;
        &lt;p className="text-gray-600 leading-relaxed"&gt;{product.description}&lt;/p&gt;
        &lt;div className="text-2xl font-bold font-mono"&gt;
          \${product.price.toFixed(2)}
        &lt;/div&gt;

        {/* Interactive client boundary isolated to this single button */}
        &lt;AddToCartButton productId={product.id} productName={product.name} /&gt;
      &lt;/div&gt;
    &lt;/main&gt;
  );
}</code></pre>

<p class="wp-block-paragraph">In this real-world example, 95% of the page is a Server Component with zero JavaScript overhead. The interactive <code>AddToCartButton</code> is an isolated Client Component located at the leaf of the tree.</p>

<h2 class="wp-block-heading" id="when-to-use-client-components">5. When Should You Use Client Components?</h2>

<p class="wp-block-paragraph">Use Client Components when the component needs to handle continuous user interaction, animation, dynamic form input, or browser hardware APIs.</p>

<h3 class="wp-block-heading">Top Use Cases for Client Components:</h3>

<ul class="wp-block-list">
  <li><strong>Interactive Forms:</strong> Inputs with real-time Zod validation, submission spinners, error toasts, and field reset handlers.</li>
  <li><strong>Modal Dialogs & Slide-Over Drawers:</strong> Components whose visibility toggles based on local boolean state.</li>
  <li><strong>Dynamic Dropdown Menus:</strong> Accessible navigation bars, hamburger menus, and context menus.</li>
  <li><strong>Interactive Data Visualizations:</strong> Charts with hover tooltips, zoom sliders, and selectable date ranges (e.g., Chart.js, Recharts).</li>
  <li><strong>Tabs & Accordions:</strong> Component panels that switch active content views on click.</li>
  <li><strong>Browser Geolocation & Local Storage:</strong> Theme toggles (dark/light mode), offline caching, or geolocation lookup.</li>
</ul>

<!-- RSC_ARCHITECT_TOOL -->

<h2 class="wp-block-heading" id="how-server-and-client-components-work-together">6. How Server and Client Components Work Together</h2>

<p class="wp-block-paragraph">You do not need to architect an entire page as exclusively Server or exclusively Client. The most effective Next.js applications combine both in a pattern known as <strong>Island Architecture</strong>.</p>

<p class="wp-block-paragraph">Consider an ecommerce catalog page. Instead of marking the entire page as a Client Component, decompose it into clear functional boundaries:</p>

<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs my-4 leading-relaxed"><code>CatalogPage (Server Component — Queries DB & Products)
│
├── CategoryFilterBar (Client Component — Manages active filter state)
│
├── ProductGrid (Server Component — Pre-renders product cards)
│   ├── ProductCard (Server Component — Static title, image, price)
│   │   └── QuickBuyButton (Client Component — Dispatches cart action)
│
└── PaginationControls (Client Component or URL Query Server Component)</code></pre>

<p class="wp-block-paragraph">By pushing Client Components down to the <strong>leaves</strong> of your component hierarchy, you preserve server rendering for data access while keeping interactive buttons responsive and fast.</p>

<h2 class="wp-block-heading" id="passing-data-across-the-boundary">7. Passing Data From Server to Client Components</h2>

<p class="wp-block-paragraph">Server Components can pass data to Client Components via standard React props. However, because props cross a network serialization boundary, they must adhere to React serialization rules.</p>

<h3 class="wp-block-heading">Supported Serializable Types:</h3>

<ul class="wp-block-list">
  <li>Primitives (strings, numbers, booleans, null, undefined)</li>
  <li>Plain JavaScript objects and Arrays</li>
  <li>Date instances (automatically serialized as ISO strings)</li>
  <li>Promises and React Elements (passed as children slots)</li>
</ul>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-red-600 rounded-r-lg text-sm text-slate-700">
  <strong>Non-Serializable Restriction:</strong> You cannot pass JavaScript functions, class instances, database connection pools, or symbols as props from a Server Component to a Client Component. If a Client Component needs to trigger server logic, use a <strong>Server Action</strong>.
</div>

<h2 class="wp-block-heading" id="can-client-render-server-component">8. Can a Client Component Render a Server Component?</h2>

<p class="wp-block-paragraph">A Client Component <strong>cannot directly import a Server Component</strong>. If you write <code>import ServerComp from "./ServerComp"</code> inside a <code>"use client"</code> file, Next.js converts that imported component into a Client Component, bundling all its dependencies into the browser.</p>

<p class="wp-block-paragraph">However, you can compose Server Components into Client Components using the <strong>React Children Slot Pattern</strong>.</p>

<figure class="my-8">
  <img 
    src="/images/articles/react-server-vs-client-components/nextjs-component-composition-slot-pattern.webp" 
    alt="Next.js Component Composition Slot Pattern: Passing a Server Component as children into a Client Component wrapper" 
    width="1200" 
    height="675" 
    class="rounded-xl border border-gray-200 shadow-sm w-full h-auto" 
  />
  <figcaption class="text-xs text-gray-500 text-center mt-2">
    The Slot Composition Pattern: By passing &lt;CartSummary /&gt; as children into &lt;Modal /&gt;, it executes on the server with 0 KB client bundle cost, even while nested inside an interactive client modal.
  </figcaption>
</figure>

<h3 class="wp-block-heading" id="example-modal-slot-composition">Example: Modal Wrapper with Server Child</h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// 1. Client Component: src/components/modal.tsx
"use client";

import { useState } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    &lt;&gt;
      &lt;button 
        onClick={() =&gt; setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      &gt;
        Open Cart
      &lt;/button&gt;

      {isOpen && (
        &lt;div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"&gt;
          &lt;div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"&gt;
            &lt;button 
              onClick={() =&gt; setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            &gt;
              ✕
            &lt;/button&gt;
            {/* Server Component rendered in this slot */}
            {children}
          &lt;/div&gt;
        &lt;/div&gt;
      )}
    &lt;/&gt;
  );
}

// 2. Server Component: src/components/cart-summary.tsx
import { db } from "@/lib/db";

export async function CartSummary() {
  // Direct server database query
  const cart = await db.cart.findFirst({
    include: { items: true },
  });

  return (
    &lt;div&gt;
      &lt;h3 className="text-xl font-bold mb-3"&gt;Your Shopping Cart&lt;/h3&gt;
      &lt;p className="text-gray-600"&gt;Items in cart: {cart?.items.length ?? 0}&lt;/p&gt;
    &lt;/div&gt;
  );
}

// 3. Parent Server Page: src/app/store/page.tsx
import { Modal } from "@/components/modal";
import { CartSummary } from "@/components/cart-summary";

export default function StorePage() {
  return (
    &lt;main className="p-8"&gt;
      &lt;h1 className="text-2xl font-bold mb-4"&gt;Online Store&lt;/h1&gt;
      &lt;Modal&gt;
        {/* CartSummary is created by Server Component parent! */}
        &lt;CartSummary /&gt;
      &lt;/Modal&gt;
    &lt;/main&gt;
  );
}</code></pre>

<p class="wp-block-paragraph">This pattern is one of the most powerful architectural techniques in modern React. It allows the modal shell to control browser interactivity (open/close animations) while the content inside is pre-rendered on the server with zero client JavaScript weight.</p>

<h2 class="wp-block-heading" id="avoiding-monolithic-client-apps">9. Avoid Turning Your Entire Application Into Client Components</h2>

<p class="wp-block-paragraph">A common architectural anti-pattern among teams migrating from traditional single-page apps (SPAs) is adding <code>"use client"</code> to the root layout file because one navigation element requires a mobile drawer toggle.</p>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// ❌ ANTI-PATTERN: Entire application forced into client module graph!
"use client";

import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;
        &lt;button onClick={() =&gt; setMobileMenuOpen(!mobileMenuOpen)}&gt;Menu&lt;/button&gt;
        {children}
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

<p class="wp-block-paragraph">When you place <code>"use client"</code> at the root layout, every component rendered beneath it is bundled into the client JavaScript payload. You lose all advantages of React Server Components.</p>

<h3 class="wp-block-heading" id="the-correct-architecture">The Correct Architecture: Isolate Navigation Into Leaf Components</h3>

<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4 font-mono"><code>// ✅ BEST PRACTICE: Keep layout as Server Component
// src/app/layout.tsx
import { NavigationBar } from "@/components/navigation-bar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html lang="en"&gt;
      &lt;body className="bg-slate-50 text-slate-900"&gt;
        &lt;NavigationBar /&gt;
        &lt;main&gt;{children}&lt;/main&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}

// src/components/navigation-bar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    &lt;nav className="p-4 bg-white border-b flex justify-between items-center"&gt;
      &lt;Link href="/" className="font-bold text-lg"&gt;ModernWebBuild&lt;/Link&gt;
      &lt;button 
        onClick={() =&gt; setIsOpen(!isOpen)}
        className="md:hidden px-3 py-1.5 border rounded"
        aria-label="Toggle Navigation"
      &gt;
        Menu
      &lt;/button&gt;
      {/* Navigation links */}
    &lt;/nav&gt;
  );
}</code></pre>

<h2 class="wp-block-heading" id="bundle-size-and-performance-impact">10. Performance & Bundle Size Impact: Hydration Cost vs RSC</h2>

<p class="wp-block-paragraph">Why does this distinction matter so much in production? The answer lies in the <strong>Cost of JavaScript</strong>.</p>

<p class="wp-block-paragraph">Every kilobyte of client JavaScript incurs a three-fold penalty on mobile devices: network transmission delay, CPU parse/compilation time, and React hydration execution.</p>

<figure class="my-8">
  <img 
    src="/images/articles/react-server-vs-client-components/javascript-bundle-hydration-comparison.webp" 
    alt="JavaScript bundle size and hydration cost comparison: Monolithic client architecture vs React Server Components architecture" 
    width="1200" 
    height="675" 
    class="rounded-xl border border-gray-200 shadow-sm w-full h-auto" 
  />
  <figcaption class="text-xs text-gray-500 text-center mt-2">
    Engineering comparison: Monolithic client bundles incur heavy Total Blocking Time (TBT) and poor INP, while Server Components achieve up to 90% bundle reduction and sub-100ms hydration times.
  </figcaption>
</figure>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-lg text-sm text-slate-700">
  <strong>Core Web Vitals Optimization:</strong> Reducing hydration overhead directly protects your site's Interaction to Next Paint (INP) score. Learn how to diagnose and optimize long tasks in our <a href="/blog/core-web-vitals-nextjs-optimization" class="text-blue-600 font-medium hover:underline">Core Web Vitals for Next.js: Practical Optimization Guide</a>.
</div>

<h2 class="wp-block-heading" id="architectural-decision-flowchart">11. Architectural Decision Framework</h2>

<p class="wp-block-paragraph">When creating any new component in Next.js, follow this sequential decision framework:</p>

<figure class="my-8">
  <img 
    src="/images/articles/react-server-vs-client-components/server-vs-client-component-decision-flowchart.webp" 
    alt="Architectural Decision Framework Flowchart: When to choose Server vs Client Components in Next.js" 
    width="1200" 
    height="675" 
    class="rounded-xl border border-gray-200 shadow-sm w-full h-auto" 
  />
  <figcaption class="text-xs text-gray-500 text-center mt-2">
    Developer Decision Tree: Start by defaulting every component to a Server Component, and promote only interactive nodes to Client Components at the leaves.
  </figcaption>
</figure>

<ol class="wp-block-list">
  <li><strong>Default to Server Component:</strong> Do not write <code>"use client"</code> by default. Build the component as an async Server Component first.</li>
  <li><strong>Check for Interactive Hooks:</strong> Does the component require <code>useState</code>, <code>useReducer</code>, or <code>useContext</code>? If yes, extract that interactive section into a Client Component.</li>
  <li><strong>Check for DOM Event Listeners:</strong> Does the component handle clicks, keyboard input, or form submits? If yes, make that specific control a Client Component.</li>
  <li><strong>Check for Browser APIs:</strong> Does it access <code>window</code>, <code>localStorage</code>, or device sensors? If yes, wrap that logic in a Client Component.</li>
  <li><strong>Interleave Using Slots:</strong> If a Client Component wraps static content (such as a modal or sidebar), pass the static content as <code>children</code> so it remains an unhydrated Server Component.</li>
</ol>

<h2 class="wp-block-heading" id="summary-and-conclusion">Summary & Best Practices Checklist</h2>

<p class="wp-block-paragraph">Modern Next.js architecture succeeds by combining the raw performance of server-rendered data pipelines with the rich interactivity of client-side React.</p>

<ul class="wp-block-list">
  <li>Keep data fetching, database queries, and private secrets inside Server Components.</li>
  <li>Keep <code>"use client"</code> boundaries small and push them to the lowest leaf nodes of your tree.</li>
  <li>Never mark root layouts or large page wrappers as Client Components.</li>
  <li>Use the <code>children</code> prop slot pattern to compose Server Components inside Client wrappers.</li>
  <li>Monitor your production bundles to ensure server libraries never slip across the client serialization boundary.</li>
</ul>

<div class="my-6 p-4 bg-slate-50 border-l-4 border-emerald-600 rounded-r-lg text-sm text-slate-700">
  <strong>Modernizing Legacy Codebases:</strong> If you are migrating an older WordPress or single-page React app to the Next.js App Router, explore our engineering roadmap on <a href="/blog/convert-wordpress-to-react" class="text-emerald-700 font-semibold hover:underline">How to Convert WordPress to React: Architecture, Data Migration & SEO Guide</a>.
</div>
