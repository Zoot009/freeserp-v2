import { COLORS } from "@/components/site/constants";
import type { BlogPost } from "@/lib/sanity";
import { PostCard } from "./PostCard";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section style={{ marginTop: 72, paddingTop: 48, borderTop: `1px solid ${COLORS.border}` }}>
      <div
        style={{
          fontSize: 12,
          fontFamily: "var(--font-geist-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: COLORS.blue,
        }}
      >
        Keep reading
      </div>
      <h2
        style={{
          fontSize: "clamp(24px, 3vw, 34px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          margin: "8px 0 28px",
          color: "#0f1018",
        }}
      >
        More from the blog
      </h2>

      <div className="fs-grid-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
