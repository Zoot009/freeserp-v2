import Image from "next/image";
import { Check } from "lucide-react";

/**
 * The presentational pieces every /audit-suite locale is built from.
 *
 * Server components with no state — they exist here rather than in each
 * page.tsx so that a spacing or shadow change lands on every locale at once.
 * Everything that differs between locales (copy, section order, currency) stays
 * in the locale's own page.tsx.
 */

/** A product screenshot's file and its intrinsic size. */
export type Shot = { src: string; width: number; height: number; alt: string };

/** The page column. 1072px, matching /tracking-suite. */
export const WRAP = "mx-auto w-full max-w-[1072px] px-5 sm:px-8";

export function SectionHead({
  tag,
  title,
  sub,
}: {
  tag: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-[66ch] text-center">
      <span className="audit-tag">{tag}</span>
      <h2 className="audit-h2 mt-5">{title}</h2>
      {sub && <p className="audit-lead mx-auto mt-4 max-w-[60ch]">{sub}</p>}
    </div>
  );
}

export function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[13.5px] leading-[1.45] text-[var(--body)]">
      <Check className="mt-px h-4 w-4 shrink-0 text-[var(--ink)]" strokeWidth={2.4} />
      {children}
    </li>
  );
}

/** The window bar above a screenshot. */
function ShotBar({ label }: { label?: string }) {
  return (
    <div className="audit-shot-bar">
      <span className="flex gap-1.5" aria-hidden>
        <i className="h-[7px] w-[7px] rounded-full bg-[#0d10201f]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#0d10201f]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#0d10201f]" />
      </span>
      {label && <span className="truncate text-[11px] text-[var(--muted)]">{label}</span>}
    </div>
  );
}

/** A product screenshot in browser chrome. */
export function ShotFrame({
  src,
  alt,
  width,
  height,
  sizes,
  label,
  priority,
}: Shot & { sizes: string; label?: string; priority?: boolean }) {
  return (
    <div className="audit-shot">
      {label && <ShotBar label={label} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </div>
  );
}
