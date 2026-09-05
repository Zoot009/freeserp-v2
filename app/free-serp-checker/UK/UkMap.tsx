/**
 * The UK map that sits beside the search-audience list.
 *
 * Four scopes are drawn as one picture rather than four: a pinned city
 * (Local), a ring around a metro (Regional), the filled outline itself
 * (National), and the dashed rings that run off the edge of the frame
 * (International).
 *
 * Depth is carried by ink opacity, not by four different hues — the same rule
 * the rest of this page follows, where colour lives in tinted surfaces and the
 * accent is spent on one thing at a time. Here it is spent on the local pin,
 * because that is the innermost claim the section is making.
 *
 * The coastline is a deliberately simplified path in a 300x400 box — plotted
 * from real lon/lat (x = 10 + (lon + 8) * 28, y = 395 - (lat - 50) * 44.25)
 * then reduced to headlands, so it is recognisably Britain at 280px wide
 * without shipping a topology file. Pin positions come out of that same
 * projection, which is why they are expressed as percentages of the box.
 *
 * Lives in this folder, not components/landing/, because it is campaign
 * artwork for one ad page — nothing else on the site should grow a dependency
 * on it.
 */

// Great Britain: Dover, west along the south coast, up the Welsh and Scottish
// west side, round Cape Wrath and back down the east coast to the Thames.
const GB =
  "M272 346 250 357 230 360 203 362 178 369 139 369 119 380 74 392 94 373 " +
  "116 344 150 335 161 331 171 312 159 322 150 326 144 331 122 324 87 320 " +
  "86 311 119 289 100 270 112 256 105 245 147 247 149 240 149 225 145 214 " +
  "136 180 93 180 98 154 73 160 88 130 80 112 70 85 88 45 94 14 136 14 " +
  "150 12 121 47 117 63 142 54 178 54 175 78 165 98 156 121 147 130 164 130 " +
  "178 140 195 174 200 187 217 196 231 214 231 236 244 256 238 269 248 265 " +
  "270 266 283 285 270 309 253 329 273 333 Z";

// Northern Ireland, same projection.
const NI = "M31 167 48 165 66 164 72 180 69 191 82 200 60 215 16 209 24 178 Z";

// Manchester (-2.24, 53.48) and London (-0.13, 51.51) through the projection
// above, as percentages of the 300x400 box so the HTML chips track the SVG.
const MANCHESTER = { x: 171 / 3, y: 241 / 4 };
const LONDON = { x: 230 / 3, y: 329 / 4 };

const INK = "#0e0f0c";
const ACCENT = "#0454ff";

export function UkMap({
  alt,
  localPin,
  regionalPin,
  ladder,
}: {
  /** Describes the whole figure for screen readers — the pins are decorative. */
  alt: string;
  localPin: string;
  regionalPin: string;
  /** Reach progression under the map, innermost first. */
  ladder: string[];
}) {
  return (
    <div className="uk-map">
      <div className="relative mx-auto aspect-[3/4] w-full">
        <svg
          viewBox="0 0 300 400"
          role="img"
          aria-label={alt}
          className="absolute inset-0 h-full w-full"
        >
          {/* International: reach that runs past the edge of the frame. */}
          <g aria-hidden>
            {[150, 205, 262].map((r) => (
              <circle
                key={r}
                cx="180"
                cy="280"
                r={r}
                fill="none"
                stroke={INK}
                strokeOpacity="0.14"
                strokeWidth="1.25"
                strokeDasharray="5 7"
              />
            ))}
          </g>

          {/* National: the outline itself. */}
          <g aria-hidden>
            <path
              d={GB}
              fill="#ffffff"
              fillOpacity="0.72"
              stroke={INK}
              strokeOpacity="0.34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d={NI}
              fill="#ffffff"
              fillOpacity="0.72"
              stroke={INK}
              strokeOpacity="0.34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Regional: a metro's catchment around London. */}
          <g aria-hidden>
            <circle
              cx="230"
              cy="329"
              r="34"
              fill="none"
              stroke={INK}
              strokeOpacity="0.28"
              strokeWidth="1.25"
              strokeDasharray="4 5"
            />
            <circle cx="230" cy="329" r="4.5" fill={INK} fillOpacity="0.45" />
          </g>

          {/* Local: one city, one result set — the page's single accent mark. */}
          <g aria-hidden>
            <circle cx="171" cy="241" r="15" fill={ACCENT} fillOpacity="0.12" />
            <circle cx="171" cy="241" r="5.5" fill={ACCENT} />
          </g>
        </svg>

        {/* The pin labels are HTML, not <text>, so they stay in the page's type
            scale instead of being scaled by the viewBox. */}
        <Pin x={MANCHESTER.x} y={MANCHESTER.y} label={localPin} side="left" />
        <Pin x={LONDON.x} y={LONDON.y} label={regionalPin} side="right" />
      </div>

      {/* Local → Regional → National → Global. Decorative: every rung is
          already a labelled card in the list beside this. */}
      <ol
        aria-hidden
        className="mt-7 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2"
      >
        {ladder.map((rung, i) => (
          <li key={rung} className="flex items-center gap-1.5">
            <span className="uk-rung">
              {/* Each rung's dot fades as the reach widens, so the ladder reads
                  as a progression without introducing a second colour. */}
              <i style={{ opacity: 1 - i * 0.22 }} />
              {rung}
            </span>
            {i < ladder.length - 1 && (
              <span className="text-[12px] text-[var(--muted)]">&rarr;</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Pin({
  x,
  y,
  label,
  side,
}: {
  x: number;
  y: number;
  label: string;
  side: "left" | "right";
}) {
  return (
    <span
      aria-hidden
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: side === "left" ? "translate(-100%, -50%)" : "translate(0, -50%)",
        marginLeft: side === "left" ? "-9px" : "9px",
      }}
      className="absolute rounded-full border border-[var(--line)] bg-white px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-[var(--ink)] shadow-[0_2px_10px_-4px_rgba(14,15,12,0.3)] sm:px-2.5 sm:py-1 sm:text-[11.5px]"
    >
      {label}
    </span>
  );
}
