import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/sanity";

// The marketing site's canonical origin. Hardcoded on purpose — freeserp.com is
// fixed across environments, and a sitemap must always point at the production
// domain. Matches `metadataBase` in app/layout.tsx.
const SITE = "https://freeserp.com";

// Re-render the sitemap alongside the blog so new posts appear within a minute
// without a rebuild (mirrors `revalidate` in app/blog/page.tsx).
export const revalidate = 60;

/** Parse an ISO date, falling back to "now" for missing/garbage values. */
function safeDate(iso?: string): Date {
  if (!iso) return new Date();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE}/serp-checker`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // Sanity unreachable — ship the static routes rather than failing the sitemap.
  }

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: `${SITE}/blog/${p.slug.current}`,
      lastModified: safeDate(p.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...postRoutes];
}
