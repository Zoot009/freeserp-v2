import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PortableBody } from "@/components/blog/PortableBody";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { COLORS } from "@/components/site/constants";
import { getAllPosts, getPost, getRelatedPosts, urlFor } from "@/lib/sanity";

const SITE = "https://freeserp.com";

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((p) => ({ slug: p.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await getPost(slug);
  } catch {
    // fall through to the not-found metadata
  }

  if (!post) {
    return { title: "Post Not Found | FreeSERP Blog" };
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription || post.excerpt || `Read ${post.title} on the FreeSERP blog.`;
  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/blog/${slug}` },
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE}/blog/${slug}`,
      siteName: "FreeSERP",
      publishedTime: post.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function readingTime(body: unknown) {
  if (!body) return 1;
  const words = JSON.stringify(body).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso?: string) {
  if (!iso) return "Recently published";
  const d = new Date(iso);
  if (d.getFullYear() < 2000) return "Recently published";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

const heroSection: CSSProperties = {
  position: "relative",
  paddingTop: 150,
  paddingBottom: 64,
  backgroundImage:
    "linear-gradient(rgba(8,10,22,.76), rgba(8,10,22,.86)), url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};
const darkChip: CSSProperties = {
  padding: "4px 11px",
  borderRadius: 100,
  background: "rgba(255,255,255,.1)",
  border: "1px solid rgba(255,255,255,.18)",
  color: "#cdd9ff",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontFamily: "var(--font-geist-mono)",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.mainImage?.asset
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined,
    datePublished: post.publishedAt,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@type": "Organization", name: "FreeSERP" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav currentNav="Blog" />

      <header className="fs-blog-post-hero" style={heroSection}>
        <div className="fs-blog-post-hero-inner" style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
          <Link
            href="/blog"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.6)",
              textDecoration: "none",
            }}
          >
            ← All articles
          </Link>

          {post.categories && post.categories.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "22px 0 0" }}>
              {post.categories.map((cat) => (
                <span key={cat.slug?.current || cat.title} style={darkChip}>
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              margin: "18px 0 0",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
              color: "rgba(255,255,255,.62)",
            }}
          >
            <span>{post.author?.name || "FreeSERP"}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>·</span>
            <span>{readingTime(post.body)} min read</span>
          </div>
        </div>
      </header>

      <main className="fs-blog-post-main" style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px 110px" }}>
        {post.mainImage?.asset && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              marginTop: -48,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 30px 60px rgba(8,32,96,.20)",
              background: COLORS.softGray,
            }}
          >
            <Image
              src={urlFor(post.mainImage).width(1600).height(900).url()}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 820px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <article style={{ marginTop: 40 }}>
          {post.excerpt && (
            <p
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                fontWeight: 500,
                color: "#0f1018",
                margin: "0 0 28px",
              }}
            >
              {post.excerpt}
            </p>
          )}
          <PortableBody value={post.body} />
        </article>

        {post.author?.bio && (
          <div
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            {post.author.image?.asset && (
              <div
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={urlFor(post.author.image).width(112).height(112).url()}
                  alt={post.author.name}
                  fill
                  sizes="56px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-geist-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: COLORS.subtle,
                }}
              >
                About the author
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#0f1018", margin: "4px 0 6px" }}>
                {post.author.name}
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray }}>
                <PortableBody value={post.author.bio} />
              </div>
            </div>
          </div>
        )}

        <RelatedPosts posts={related} />
      </main>

      <Footer />
    </>
  );
}
