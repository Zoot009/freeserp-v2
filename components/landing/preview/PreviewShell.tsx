"use client";

import { Ic } from "./icons";

/**
 * The dashboard chrome: preview bar, collapsed icon rail, global top bar, and
 * the project header. Everything here is CHROME, not data.
 *
 * Both the loading skeleton and the filled dashboard render inside this same
 * component, which is what guarantees the swap between them cannot shift the
 * page — the shell is literally the same DOM in both states, and only
 * `children` changes.
 *
 * That is also why the project identity (favicon, name, domain, breadcrumb) is
 * real from the very first frame rather than skeletonised: the visitor typed the
 * domain a moment ago, so we already know it. Real apps behave this way — the
 * shell paints instantly and only the data streams in.
 *
 * Transcribed from freeserp-frontend-v2/components/dashboard/shell.tsx and the
 * project keywords page. The rail is drawn in its COLLAPSED 64px state, where
 * the app hides the logo, wordmark, section headings and upgrade card, leaving
 * the blue toggle square on top and the avatar pinned at the bottom.
 */

export type ShellDict = {
  close: string;
  crumbWorkspace: string;
  crumbProjects: string;
  crumbKeywords: string;
  topSearch: string;
  allProjects: string;
  autoCheck: string;
  autoCheckOff: string;
  autoCheckSub: string;
  addKeywords: string;
  language: string;
};

const RAIL_TOP = [Ic.dash, Ic.folder, Ic.key, Ic.starFilled];
const RAIL_BOTTOM = [Ic.zap, Ic.search, Ic.monitor, Ic.settings];

/** One of the top bar's two 30px usage rings. Static — nothing is metered here. */
function Ring({ color, value }: { color: string; value: string }) {
  const r = (30 - 3) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" aria-hidden>
      <g transform="rotate(-90 15 15)">
        <circle cx={15} cy={15} r={r} fill="none" stroke={color} strokeWidth={3} opacity={0.18} />
        <circle
          cx={15}
          cy={15}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`0 ${c}`}
        />
      </g>
      <text x={15} y={15} textAnchor="middle" dominantBaseline="central" className="fsp-ring-val">
        {value}
      </text>
    </svg>
  );
}

export default function PreviewShell({
  dict,
  domain,
  brand,
  favicon,
  onClose,
  children,
}: {
  dict: ShellDict;
  domain: string;
  brand: string;
  /** Pre-resolved favicon URL, or null to fall back to the initial tile. */
  favicon: string | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fsp-previewbar">
        {/* Left cell kept so the Close button stays right-aligned. */}
        <span />
        <button type="button" className="fsp-close" onClick={onClose}>
          {dict.close}
        </button>
      </div>

      <div className="fsp-app">
        {/* Collapsed 64px rail */}
        <aside className="fsp-rail" aria-hidden>
          <div className="fsp-rail-brand">
            <span className="fsp-rail-toggle">
              <Ic.chevR size={12} />
            </span>
          </div>
          {RAIL_TOP.map((Icon, i) => (
            <span key={`t${i}`} className={`fsp-rail-item${i === 1 ? " active" : ""}`}>
              <Icon />
            </span>
          ))}
          {RAIL_BOTTOM.map((Icon, i) => (
            <span key={`b${i}`} className={`fsp-rail-item${i === 0 ? " group" : ""}`}>
              <Icon />
            </span>
          ))}
          <div className="fsp-rail-spacer" />
          <div className="fsp-rail-user">
            <span className="fsp-avatar">{brand.slice(0, 2)}</span>
          </div>
        </aside>

        <div className="fsp-main">
          {/* Global top bar */}
          <div className="fsp-topbar">
            {/* The two leading crumbs + their separators drop out on mobile,
                leaving just "brand › Keywords" so the trail fits a phone. */}
            <div className="fsp-crumbs">
              <span className="fsp-crumb hide-sm">{dict.crumbWorkspace}</span>
              <span className="fsp-sep hide-sm">
                <Ic.chevR />
              </span>
              <span className="fsp-crumb hide-sm">{dict.crumbProjects}</span>
              <span className="fsp-sep hide-sm">
                <Ic.chevR />
              </span>
              <span className="fsp-crumb">{brand}</span>
              <span className="fsp-sep">
                <Ic.chevR />
              </span>
              <span className="fsp-crumb cur">{dict.crumbKeywords}</span>
            </div>

            <div className="fsp-search" aria-hidden>
              <span className="ic">
                <Ic.search />
              </span>
              <input readOnly tabIndex={-1} placeholder={dict.topSearch} />
            </div>

            <span className="fsp-usage" aria-hidden>
              <span className="fsp-plan">Pro</span>
              <Ring color="#2d5bff" value="0" />
              <Ring color="#0d9488" value="0" />
              <span style={{ color: "var(--text-mute)", display: "inline-flex" }}>
                <Ic.chevD size={14} />
              </span>
            </span>

            <span className="fsp-icon-btn hide-sm" aria-hidden>
              <Ic.moon />
            </span>

            <span className="fsp-lang" aria-hidden>
              {dict.language}
              <span className="caret">
                <Ic.chevD />
              </span>
            </span>

            <span className="fsp-icon-btn" aria-hidden>
              <Ic.bell />
              <i className="fsp-bell-dot" />
            </span>
          </div>

          {/* Page */}
          <div className="fsp-page">
            <div className="fsp-page-h">
              <div style={{ minWidth: 0 }}>
                <span className="fsp-back">← {dict.allProjects}</span>
                <div className="fsp-ident">
                  <span className="fsp-favicon">
                    {favicon ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- third-party favicon, not a local optimizable asset */
                      <img src={favicon} alt="" width={22} height={22} style={{ borderRadius: 5 }} />
                    ) : (
                      brand.charAt(0)
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="fsp-h1">{brand}</span>
                      {/* 26x26 and borderless at .6 opacity — not the 34x34
                          outlined default the other icon buttons use. */}
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          display: "grid",
                          placeItems: "center",
                          color: "var(--text-mute)",
                          opacity: 0.6,
                        }}
                      >
                        <Ic.pencil />
                      </span>
                    </div>
                    <div className="fsp-domain">{domain}</div>
                  </div>
                </div>
              </div>

              <div className="fsp-actions-col" aria-hidden>
                <div className="fsp-autocheck">
                  <div>
                    <div className="fsp-ac-lbl">{dict.autoCheck}</div>
                    <div className="fsp-ac-val">{dict.autoCheckSub}</div>
                  </div>
                  <span className="fsp-toggle">
                    <span className="fsp-track-sw">
                      <i />
                    </span>
                    {dict.autoCheckOff}
                  </span>
                </div>
                <div className="fsp-btns">
                  <span className="fsp-btn primary">
                    <Ic.plus />
                    {dict.addKeywords}
                  </span>
                  {/* Sizes are deliberately uneven — bell 16, globe 14, trash 14
                      inside the same control, exactly as the app renders them.
                      Normalising them is the most common "too tidy" error. */}
                  <span className="fsp-icon-group">
                    <span>
                      <Ic.bell size={16} />
                    </span>
                    <span>
                      <Ic.globe size={14} />
                    </span>
                    <span>
                      <Ic.trash size={14} />
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
