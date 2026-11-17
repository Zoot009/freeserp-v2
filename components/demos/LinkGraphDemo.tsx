"use client";

/**
 * Internal Link Analysis as a try-it card: a live, draggable link graph.
 *
 * Mirrors the dashboard graph (freeserp-frontend-v2 components/internal-link-graph.tsx):
 * the four node classes and their order (orphan > hub > authority > normal),
 * node radius from inbound links (graphNodeRadius), "Linked from" / "Links to"
 * in the side panel, and depth as click distance from the homepage
 * (backend site-crawl/linkGraph.ts clickDepths). Orphan = no inbound links.
 * The force simulation is a small hand-written one (repulsion + springs +
 * centering) instead of d3; the pages and links are fixed example data.
 */

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { Link2, RotateCcw } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  red: "#dc2626",
};
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

// ── Example crawl ──────────────────────────────────────────────────────────
const DOMAIN = "northpeak.com";
const PAGES: { path: string; name: string }[] = [
  { path: "/", name: "Home" }, // 0
  { path: "/shop", name: "Shop" }, // 1
  { path: "/blog", name: "Blog" }, // 2
  { path: "/about", name: "About" }, // 3
  { path: "/contact", name: "Contact" }, // 4
  { path: "/shop/jackets", name: "Jackets" }, // 5
  { path: "/shop/footwear", name: "Footwear" }, // 6
  { path: "/shop/packs", name: "Packs" }, // 7
  { path: "/shop/jackets/rain-shell", name: "Rain shell" }, // 8
  { path: "/shop/jackets/down-parka", name: "Down parka" }, // 9
  { path: "/shop/footwear/trail-runner", name: "Trail runner" }, // 10
  { path: "/shop/footwear/hiking-boot", name: "Hiking boot" }, // 11
  { path: "/shop/packs/daypack-28l", name: "Daypack 28L" }, // 12
  { path: "/blog/layering-guide", name: "Layering guide" }, // 13
  { path: "/blog/boot-fitting", name: "Boot fitting" }, // 14
  { path: "/blog/packing-list", name: "Packing list" }, // 15
  { path: "/blog/trail-reviews", name: "Trail reviews" }, // 16
  { path: "/size-guide", name: "Size guide" }, // 17
  { path: "/shipping", name: "Shipping" }, // 18
  { path: "/returns", name: "Returns" }, // 19
  { path: "/faq", name: "FAQ" }, // 20
  { path: "/stores", name: "Stores" }, // 21
  { path: "/stores/denver", name: "Denver store" }, // 22
  { path: "/catalog-2021", name: "Catalog 2021" }, // 23
  { path: "/promo/spring-sale", name: "Spring sale" }, // 24
  { path: "/landing/test-page", name: "Test page" }, // 25
];
/** source → targets */
const OUT: number[][] = [
  [1, 2, 3, 5, 6, 7, 17, 18, 19, 20],
  [5, 6, 7, 8, 9, 10, 11, 12, 17, 0],
  [13, 14, 15, 0],
  [4, 0],
  [21, 20],
  [8, 9, 17, 1, 0],
  [10, 11, 17, 1, 0],
  [12, 1, 0],
  [17, 19, 5, 13],
  [17, 19, 5],
  [17, 19, 6],
  [17, 19, 6, 14],
  [19, 7],
  [8, 9, 2],
  [11, 16, 2],
  [12, 8, 2],
  [10],
  [19],
  [19, 20],
  [18, 20],
  [18, 19, 4, 0],
  [22],
  [0],
  [5],
  [1, 8],
  [],
];

const N = PAGES.length;
const EDGES = OUT.flatMap((ts, s) => ts.map((t) => [s, t] as const));
const INBOUND = PAGES.map((_, i) => EDGES.filter(([, t]) => t === i).map(([s]) => s));
const DEPTH = (() => {
  const d: (number | null)[] = PAGES.map(() => null);
  d[0] = 0;
  const queue = [0];
  while (queue.length) {
    const u = queue.shift()!;
    for (const v of OUT[u]) if (d[v] === null) { d[v] = d[u]! + 1; queue.push(v); }
  }
  return d;
})();
/** Undirected pairs for the springs and the drawn lines (a↔b drawn once). */
const PAIRS = (() => {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  for (const [s, t] of EDGES) {
    const k = s < t ? `${s}-${t}` : `${t}-${s}`;
    if (!seen.has(k)) { seen.add(k); out.push([s, t]); }
  }
  return out;
})();

