import type { MetadataRoute } from "next";

// Canonical origin — hardcoded for the same reason as in app/sitemap.ts.
const SITE = "https://freeserp.com";

export default function robots(): MetadataRoute.Robots {
  // Every route on the marketing site is public and meant to be indexed
  // (home, /serp-checker, /blog, /blog/[slug], /privacy, /terms). The product
  // app and its API live on app.freeserp.com, so there's nothing to disallow.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
