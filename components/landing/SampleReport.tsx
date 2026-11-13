import { Download, ExternalLink, FileText } from "lucide-react";

/**
 * "See the report" — dropped into every landing page whose tool produces a
 * downloadable report, so a visitor can open (or save) exactly what they will
 * get before signing up.
 *
 * The reports themselves are static, self-contained HTML files in
 * public/reports/, built to mirror the real report each tool generates
 * and stamped "Example data" (with a made-up-data notice) on every page — including when
 * printed — so a saved copy can never pass for real data.
 *
 * Self-styled with the homepage palette (components/site/constants.ts COLORS)
 * and Tailwind utilities only, so it sits correctly on every landing page
 * regardless of which design system that page uses. Pure server component.
 * Copy comes in as props so localized pages can translate it.
 */

export interface SampleReportCopy {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  view: string;
  download: string;
  note: string;
}

export const SAMPLE_REPORT_EN: Omit<SampleReportCopy, "title" | "description" | "points"> = {
  eyebrow: "Report",
  view: "View report",
  download: "Download",
  note: "Example data — opens in a new tab. Use “Download PDF” inside to save it as a PDF.",
};

export function SampleReport({
  copy,
  href,
  fileName,
  reportName,
  id = "report",
  spacing = "py-16 sm:py-24",
}: {
  copy: SampleReportCopy;
  /** Path under public/, e.g. "/reports/rank-tracking-report.html". */
  href: string;
  /** Name the file is saved under when downloaded. */
  fileName: string;
  /** Shown on the paper preview, e.g. "Rank Tracking Report". */
  reportName: string;
  id?: string;
  /** Vertical padding, so the section matches the rhythm of the page it sits in. */
  spacing?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${spacing}`}>
      <div className="mx-auto w-full max-w-[1139px] px-5 sm:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-[24px] border border-[#eaeaea] bg-[#f5f6f8] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0454ff] px-3 py-1 text-[12px] font-semibold tracking-[0.04em] text-white uppercase">
              <FileText className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
              {copy.eyebrow}
            </span>
            <h2 className="mt-5 text-[clamp(26px,3.4vw,40px)] leading-[1.12] font-semibold tracking-[-1px] text-black">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.6] text-[#6d6d6d]">
              {copy.description}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {copy.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[14px] leading-[1.45] text-[#3d3d3d]">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0454ff]"
                    aria-hidden
                  />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-[10px] bg-black px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#1f1f1f]"
              >
                {copy.view}
                <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden />
              </a>
              <a
                href={href}
                download={fileName}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#eaeaea] bg-white px-5 py-3 text-[15px] font-medium text-black transition-colors hover:border-[#d1d5db]"
              >
                <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
                {copy.download}
              </a>
            </div>
            <p className="mt-3 text-[12.5px] text-[#8a8a93]">{copy.note}</p>
          </div>

          <PaperPreview reportName={reportName} href={href} label={copy.view} />
        </div>
      </div>
    </section>
  );
}

/**
 * A stylised stack of report pages — deliberately abstract (bars, not numbers),
 * so it reads as "a report" without presenting figures of its own. The real
 * content is one click away.
 */
function PaperPreview({ reportName, href, label }: { reportName: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="group relative mx-auto block w-full max-w-[420px] pt-4 pr-4"
    >
      {/* the pages behind */}
      <span className="absolute top-0 right-0 bottom-4 left-4 rounded-[18px] border border-[#eaeaea] bg-white opacity-60" />
      <span className="absolute top-2 right-2 bottom-2 left-2 rounded-[18px] border border-[#eaeaea] bg-white opacity-80" />

      {/* the front page */}
      <span className="relative block rounded-[18px] border border-[#eaeaea] bg-white p-5 shadow-[0_30px_60px_-34px_rgba(3,21,90,0.45)] transition-transform duration-300 group-hover:-translate-y-1">
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#0454ff]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                <path d="M12 0 C12.3 6.6 17.4 11.7 24 12 C17.4 12.3 12.3 17.4 12 24 C11.7 17.4 6.6 12.3 0 12 C6.6 11.7 11.7 6.6 12 0 Z" />
              </svg>
            </span>
            <span className="text-[12px] font-semibold text-black">FreeSerp</span>
          </span>
          <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-[#03155a] uppercase">
            Example
          </span>
        </span>

        <span className="mt-4 block text-[17px] font-semibold tracking-[-0.4px] text-black">
          {reportName}
        </span>
        <span className="mt-1.5 block h-2 w-2/5 rounded-full bg-[#eaeaea]" />

        <span className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4">
          <span
            className="relative grid h-16 w-16 place-items-center rounded-full"
            style={{ background: "conic-gradient(#0454ff 0 72%, #ebf1ff 0)" }}
            aria-hidden
          >
            <span className="absolute inset-[7px] rounded-full bg-white" />
          </span>
          <span className="grid gap-2">
            <span className="h-2 w-full rounded-full bg-[#dbe6ff]" />
            <span className="h-2 w-4/5 rounded-full bg-[#eaeaea]" />
            <span className="h-2 w-3/5 rounded-full bg-[#eaeaea]" />
          </span>
        </span>

        <span className="mt-5 grid grid-cols-3 gap-2" aria-hidden>
          {["#0454ff", "#4a8fff", "#03155a"].map((c) => (
            <span key={c} className="rounded-[10px] border border-[#eaeaea] p-2.5">
              <span className="block h-1.5 w-3/5 rounded-full bg-[#eaeaea]" />
              <span className="mt-2 block h-3 w-2/5 rounded-full" style={{ background: c }} />
            </span>
          ))}
        </span>

        <span className="mt-5 grid gap-1.5" aria-hidden>
          {[92, 78, 85, 64].map((w, i) => (
            <span key={i} className="flex items-center gap-2 rounded-[8px] bg-[#f5f6f8] px-2.5 py-2">
              <span className="h-1.5 rounded-full bg-[#cfd6e4]" style={{ width: `${w * 0.55}%` }} />
              <span className="ml-auto h-1.5 w-6 rounded-full bg-[#4a8fff]" />
            </span>
          ))}
        </span>

        <span className="mt-5 flex items-center justify-center gap-2 rounded-[10px] bg-black py-2.5 text-[13px] font-medium text-white">
          {label}
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
      </span>
    </a>
  );
}
