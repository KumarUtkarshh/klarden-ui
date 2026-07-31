import { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";
import { SITE_CONFIG } from "@/lib/constants";
import fs from "fs";
import path from "path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = getAllDocs();
  const DOCS_PATH = path.join(process.cwd(), "content/docs");

  const docUrls = docs.map((doc) => {
    const filePath = path.join(DOCS_PATH, doc.slug) + ".mdx";
    let lastModified: string;
    try {
      lastModified = fs.statSync(filePath).mtime.toISOString();
    } catch {
      lastModified = new Date().toISOString();
    }

    // Prioritize: introduction > components > backgrounds
    const isIntro = doc.slug === "introduction";
    const isComponent = doc.slug.startsWith("components/");
    const priority = isIntro ? 0.9 : isComponent ? 0.8 : 0.7;
    const changeFreq = isIntro ? "weekly" : ("monthly" as const);

    return {
      url: `${SITE_CONFIG.url}/docs/${doc.slug}`,
      lastModified,
      changeFrequency: changeFreq as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority,
    };
  });

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...docUrls,
  ];
}
