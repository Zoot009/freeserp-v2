"use client";

import Image from "next/image";
import { useScrolled } from "./hooks";
import { NAV, navHref, appUrl, type NavItem } from "./constants";
import { ArrowUpRight } from "./icons";

export function Nav({ currentNav }: { currentNav?: NavItem }) {
  const scrolled = useScrolled(40);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: scrolled ? "12px 40px" : "20px 40px",
        background: scrolled ? "rgba(10,10,20,.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent",
        transition:
          "padding .3s ease, background .3s ease, backdrop-filter .3s ease, border-color .3s ease, box-shadow .3s ease",
        boxShadow: scrolled ? "0 8px 28px rgba(0,0,0,.18)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "#fff",
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: "-.5px",
            textDecoration: "none",
          }}
        >
          <Image
            src="https://framerusercontent.com/images/kq857rH86cqGviBRliG7ERQy3MU.png"
            alt="FreeSerp"
            title="FreeSerp"
            width={28}
            height={28}
            priority
            style={{ display: "block", borderRadius: 6 }}
          />
          FreeSerp
        </a>

        <div className="fs-nav-links" style={{ display: "flex", gap: 28 }}>
          {NAV.map((n) => (
            <a
              key={n}
              href={navHref(n)}
              className={`fs-nav-link${n === currentNav ? " is-current" : ""}`}
            >
              <span className="fs-nav-top">{n}</span>
              <span className="fs-nav-bot">{n}</span>
            </a>
          ))}
        </div>

        <a href={appUrl("/signup")} className="fs-cta-btn" style={{ background: "#000", color: "#fff" }}>
          Get started
          <span className="fs-arrow-wrap">
            <span className="fs-arrow fs-arrow-1">
              <ArrowUpRight />
            </span>
            <span className="fs-arrow fs-arrow-2">
              <ArrowUpRight />
            </span>
          </span>
        </a>
      </div>
    </nav>
  );
}
