import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { getLatestPosts, urlFor, type LatestPost } from "@/lib/sanity";

// Rotating tag colours so three consecutive cards don't look identical.
const TAG_PALETTE = [
  { bg: COLORS.redBg, color: COLORS.red },
  { bg: COLORS.blueBg, color: COLORS.blue },
  { bg: "#f1ecff", color: COLORS.purple },
];

function formatDate(iso?: string) {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (d.getFullYear() < 2000) return "Recently";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function metaLabel(p: LatestPost) {
  const mins = p.readMinutes ?? 0;
  return mins > 0 ? `${mins} min read` : formatDate(p.publishedAt);
}

export async function Blog() {
  let posts: LatestPost[] = [];
  try {
    posts = await getLatestPosts(3);
  } catch {
    // Sanity unreachable — fall through to the empty check below.
  }

  // No posts yet (or Sanity down) — hide the section rather than show placeholders.
  if (posts.length === 0) return null;

  return (
    <section className="fs-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
      <SectionHead
        tag="BLOG"
        title="SEO playbooks, SERP deep-dives, and ranking tactics"
        sub="Actionable guides for SEOs, marketers, and developers — written by people who actually rank pages."
      />
      <div className="fs-grid-3" style={{ marginTop: 56 }}>
        {posts.map((p, i) => {
          const tag = p.categories?.[0];
          const palette = TAG_PALETTE[i % TAG_PALETTE.length];
          const hasImage = Boolean(p.mainImage?.asset);
          return (
            <Reveal key={p._id} delay={(i % 3) * 0.08}>
              <Link
                href={`/blog/${p.slug.current}`}
                className="fs-card"
                style={{
                  display: "block",
                  background: COLORS.softGray,
                  borderRadius: 12,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  height: "100%",
                }}
              >
                {hasImage ? (
                  <Image
                    src={urlFor(p.mainImage).width(800).height(593).url()}
                    alt={p.title}
                    width={800}
                    height={593}
                    sizes="(max-width: 1000px) 50vw, 400px"
                    style={{
                      width: "calc(100% - 16px)",
                      height: "auto",
                      margin: 8,
                      borderRadius: 12,
                      aspectRatio: "1.35",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "calc(100% - 16px)",
                      margin: 8,
                      borderRadius: 12,
                      aspectRatio: "1.35",
                      background: `linear-gradient(135deg, ${COLORS.blueBg}, #dbe6ff)`,
                    }}
                  />
                )}
                <div style={{ padding: "0 30px 30px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {tag && (
                      <span
                        style={{
                          background: palette.bg,
                          color: palette.color,
                          padding: "6px 16px",
                          borderRadius: 100,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    )}
                    <span
                      style={{ width: 6, height: 6, borderRadius: 3, background: "#3d3d3d" }}
                    />
                    <span style={{ fontSize: 14, color: COLORS.black }}>{metaLabel(p)}</span>
                  </div>
                  <h5
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      margin: "0 0 12px",
                    }}
                  >
                    {p.title}
                  </h5>
                  {p.excerpt && (
                    <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
