/**
 * The US map that sits beside the search-market list.
 *
 * The four markets are drawn as one picture rather than four: a pinned city
 * (Local, Miami), a filled state (State, Florida), the country outline itself
 * (National), and dashed rings running off the edge of the frame
 * (International).
 *
 * Depth is carried by ink opacity, never by four different hues — the rule the
 * rest of this page follows. The accent is spent exactly once, on the Miami
 * pin, because that is the innermost claim the section makes.
 *
 * The coastline is a deliberately simplified path plotted from real lon/lat
 * through an equirectangular projection true at 37°N:
 *
 *     x = (lon + 125) * 6.1
 *     y = (49 - lat) * 7.6
 *
 * (6.1 px per degree of longitude and 7.6 per degree of latitude is the 0.8
 * cos-37° ratio, so the shape is not stretched.) The point list is then reduced
 * to headlands and border corners, which is enough to read as the United States
 * at 280px wide without shipping a topology file. Pin positions come out of the
 * same projection, which is why they are plain numbers in the same space.
 *
 * Lives in this folder, not components/landing/, because it is campaign artwork
 * for one ad page — nothing else on the site should grow a dependency on it.
 */

// Continental US: Cape Flattery down the Pacific coast, east along the Mexican
// border, round the Gulf and Florida, up the Atlantic to Maine, then west along
// the Canadian border and the 49th parallel.
const USA =
  "M2 5 6 21 2 47 4 65 15 85 27 111 48 125 " +
  "63 124 85 135 113 131 134 152 148 149 170 176 " +
  "168 161 184 150 217 152 226 141 244 147 259 161 269 181 " +
  "271 157 268 129 302 105 305 84 311 68 336 55 334 40 354 32 " +
  "340 12 315 30 296 38 256 51 248 19 214 7 182 0 12 0 Z";

// Florida, same projection: panhandle west to east, down the Gulf side, round
// the tip and back up the Atlantic side.
const FLORIDA =
  "M244 147 250 144 262 151 259 161 265 176 269 181 274 168 271 157 266 139 245 140 Z";

// Miami (-80.2, 25.8) through the projection above.
const MIAMI = { x: 273, y: 176 };

const INK = "#0e0f0c";
const ACCENT = "#0454ff";

export function UsMap({
  alt,
  localPin,
  statePin,
}: {
  /** Describes the whole figure; the pins themselves are decorative. */
  alt: string;
  localPin: string;
  statePin: string;
}) {
  return (
    <svg
      viewBox="-10 -12 384 210"
      className="h-auto w-full max-w-[300px]"
      role="img"
      aria-label={alt}
    >
      {/* International: rings wider than the frame, so they read as continuing
          past the country rather than enclosing it. */}
      <g aria-hidden>
        <circle
          cx="180"
          cy="92"
          r="152"
          fill="none"
          stroke={INK}
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="4 7"
        />
        <circle
          cx="180"
          cy="92"
          r="196"
          fill="none"
          stroke={INK}
          strokeOpacity="0.1"
          strokeWidth="1"
          strokeDasharray="4 7"
        />

        {/* National: the country as one filled shape. */}
        <path d={USA} fill={INK} fillOpacity="0.1" stroke={INK} strokeOpacity="0.34" strokeWidth="1.1" strokeLinejoin="round" />

        {/* State: one state lifted out of it. */}
        <path d={FLORIDA} fill={INK} fillOpacity="0.26" stroke={INK} strokeOpacity="0.45" strokeWidth="1" strokeLinejoin="round" />

        {/* Local: the single accented mark on the figure. Depth everywhere
            else is ink opacity; the accent is spent once, on the innermost
            claim the section makes. */}
        <circle cx={MIAMI.x} cy={MIAMI.y} r="8" fill={ACCENT} fillOpacity="0.18" />
        <circle cx={MIAMI.x} cy={MIAMI.y} r="3.6" fill={ACCENT} />
      </g>

      {/* Labels, drawn as SVG text so they scale with the figure instead of
          drifting out of register with it the way absolutely-positioned HTML
          chips would. */}
      <text
        x={MIAMI.x - 10}
        y={MIAMI.y - 13}
        textAnchor="end"
        fontSize="11"
        fill={INK}
        fillOpacity="0.75"
        letterSpacing="-0.02em"
      >
        {localPin}
      </text>
      <text
        x="232"
        y="196"
        textAnchor="middle"
        fontSize="11"
        fill={INK}
        fillOpacity="0.55"
        letterSpacing="-0.02em"
      >
        {statePin}
      </text>
    </svg>
  );
}
