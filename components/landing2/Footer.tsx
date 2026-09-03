import Image from "next/image";

export default function Footer() {
  return (
    <footer className="l2-footer">
      <div className="l2-footer-inner">
        <Image src="/logo.png" alt="" width={192} height={192} />
        <span>FreeSERP — Rank Tracker</span>
        <div className="l2-spacer" />
        <span>190+ countries · English, Español, Français, Deutsch, Nederlands</span>
      </div>
    </footer>
  );
}
