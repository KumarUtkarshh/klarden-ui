import { mdxComponents } from "@/components/docs/mdx-components";
import { getAdjacentDocs, getDocBySlug, getDocSlugs } from "@/lib/docs";
import { SITE_CONFIG } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpenInChatGPTButton } from "@/components/docs/open-in-chatgpt-button";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {};
  }

  const url = `${SITE_CONFIG.url}/docs/${doc.slug}`;
  const componentKeywords = [
    doc.title,
    `${doc.title} React component`,
    `${doc.title} Next.js`,
    `animated ${doc.title}`,
    `${doc.title} Framer Motion`,
    `${doc.title} Tailwind CSS`,
    `how to use ${doc.title}`,
    `${doc.title} example`,
    "Klarden UI",
    "copy paste React component",
    "animated React component",
  ];

  return {
    title: `${doc.title} — Animated React Component`,
    description: doc.description,
    keywords: componentKeywords,
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.authorUrl }],
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: `${doc.title} | ${SITE_CONFIG.name}`,
      description: doc.description,
      type: "article",
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${doc.title} — ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | ${SITE_CONFIG.name}`,
      description: doc.description,
      images: [SITE_CONFIG.defaultOgImage],
      creator: SITE_CONFIG.twitter,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({
    slug: slug.split("/"),
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const { prev, next } = getAdjacentDocs(doc.slug);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE_CONFIG.url}/docs/${doc.slug}#article`,
    headline: `${doc.title} React Component — Klarden UI`,
    description: doc.description,
    keywords: `${doc.title}, React component, animated, Framer Motion, Tailwind CSS, Next.js, Klarden UI`,
    url: `${SITE_CONFIG.url}/docs/${doc.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/docs/${doc.slug}`,
    },
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.svg`,
      },
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Docs", item: `${SITE_CONFIG.url}/docs/introduction` },
      { "@type": "ListItem", position: 3, name: doc.category || "Components", item: `${SITE_CONFIG.url}/docs/${doc.slug.split("/")[0]}` },
      { "@type": "ListItem", position: 4, name: doc.title, item: `${SITE_CONFIG.url}/docs/${doc.slug}` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${doc.title} component in Klarden UI?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: doc.description || `The ${doc.title} is a premium animated React component from Klarden UI, built with Framer Motion and Tailwind CSS for use in Next.js and React applications.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I install the ${doc.title} component?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Install the ${doc.title} component using the Klarden UI registry CLI: run \`npx shadcn@latest add ${SITE_CONFIG.url}/r/${doc.slug.split("/").pop()}.json\` in your project terminal. No npm package required — the component is copied directly into your source code.`,
        },
      },
      {
        "@type": "Question",
        name: `Is the ${doc.title} component free to use?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, the ${doc.title} component is completely free and open-source under the MIT License. It is part of Klarden UI, a free React component library for design engineers.`,
        },
      },
    ],
  };

  return (
    <div className="space-y-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      {/* Breadcrumbs - Premium UI/UX Style */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <Link
          href="/docs/introduction"
          className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
        >
          Docs
        </Link>
        <ChevronRight size={12} className="text-zinc-400 dark:text-zinc-300 shrink-0" />
        <span className="truncate">{doc.category}</span>
        <ChevronRight size={12} className="text-zinc-400 dark:text-zinc-300 shrink-0" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate">{doc.title}</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
            {doc.title}
          </h1>

          {/* Page Actions - Top Right */}
          <div className="flex items-center gap-2 shrink-0">
            <OpenInChatGPTButton title={doc.title} description={doc.description} url={`${SITE_CONFIG.url}/docs/${doc.slug}`} />

            <div className="flex items-center gap-1">
              {prev ? (
                <Link
                  href={`/docs/${prev.slug}`}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 text-muted-foreground/80 hover:text-foreground hover:bg-zinc-100/50 dark:hover:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                  title={`Prev: ${prev.title}`}
                >
                  <ChevronLeft size={14} />
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 opacity-30 text-muted-foreground/40 cursor-not-allowed">
                  <ChevronLeft size={14} />
                </div>
              )}

              {next ? (
                <Link
                  href={`/docs/${next.slug}`}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 text-muted-foreground/80 hover:text-foreground hover:bg-zinc-100/50 dark:hover:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                  title={`Next: ${next.title}`}
                >
                  <ChevronRight size={14} />
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 opacity-30 text-muted-foreground/40 cursor-not-allowed">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          </div>
        </div>

        {doc.description && (
          <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium tracking-tight leading-relaxed max-w-3xl">
            {doc.description}
          </p>
        )}
      </header>

      <div className="h-px w-full bg-linear-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />

      <article className="prose prose-zinc dark:prose-invert max-w-none prose-sm sm:prose-base">
        <MDXRemote source={doc.content} components={mdxComponents} />
      </article>
    </div>
  );
}
