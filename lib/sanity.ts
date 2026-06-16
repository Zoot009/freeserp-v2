/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Sanity client — connects to the same project freeserp-ui uses, so the blog
 * shares its content. projectId/dataset are public identifiers (not secrets);
 * they default here and can be overridden via .env.local.
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7lsuu424",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
});

const builder = imageUrlBuilder(client);

/** Build an image URL from a Sanity image reference. */
export function urlFor(source: any) {
  return builder.image(source);
}

/** A post as shown in listings/cards. */
export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
  categories?: string[];
};

/** A fully-resolved post for the detail page. */
export type BlogPostFull = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  _updatedAt?: string;
  body?: any;
  metaTitle?: string;
  metaDescription?: string;
  author?: { name: string; image?: any; bio?: any; url?: string };
  categories?: { title: string; slug: { current: string } }[];
};

/** All posts, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, mainImage, publishedAt,
      "author": author->name,
      "categories": categories[]->title
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

/** A homepage teaser post — same as a listing post, plus an estimated read time. */
export type LatestPost = BlogPost & { readMinutes?: number };

/** The newest posts, for the homepage blog section. */
export async function getLatestPosts(limit = 3): Promise<LatestPost[]> {
  return client.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit] {
      _id, title, slug, excerpt, mainImage, publishedAt,
      "author": author->name,
      "categories": categories[]->title,
      "readMinutes": round(length(pt::text(body)) / 1100)
    }`,
    { limit },
    { next: { revalidate: 60 } },
  );
}

/** A single post by slug, or null if it doesn't exist. */
export async function getPost(slug: string): Promise<BlogPostFull | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, _updatedAt, title, slug, excerpt, mainImage, publishedAt, body, metaTitle, metaDescription,
      "author": author->{name, image, bio, url},
      "categories": categories[]->{title, slug}
    }`,
    { slug },
    { next: { revalidate: 30 } },
  );
}

/** Recent posts excluding the current one — for the "more from the blog" rail. */
export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  return client.fetch(
    `*[_type == "post" && slug.current != $currentSlug] | order(publishedAt desc)[0...$limit] {
      _id, title, slug, excerpt, mainImage, publishedAt,
      "author": author->name,
      "categories": categories[]->title
    }`,
    { currentSlug, limit },
    { next: { revalidate: 60 } },
  );
}
