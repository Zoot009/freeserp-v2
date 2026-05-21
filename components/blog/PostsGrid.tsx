"use client";

import { useMemo, useState } from "react";
import { COLORS } from "@/components/site/constants";
import type { BlogPost } from "@/lib/sanity";
import { PostCard } from "./PostCard";

function EmptyState({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "#0f1018" }}>
        {title}
      </div>
      <p style={{ fontSize: 15, color: COLORS.gray, margin: "8px 0 0" }}>{sub}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function PostsGrid({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.categories?.some((c) => c.toLowerCase().includes(q)),
    );
  }, [posts, query]);

  return (
    <>
      <div style={{ maxWidth: 460, margin: "0 auto 48px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, categories, authors…"
          aria-label="Search blog posts"
          className="fs-serp-input"
          style={{
            width: "100%",
            padding: "13px 16px",
            fontSize: 15,
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            outline: "none",
            background: "#fff",
            color: "#0f1018",
          }}
        />
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          sub="Publish a post in Sanity Studio and it will show up here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          sub={`Nothing matches “${query}”.`}
          action={
            <button
              type="button"
              onClick={() => setQuery("")}
              className="fs-btn"
              style={{
                border: `1px solid ${COLORS.border}`,
                background: "#fff",
                color: COLORS.blue,
                fontWeight: 600,
                fontSize: 14,
                padding: "9px 18px",
                borderRadius: 100,
                cursor: "pointer",
              }}
            >
              Clear search
            </button>
          }
        />
      ) : (
        <div className="fs-grid-3">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
