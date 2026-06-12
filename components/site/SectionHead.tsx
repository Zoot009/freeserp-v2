import { Reveal } from "./Reveal";
import { Tag } from "./Tag";
import { COLORS } from "./constants";

export function SectionHead({
  tag,
  title,
  sub,
  titleColor,
  subColor,
}: {
  tag?: string;
  title: string;
  sub?: string;
  titleColor?: string;
  subColor?: string;
}) {
  return (
    <Reveal style={{ maxWidth: 700, textAlign: "center", margin: "0 auto" }}>
      {tag && <Tag text={tag} />}
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 56px)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          margin: "20px 0 12px",
          ...(titleColor ? { color: titleColor } : {}),
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ color: subColor ?? COLORS.gray, fontSize: 18, lineHeight: 1.5 }}>{sub}</p>}
    </Reveal>
  );
}
