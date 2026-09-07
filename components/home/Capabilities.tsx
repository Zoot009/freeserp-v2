import {
  Bell,
  BarChart3,
  Clock,
  Download,
  Eye,
  Gauge,
  Globe,
  Layers,
  Share2,
  Sparkles,
  Star,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { CAPABILITIES, type Capability } from "./tools";

const ICONS: Record<Capability["icon"], LucideIcon> = {
  globe: Globe,
  clock: Clock,
  layers: Layers,
  bell: Bell,
  star: Star,
  download: Download,
  share: Share2,
  zap: Zap,
  gauge: Gauge,
  wallet: Wallet,
  sparkles: Sparkles,
  eye: Eye,
  chart: BarChart3,
};

/**
 * The dozen capabilities that have no screenshot of their own — targeting,
 * scheduling, exports, sharing, alerts, the credit model — and so never made it
 * onto the home page even though they are the reason people stay.
 */
export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="THE REST OF IT"
        title="The parts that don't fit in a screenshot"
        sub="Targeting, scheduling, alerts, exports and sharing — the everyday things that decide whether a tool actually gets used."
      />

      <div className="fs-grid-3" style={{ marginTop: 56 }}>
        {CAPABILITIES.map((c, i) => {
          const Icon = ICONS[c.icon];
          return (
            <Reveal key={c.title} delay={(i % 3) * 0.06}>
              <div
                className="fs-card"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 26,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: COLORS.blueBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
                  <Icon size={21} strokeWidth={1.9} color={COLORS.blue} aria-hidden="true" />
                </div>
                <h5
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    margin: "0 0 8px",
                  }}
                >
                  {c.title}
                </h5>
                <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.5, margin: 0 }}>
                  {c.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
