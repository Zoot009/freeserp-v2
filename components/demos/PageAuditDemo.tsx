"use client";

/**
 * Page Audit as a try-it card: one URL, graded by section, failed checks explained.
 *
 * Sections and the check → section mapping are the analyzer's own
 * (backend page-audit/analyzer: AuditSection seo / performance / ui / links /
 * technology / social, each rule's `section`). Check names, issue titles,
 * severities and the "why" / "how" texts are copied from the rules; grades use
 * the dashboard's sectionScoreToGrade and gradeTagline
 * (freeserp-frontend-v2 components/page-audit/audit-ui.tsx). Scores and findings
 * are example data.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronDown, FileSearch, XCircle } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  red: "#dc2626",
  amberInk: "#b45309",
};
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

type Sev = "CRITICAL" | "HIGH" | "MEDIUM";
const SEV: Record<Sev, { label: string; bg: string; fg: string; dot: string }> = {
  CRITICAL: { label: "Critical", bg: "#fdecec", fg: C.red, dot: C.red },
  HIGH: { label: "High", bg: "#fdecec", fg: C.red, dot: "#f97316" },
  MEDIUM: { label: "Medium", bg: "#fef3e2", fg: C.amberInk, dot: "#f5a623" },
};

const grade = (s: number) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F");
const TAGLINE: Record<string, string> = {
  A: "Your page is excellent!",
  B: "Your page is doing well",
  C: "Your page could be better",
  D: "Your page needs work",
  F: "Your page needs significant improvement",
};
const tone = (s: number) => (s >= 80 ? { fg: C.green, bg: "#e9f7ef" } : s >= 70 ? { fg: C.amberInk, bg: "#fef3e2" } : { fg: C.red, bg: "#fdecec" });

type Failed = { name: string; issue: string; severity: Sev; found: string; value?: string; why: string; how: string };
type Section = { key: string; label: string; score: number; failed: Failed[]; passed: string[] };

// ── Example audit ──────────────────────────────────────────────────────────
const PAGE_URL = "northpeak.com/shop/jackets/rain-shell";
const TITLE = "Rain Shell Jacket — Waterproof & Breathable";
const OVERALL = 76;

const SECTIONS: Section[] = [
  {
    key: "seo",
    label: "SEO",
    score: 88,
    failed: [
      {
        name: "Image Alt Text",
        issue: "Images Missing Alt Text",
        severity: "MEDIUM",
        found: "18 of 42 images have no alt attribute.",
        value: '<img src="/img/rain-shell-front.jpg">',
        why: 'Alt text is crucial for accessibility and image SEO. Search engines can\'t "see" images, so they rely on alt text to understand image content. It also helps images rank in Google Image Search, driving additional traffic.',
        how: 'Add descriptive alt text to all meaningful images: <img src="image.jpg" alt="descriptive text">. Describe what the image shows, include relevant keywords naturally, keep it concise (125 characters or less). Use alt="" for purely decorative images.',
      },
      {
        name: "Meta Description",
        issue: "Meta Description Too Short",
        severity: "MEDIUM",
        found: "The meta description is 64 characters.",
        value: "Our lightest waterproof shell for wet days on the trail and city.",
        why: "A compelling meta description can significantly improve your click-through rate from search results. It's your chance to advertise your content directly in search results and persuade users to click.",
        how: "Add a <meta name=\"description\" content=\"...\"> tag in your page's <head>. Keep it between 70-160 characters to avoid truncation. Include target keywords naturally and write compelling copy that encourages clicks.",
      },
    ],
    passed: ["Title Tag", "H1 Tag", "Canonical Tag", "HTTPS Redirect", "SSL Certificate", "Robots.txt Blocking", "Identity Schema", "Friendly URL", "H2-H6 Header Tag Usage", "Heading Hierarchy", "Keyword Consistency", "Noindex Tag", "Noindex HTTP Header", "Robots.txt", "Word Count", "XML Sitemap", "Charset UTF-8", "Deprecated HTML Tags", "Email Privacy", "Favicon", "Hreflang", "Language", "SERP Snippet"],
  },
  {
    key: "performance",
    label: "Performance",
    score: 58,
    failed: [
      {
        name: "Mobile Performance",
        issue: "Slow LCP on Mobile",
        severity: "CRITICAL",
        found: "Mobile LCP is 4100ms (should be <2500ms). This is a Core Web Vital that directly impacts search rankings.",
        value: "LCP 4.1s · CLS 0.04 · mobile",
        why: "Mobile-first indexing means Google primarily uses the mobile version of your site for ranking. A poor mobile score directly impacts rankings and frustrates the majority of users who browse on mobile.",
        how: "Focus on improving Core Web Vitals (LCP, INP, CLS), optimize images for mobile, minimize JavaScript, use responsive design, and leverage browser caching. Review the specific recommendations in PageSpeed Insights.",
      },
      {
        name: "Core Web Vitals",
        issue: "Poor Core Web Vitals",
        severity: "MEDIUM",
        found: "Largest Contentful Paint is over the 2.5s threshold.",
        why: "Core Web Vitals directly impact rankings and user experience. Pages with poor vitals may rank lower, lose traffic, and experience higher bounce rates.",
        how: "Improve LCP by optimizing images, removing render-blocking resources, and using a CDN. Reduce CLS by specifying image/video dimensions. Improve FID by minimizing JavaScript. Use Google PageSpeed Insights to identify specific issues.",
      },
      {
        name: "Image Optimization",
        issue: "Images Not Using Modern Formats",
        severity: "MEDIUM",
        found: "14 images are served as JPEG or PNG.",
        why: "Unoptimized images are the leading cause of slow page load times. Converting to modern formats like WebP provides 25-35% better compression than JPG/PNG with no visible quality loss.",
        how: "Convert images to WebP or AVIF format using tools like Squoosh, Sharp, or your CMS's image optimization feature. Serve correctly sized images (don't load 4000px images for 400px containers). Implement lazy loading for off-screen images.",
      },
    ],
    passed: ["Load Time", "Compression", "Desktop Performance", "Page Size", "JavaScript Errors", "Flash", "HTTP Requests", "Google AMP", "LLM Readability"],
  },
  {
    key: "ui",
    label: "UI/UX",
    score: 84,
    failed: [
      {
        name: "Tap Target Size",
        issue: "Many Tap Targets Too Small",
        severity: "HIGH",
        found: "12 tap targets are smaller than 48×48px.",
        why: "Small tap targets cause frustrating mis-taps on mobile devices, increasing bounce rates and hurting user experience. Google's mobile-friendliness assessment flags pages with too-small tap targets.",
        how: "Ensure all buttons and links are at least 48x48px in size or have at least 8px of spacing around them. Use CSS padding to increase the tap area without changing the visual size of the element.",
      },
    ],
    passed: ["Mobile Viewport", "Font Size", "IFrame Usage", "Inline Styles"],
  },
  { key: "links", label: "Links", score: 96, failed: [], passed: ["Link Structure"] },
  {
    key: "technology",
    label: "Technology",
    score: 86,
    failed: [
      {
        name: "DMARC Record",
        issue: "Missing DMARC Record",
        severity: "MEDIUM",
        found: "No DMARC record was found at _dmarc.northpeak.com.",
        why: "Major email providers like Gmail and Outlook now require or strongly recommend DMARC for email deliverability. Without it, your legitimate emails may be marked as spam and your domain can be used for phishing.",
        how: 'Add a DMARC TXT record to your domain DNS at "_dmarc.yourdomain.com" with value "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com". Start with p=none for monitoring, then tighten to p=quarantine or p=reject.',
      },
    ],
    passed: ["SPF Record", "Analytics", "DNS Nameservers", "HTTP/2", "IP Address", "Web Server"],
  },
  {
    key: "social",
    label: "Social",
    score: 52,
    failed: [
      {
        name: "Open Graph Tags",
        issue: "Missing Open Graph Tags",
        severity: "HIGH",
        found: "og:image and og:description are missing.",
        value: '<meta property="og:title" content="Rain Shell Jacket">',
        why: "Without OG tags, social platforms generate unpredictable previews using whatever text and image they find on the page. Proper OG tags increase click-through rates from social shares by 200-400%.",
        how: "Add at minimum og:title, og:description, and og:image to every page's <head>. Ensure og:image is at least 1200x630px. Use og:type=\"website\" for homepages and og:type=\"article\" for blog posts.",
      },
      {
        name: "Twitter Card Tags",
        issue: "Missing Twitter Card Tags",
        severity: "MEDIUM",
        found: "twitter:card is missing.",
        why: "Without Twitter Card tags, shared links appear as plain text URLs. With them, links display as rich cards with images and descriptions, significantly improving click-through rates and engagement.",
        how: "Add twitter:card, twitter:title, twitter:description, and twitter:image to your page's <head>. Use twitter:card=\"summary_large_image\" for the best visual impact. Twitter falls back to OG tags if Twitter-specific tags are absent.",
      },
    ],
    passed: ["Facebook Page", "Instagram Profile", "LinkedIn Profile", "Twitter/X Account", "YouTube Channel", "YouTube Activity", "Facebook Pixel"],
  },
];

const ALL_FAILED = SECTIONS.flatMap((s) => s.failed);
const CRITICAL = ALL_FAILED.filter((f) => f.severity === "CRITICAL").length;

export function PageAuditDemo() {
  const reduced = useReducedMotion() ?? false;
  const [tab, setTab] = useState("performance");
  const [open, setOpen] = useState<string | null>("Mobile Performance");
  const [showPassed, setShowPassed] = useState(false);

  const section = SECTIONS.find((s) => s.key === tab)!;
  const g = grade(OVERALL);
  const RING = 2 * Math.PI * 44;

  const pick = (key: string) => {
    setTab(key);
    setShowPassed(false);
    setOpen(SECTIONS.find((s) => s.key === key)!.failed[0]?.name ?? null);
  };

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <FileSearch size={15} style={{ color: C.blue }} aria-hidden />
            <span className="truncate">{TITLE}</span>
          </div>
          <div className="truncate font-mono text-[12px]" style={{ color: C.muted }}>{PAGE_URL}</div>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
          Example data
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl p-4 @2xl:flex-row @2xl:items-center" style={{ border: `1px solid ${C.border}` }}>
        <div className="flex shrink-0 items-center gap-4">
          <svg width="104" height="104" viewBox="0 0 104 104" role="img" aria-label={`Overall score ${OVERALL}, grade ${g}`}>
            <circle cx="52" cy="52" r="44" fill="none" stroke={C.soft} strokeWidth="9" />
            <motion.circle
              cx="52" cy="52" r="44" fill="none" stroke={tone(OVERALL).fg} strokeWidth="9" strokeLinecap="round"
              transform="rotate(-90 52 52)"
              strokeDasharray={RING}
              initial={{ strokeDashoffset: reduced ? RING * (1 - OVERALL / 100) : RING }}
              whileInView={{ strokeDashoffset: RING * (1 - OVERALL / 100) }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 1.1, ease: "easeOut" }}
            />
            <text x="52" y="61" textAnchor="middle" fontSize="28" fontWeight="700" fill={tone(OVERALL).fg}>{OVERALL}</text>
          </svg>
          <div>
            <div className="text-[15px] font-semibold">{TAGLINE[g]}</div>
            <div className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium" style={{ background: tone(OVERALL).bg, color: tone(OVERALL).fg }}>
              Grade {g}
            </div>
            <div className="mt-1.5 text-[12px]" style={{ color: C.muted }}>
              {ALL_FAILED.length} checks failed · {CRITICAL} critical
            </div>
          </div>
        </div>

        <div role="tablist" aria-label="Report sections" className="grid min-w-0 flex-1 grid-cols-3 gap-2 @2xl:grid-cols-6">
          {SECTIONS.map((s) => {
            const t = tone(s.score);
            const active = s.key === tab;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                id={`pa-tab-${s.key}`}
                aria-selected={active}
                aria-controls="pa-panel"
                onClick={() => pick(s.key)}
                className={`min-w-0 rounded-xl px-2 py-2.5 text-center transition-all hover:-translate-y-px ${FOCUS}`}
                style={{ background: t.bg, boxShadow: active ? `inset 0 0 0 2px ${t.fg}` : "none" }}
              >
                <div className="text-[20px] font-bold leading-none" style={{ color: t.fg }}>{grade(s.score)}</div>
                <div className="mt-1 truncate text-[12px] font-medium" style={{ color: t.fg }}>{s.label}</div>
                <div className="text-[11.5px] tabular-nums" style={{ color: t.fg, opacity: 0.8 }}>{s.score}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div id="pa-panel" role="tabpanel" aria-labelledby={`pa-tab-${tab}`} className="mt-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[14px] font-semibold">{section.label}</div>
          <div className="text-[12px]">
            {section.failed.length > 0 && <span className="font-medium" style={{ color: C.red }}>{section.failed.length} failed</span>}
            {section.failed.length > 0 && <span style={{ color: C.muted }}> · </span>}
            <span className="font-medium" style={{ color: C.green }}>{section.passed.length} passed</span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-2"
          >
            {section.failed.length === 0 && (
              <div className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px]" style={{ background: "#e9f7ef", color: C.green }}>
                <CheckCircle2 size={16} aria-hidden /> Every {section.label} check passed on this page.
              </div>
            )}
            {section.failed.map((f) => {
              const isOpen = open === f.name;
              return (
                <div key={f.name} className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : f.name)}
                    className={`flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors hover:bg-[#f9fafb] ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                  >
                    <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full" style={{ background: SEV[f.severity].dot }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[14px] font-semibold">{f.issue}</span>
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: SEV[f.severity].bg, color: SEV[f.severity].fg }}>
                          {SEV[f.severity].label}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[13px]" style={{ color: C.muted }}>{f.found}</span>
                    </span>
                    <ChevronDown size={16} className="mt-1 shrink-0 transition-transform" style={{ color: C.muted, transform: isOpen ? "rotate(180deg)" : "none" }} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 px-4 pb-4 pt-1 text-[13px] leading-relaxed @xl:pl-9">
                          <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: C.muted }}>
                            <XCircle size={13} color={C.red} aria-hidden /> {f.name}
                          </div>
                          {f.value && (
                            <div className="wrap-break-word rounded-xl px-3 py-2 font-mono text-[12px]" style={{ background: C.soft, border: `1px solid ${C.border}` }}>
                              {f.value}
                            </div>
                          )}
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Why it matters</div>
                            <p className="mt-0.5">{f.why}</p>
                          </div>
                          <div className="rounded-xl px-3 py-2.5" style={{ background: "#eef3ff" }}>
                            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.blue }}>How to fix</div>
                            <p className="mt-0.5">{f.how}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
              <button
                type="button"
                aria-expanded={showPassed}
                onClick={() => setShowPassed((v) => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#f9fafb] ${FOCUS}`}
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={15} color={C.green} aria-hidden />
                  {section.passed.length} passed {section.passed.length === 1 ? "check" : "checks"}
                </span>
                <ChevronDown size={16} className="transition-transform" style={{ color: C.muted, transform: showPassed ? "rotate(180deg)" : "none" }} aria-hidden />
              </button>
              {showPassed && (
                <ul className="flex flex-wrap gap-1.5 px-4 pb-3">
                  {section.passed.map((p) => (
                    <li key={p} className="rounded-full px-2.5 py-1 text-[12px]" style={{ background: "#e9f7ef", color: C.green }}>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
