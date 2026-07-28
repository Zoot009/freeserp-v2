/**
 * Radial conic-gradient meter showing a static fill at the target percentage.
 */
export function AnimatedRing({
  pct,
  color,
  children,
}: {
  pct: string;
  color: string;
  children?: React.ReactNode;
}) {
  const target = parseInt(pct) || 0;

  return (
    <div
      className="mx-auto flex h-26 w-26 items-center justify-center rounded-full sm:h-32.5 sm:w-32.5"
      style={{
        background: `conic-gradient(${color} 0 ${target / 100}turn, #e6e9f2 ${target / 100}turn 1turn)`,
      }}
    >
      <div className="flex h-19 w-19 flex-col items-center justify-center rounded-full bg-white sm:h-24 sm:w-24">
        <span className="text-[20px] font-extrabold text-[#0b1020] sm:text-[26px]">
          {target}%
        </span>
        {children}
      </div>
    </div>
  );
}

/**
 * Compact version used by the thematic breakdown cards — a small ring with a
 * plain white center hole, and the % rendered as a sibling label rather than
 * inside the ring.
 */
export function AnimatedMiniRing({ pct, color }: { pct: string; color: string }) {
  const target = parseInt(pct) || 0;

  return (
    <>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8.5 sm:w-8.5"
        style={{
          background: `conic-gradient(${color} 0 ${target / 100}turn, #e6e9f2 ${target / 100}turn 1turn)`,
        }}
      >
        <div className="h-4.5 w-4.5 rounded-full bg-white sm:h-5.5 sm:w-5.5" />
      </div>
      <span className="text-sm font-extrabold text-[#0b1020] sm:text-[17px]">{target}%</span>
    </>
  );
}
