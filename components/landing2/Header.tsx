import Image from "next/image";

const NAV = [
  { href: "#tools", label: "Tools" },
  { href: "#ai", label: "AI tracking" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="l2-header">
      <div className="l2-header-inner">
        <Image
          src="/logo.png"
          alt="FreeSERP"
          width={192}
          height={192}
          className="l2-logo"
          priority
        />
        <span className="l2-brandname">FreeSERP</span>
        <nav className="l2-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="l2-spacer" />
        <a href="#signup" className="l2-header-cta">
          Start free
        </a>
      </div>
    </header>
  );
}