type Cls = "orphan" | "hub" | "authority" | "normal";
const CLS_COLOR: Record<Cls, string> = { orphan: C.red, hub: C.blue, authority: C.green, normal: "#8c9cc8" };
const CLS_LABEL: Record<Cls, string> = { orphan: "Orphan", hub: "Hub", authority: "Authority", normal: "Normal" };
// The crawler's own flags (backend site-crawl/siteCrawler.ts): hub / authority at
// 1.5× the average outbound / inbound count; orphan = not the root and nothing links in.
const AVG = EDGES.length / N;
const CLS: Cls[] = PAGES.map((_, i) => {
  const inb = INBOUND[i].length;
  const outb = OUT[i].length;
  if (i !== 0 && inb === 0) return "orphan";
  if (outb > 0 && outb >= AVG * 1.5) return "hub";
  if (inb > 0 && inb >= AVG * 1.5) return "authority";
  return "normal";
});
/** The dashboard's graphNodeRadius. */
const RADIUS = PAGES.map((_, i) => 6 + Math.min(14, Math.sqrt(INBOUND[i].length) * 3.2));
const ORPHANS = PAGES.map((_, i) => i).filter((i) => CLS[i] === "orphan");
const MAX_DEPTH = Math.max(...DEPTH.map((d) => d ?? 0));

// Deterministic start: rings by depth (orphans on the outside), golden-angle spread.
const INIT = PAGES.map((_, i) => {
  const ring = DEPTH[i] ?? MAX_DEPTH + 1;
  const a = i * 2.39996;
  const r = ring * 55;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
});

// ── Physics ────────────────────────────────────────────────────────────────
type Sim = {
  x: number[]; y: number[]; vx: number[]; vy: number[];
  alpha: number; alphaTarget: number; fixed: number; fx: number; fy: number;
};
const ALPHA_MIN = 0.002;
const ALPHA_DECAY = 0.03;
const VELOCITY_KEEP = 0.6;

function newSim(): Sim {
  return {
    x: INIT.map((p) => p.x), y: INIT.map((p) => p.y),
    vx: INIT.map(() => 0), vy: INIT.map(() => 0),
    alpha: 1, alphaTarget: 0, fixed: -1, fx: 0, fy: 0,
  };
}

function tick(s: Sim, w: number, h: number) {
  s.alpha += (s.alphaTarget - s.alpha) * ALPHA_DECAY;
  const a = s.alpha;
  const k = Math.max(0.55, Math.min(1, w / 640));
  const charge = -340 * k * k;
  const len = 66 * k;
  const maxD2 = (200 * k) ** 2;
  // Repulsion between every pair (26 nodes, so O(n²) is nothing).
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      let dx = s.x[j] - s.x[i];
      let dy = s.y[j] - s.y[i];
      let d2 = dx * dx + dy * dy;
      if (d2 > maxD2) continue;
      if (d2 < 1) { dx = (j - i) * 0.5; dy = (i % 3) - 1; d2 = dx * dx + dy * dy; }
      const f = (charge * a) / d2;
      s.vx[i] += dx * f; s.vy[i] += dy * f;
      s.vx[j] -= dx * f; s.vy[j] -= dy * f;
    }
  }
  // Link springs.
  for (const [p, q] of PAIRS) {
    const dx = s.x[q] + s.vx[q] - s.x[p] - s.vx[p];
    const dy = s.y[q] + s.vy[q] - s.y[p] - s.vy[p];
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = ((d - len) / d) * a * 0.35;
    s.vx[q] -= dx * f * 0.5; s.vy[q] -= dy * f * 0.5;
    s.vx[p] += dx * f * 0.5; s.vy[p] += dy * f * 0.5;
  }
  // Centering, then integrate and keep inside the canvas.
  const bx = w / 2;
  const by = h / 2;
  for (let i = 0; i < N; i++) {
    s.vx[i] -= s.x[i] * 0.07 * a;
    s.vy[i] -= s.y[i] * 0.1 * a;
    if (i === s.fixed) {
      s.x[i] = s.fx; s.y[i] = s.fy; s.vx[i] = 0; s.vy[i] = 0;
      continue;
    }
    s.vx[i] *= VELOCITY_KEEP; s.vy[i] *= VELOCITY_KEEP;
    const r = RADIUS[i] + 4;
    s.x[i] = Math.max(-bx + r, Math.min(bx - r, s.x[i] + s.vx[i]));
    s.y[i] = Math.max(-by + r, Math.min(by - r - 12, s.y[i] + s.vy[i]));
  }
}

