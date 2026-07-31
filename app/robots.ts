import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All search engine bots
      { userAgent: "*", allow: "/" },
      // OpenAI GPT crawler
      { userAgent: "GPTBot", allow: "/" },
      // Anthropic Claude crawler
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity crawler
      { userAgent: "PerplexityBot", allow: "/" },
      // Google AI (Bard/Gemini extended crawling)
      { userAgent: "Google-Extended", allow: "/" },
      // Cohere AI
      { userAgent: "cohere-ai", allow: "/" },
      // Apple
      { userAgent: "Applebot", allow: "/" },
      // Meta AI
      { userAgent: "FacebookBot", allow: "/" },
      // Common AI scrapers
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
