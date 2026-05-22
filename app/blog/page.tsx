import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PostsGrid } from "@/components/blog/PostsGrid";
import { getAllPosts, type BlogPost } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Blog — SEO Insights & Guides | FreeSERP",
  description:
    "Expert tips, strategies, and insights to improve your search rankings and dominate SERPs. Free SEO guides from the FreeSERP team.",
  alternates: { canonical: "https://freeserp.com/blog" },
  openGraph: {
    type: "website",
    title: "Blog — SEO Insights & Guides | FreeSERP",
    description:
      "Expert SEO tips, strategies, and insights to improve your search rankings and dominate SERPs.",
    url: "https://freeserp.com/blog",
    siteName: "FreeSERP",
  },
};

// New posts appear within a minute without a rebuild.
export const revalidate = 60;

const heroSection: CSSProperties = {
  position: "relative",
  paddingTop: 160,
  paddingBottom: 90,
  textAlign: "center",
  backgroundImage:
    "linear-gradient(rgba(8,10,22,.74), rgba(8,10,22,.84)), url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    // Sanity unreachable — render the empty state instead of crashing.
  }

  return (
    <>
      <Nav currentNav="Blog" />

      <header className="fs-blog-hero" style={heroSection}>
        <div className="fs-blog-hero-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#9db4ff",
            }}
          >
            SEO Insights &amp; Guides
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "16px 0 0",
            }}
          >
            The FreeSERP Blog
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.72)",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 560,
              margin: "16px auto 0",
            }}
          >
            Expert tips, strategies, and insights to improve your search rankings and dominate
            SERPs.
          </p>
        </div>
      </header>

      <main className="fs-blog-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px 110px" }}>
        <PostsGrid posts={posts} />
      </main>

      <Footer />
    </>
  );
}