const snapshot = (s: Sim) => s.x.map((x, i) => ({ x, y: s.y[i] }));

// ── Component ──────────────────────────────────────────────────────────────
export function LinkGraphDemo() {
  const reduced = useReducedMotion() ?? false;
  const [pos, setPos] = useState(INIT);
  const [size, setSize] = useState({ w: 640, h: 420 });
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const [focused, setFocused] = useState(-1);
  const [dragging, setDragging] = useState(-1);

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sizeRef = useRef(size);
  const ctl = useRef<{ sim: Sim; kick: () => void; settle: (ticks: number) => void } | null>(null);

  // Canvas is drawn 1:1 in CSS pixels, so a phone gets a tighter layout, not a shrunken one.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setSize({ w, h: w < 520 ? 400 : 440 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    sizeRef.current = size;
    ctl.current?.kick();
  }, [size]);

  useEffect(() => {
    const sim = newSim();
    let raf = 0;
    let visible = false;
    const publish = () => setPos(snapshot(sim));
    const settle = (ticks: number) => {
      for (let i = 0; i < ticks; i++) tick(sim, sizeRef.current.w, sizeRef.current.h);
      publish();
    };
    const loop = () => {
      raf = 0;
      if (!visible) return;
      tick(sim, sizeRef.current.w, sizeRef.current.h);
      publish();
      if (sim.alpha > ALPHA_MIN || sim.fixed >= 0) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (reduced) {
        if (sim.fixed < 0) { sim.alpha = 1; settle(300); }
        return;
      }
      if (sim.alpha < 0.3 && sim.fixed < 0) sim.alpha = Math.max(sim.alpha, 0.3);
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };
    ctl.current = { sim, kick, settle };
    // Reduced motion: no animation, the graph is simply shown at rest.
    if (reduced) raf = requestAnimationFrame(() => { raf = 0; settle(300); });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      if (visible && !reduced && (sim.alpha > ALPHA_MIN || sim.fixed >= 0) && !raf) raf = requestAnimationFrame(loop);
    });
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      ctl.current = null;
    };
  }, [reduced]);

  const toCanvas = (e: PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * size.w - size.w / 2,
      y: ((e.clientY - rect.top) / rect.height) * size.h - size.h / 2,
    };
  };

  const onDown = (i: number) => (e: PointerEvent<SVGGElement>) => {
    const c = ctl.current;
    if (!c) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(i);
    setDragging(i);
    const p = toCanvas(e);
    c.sim.fixed = i;
    c.sim.fx = p.x;
    c.sim.fy = p.y;
    c.sim.alphaTarget = 0.3;
    if (reduced) c.settle(1);
    else c.kick();
  };
  const onMove = (i: number) => (e: PointerEvent<SVGGElement>) => {
    const c = ctl.current;
    if (!c || c.sim.fixed !== i) return;
    const p = toCanvas(e);
    c.sim.fx = p.x;
    c.sim.fy = p.y;
    // Reduced motion: the dragged node tracks the pointer, neighbours jump straight to rest.
    if (reduced) c.settle(40);
  };
  const onUp = (i: number) => () => {
    const c = ctl.current;
    if (!c || c.sim.fixed !== i) return;
    c.sim.fixed = -1;
    c.sim.alphaTarget = 0;
    setDragging(-1);
    c.kick();
  };
  const onKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(i);
    }
  };
  const reset = () => {
    const c = ctl.current;
    if (!c) return;
    const fresh = newSim();
    Object.assign(c.sim, { x: fresh.x, y: fresh.y, vx: fresh.vx, vy: fresh.vy, alpha: 1, alphaTarget: 0, fixed: -1 });
    setPos(snapshot(c.sim));
    c.kick();
  };

  const sel = selected;
  const selIn = INBOUND[sel];
  const selOut = OUT[sel];
  const showLabel = (i: number) => i === 0 || RADIUS[i] >= 12 || CLS[i] === "orphan" || i === sel || i === hovered || i === focused;

  const stats = [
    { k: "Pages", v: N, sub: "in the crawl" },
    { k: "Internal links", v: EDGES.length, sub: `${(EDGES.length / N).toFixed(1)} per page` },
    { k: "Orphan pages", v: ORPHANS.length, sub: "no inbound links" },
    { k: "Max depth", v: MAX_DEPTH, sub: "clicks from the homepage" },
  ];

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <Link2 size={15} style={{ color: C.blue }} aria-hidden />
            {DOMAIN}
          </div>
          <div className="text-[12px]" style={{ color: C.muted }}>
            {N} pages crawled · {EDGES.length} internal links · {ORPHANS.length} orphans
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[#eef0f4] ${FOCUS}`}
            style={{ background: C.soft, color: C.ink }}
          >
            <RotateCcw size={13} aria-hidden /> Reset layout
          </button>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
            Example data
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 @2xl:grid-cols-4 @xl:gap-3">
        {stats.map((s) => (
          <div key={s.k} className="min-w-0 rounded-2xl p-3" style={{ border: `1px solid ${C.border}` }}>
            <div className="text-[12px]" style={{ color: C.muted }}>{s.k}</div>
            <div className="text-[24px] font-semibold tabular-nums leading-tight" style={{ color: C.blue }}>{s.v}</div>
            <div className="truncate text-[11.5px]" style={{ color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 @3xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}`, background: C.soft }}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pt-2.5 text-[12px]" style={{ color: C.muted }}>
            {(["orphan", "hub", "authority", "normal"] as const).map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full" style={{ background: CLS_COLOR[c] }} aria-hidden />
                {CLS_LABEL[c]}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-full" style={{ border: `2px solid ${C.ink}` }} aria-hidden />
              Homepage
            </span>
          </div>
          <div ref={wrapRef} className="w-full">
            <svg
              ref={svgRef}
              role="group"
              aria-label={`Internal link graph of ${DOMAIN}. Drag a node to move it; Tab through the pages to inspect each one.`}
              viewBox={`${-size.w / 2} ${-size.h / 2} ${size.w} ${size.h}`}
              width="100%"
              height={size.h}
              style={{ display: "block", userSelect: "none" }}
            >
              <g aria-hidden>
                {PAIRS.map(([p, q]) => (
                  <line key={`${p}-${q}`} x1={pos[p].x} y1={pos[p].y} x2={pos[q].x} y2={pos[q].y} stroke="#c9cfdc" strokeWidth={1} strokeOpacity={0.8} />
                ))}
                {selIn.map((s) => (
                  <line key={`in-${s}`} x1={pos[s].x} y1={pos[s].y} x2={pos[sel].x} y2={pos[sel].y} stroke={C.green} strokeWidth={1.6} strokeOpacity={0.85} />
                ))}
                {selOut.map((t) => (
                  <line key={`out-${t}`} x1={pos[sel].x} y1={pos[sel].y} x2={pos[t].x} y2={pos[t].y} stroke={C.blue} strokeWidth={1.6} strokeOpacity={0.85} />
                ))}
              </g>
              {PAGES.map((pg, i) => {
                const r = RADIUS[i];
                const isSel = i === sel;
                const dim = !isSel && !selIn.includes(i) && !selOut.includes(i);
                return (
                  <g
                    key={pg.path}
                    transform={`translate(${pos[i].x} ${pos[i].y})`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSel}
                    aria-label={`${pg.path}: ${CLS_LABEL[CLS[i]]}, ${INBOUND[i].length} inbound, ${OUT[i].length} outbound links`}
                    onPointerDown={onDown(i)}
                    onPointerMove={onMove(i)}
                    onPointerUp={onUp(i)}
                    onPointerCancel={onUp(i)}
                    onPointerEnter={() => setHovered(i)}
                    onPointerLeave={() => setHovered(-1)}
                    onFocus={(e) => {
                      setSelected(i);
                      if (e.currentTarget.matches(":focus-visible")) setFocused(i);
                    }}
                    onBlur={() => setFocused(-1)}
                    onKeyDown={onKey(i)}
                    style={{ cursor: dragging === i ? "grabbing" : "grab", touchAction: "none", outline: "none" }}
                  >
                    <circle r={r + 10} fill="transparent" />
                    {i === focused && <circle r={r + 8} fill="none" stroke={C.blue} strokeWidth={2} strokeDasharray="3 3" />}
                    {isSel && <circle r={r + 5} fill="none" stroke={C.ink} strokeWidth={1.5} />}
                    {i === 0 && <circle r={r + 3} fill="#fff" stroke={C.ink} strokeWidth={2.5} />}
                    <circle
                      r={i === hovered || dragging === i ? r + 1.5 : r}
                      fill={CLS_COLOR[CLS[i]]}
                      fillOpacity={dim && sel !== 0 ? 0.55 : 1}
                      stroke="#fff"
                      strokeWidth={1.5}
                      style={{ transition: reduced ? undefined : "r 120ms ease, fill-opacity 160ms ease" }}
                    />
                    {showLabel(i) && (
                      <text
                        y={r + 13}
                        textAnchor="middle"
                        fontSize={i === 0 ? 12 : 11}
                        fontWeight={i === 0 || isSel ? 600 : 500}
                        fill={CLS[i] === "orphan" ? C.red : C.ink}
                        stroke={C.soft}
                        strokeWidth={3}
                        paintOrder="stroke"
                        style={{ pointerEvents: "none" }}
                      >
                        {pg.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-3 pb-2.5 text-[11.5px]" style={{ color: C.muted }}>
            Drag any node — its neighbours follow. Click a node to inspect its inbound and outbound links.
          </div>
        </div>

        <aside className="min-w-0 rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }} aria-live="polite">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: `${CLS_COLOR[CLS[sel]]}1a`, color: CLS[sel] === "normal" ? C.muted : CLS_COLOR[CLS[sel]] }}
            >
              <span className="inline-block size-1.5 rounded-full" style={{ background: CLS_COLOR[CLS[sel]] }} aria-hidden />
              {CLS_LABEL[CLS[sel]]}
            </span>
            <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ background: C.soft, color: C.muted }}>
              Depth {DEPTH[sel] ?? "—"}
            </span>
          </div>
          <div className="mt-2 text-[15px] font-semibold leading-snug">{PAGES[sel].name}</div>
          <div className="mt-0.5 break-all font-mono text-[12px]" style={{ color: C.muted }}>
            https://{DOMAIN}{PAGES[sel].path}
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Inbound", v: selIn.length },
              { k: "Outbound", v: selOut.length },
              { k: "Depth", v: DEPTH[sel] ?? "—" },
            ].map((m) => (
              <div key={m.k} className="rounded-xl py-2" style={{ background: C.soft }}>
                <dt className="text-[10.5px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>{m.k}</dt>
                <dd className="text-[18px] font-semibold tabular-nums">{m.v}</dd>
              </div>
            ))}
          </dl>

          {CLS[sel] === "orphan" && (
            <p className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-snug" style={{ background: "#fdecec", color: C.red }}>
              No crawled page links here, so it receives no link equity and is reachable from nothing.
            </p>
          )}

          {[
            { label: "Linked from", items: selIn, color: C.green },
            { label: "Links to", items: selOut, color: C.blue },
          ].map(({ label, items, color }) => (
            <div key={label} className="mt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>
                <span className="inline-block h-0.5 w-3 rounded" style={{ background: color }} aria-hidden />
                {label} ({items.length})
              </div>
              {items.length === 0 ? (
                <div className="mt-1 text-[12px]" style={{ color: C.muted }}>None</div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-1">
                  {items.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSelected(n)}
                      className={`rounded-md px-1.5 py-0.5 font-mono text-[11.5px] transition-colors hover:bg-[#eef3ff] hover:text-[#0454ff] ${FOCUS}`}
                      style={{ background: C.soft, color: C.ink }}
                    >
                      {PAGES[n].path}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px]">
        <span className="font-semibold" style={{ color: C.red }}>Orphan pages:</span>
        {ORPHANS.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={sel === i}
            className={`rounded-md px-1.5 py-0.5 font-mono text-[11.5px] transition-colors hover:bg-[#fdecec] ${FOCUS}`}
            style={{ background: sel === i ? "#fdecec" : C.soft, color: sel === i ? C.red : C.ink }}
          >
            {PAGES[i].path}
          </button>
        ))}
      </div>
    </div>
  );
}
