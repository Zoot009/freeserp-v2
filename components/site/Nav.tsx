"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrolled } from "./hooks";
import { NAV, navHref, type NavItem } from "./constants";
import { ArrowUpRight } from "./icons";
import { pushDataLayer } from "@/lib/gtm";

export function Nav({ currentNav }: { currentNav?: NavItem }) {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
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
          background: scrolled || menuOpen ? "rgba(10,10,20,.92)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(14px) saturate(140%)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent",
          transition:
            "padding .3s ease, background .3s ease, backdrop-filter .3s ease, border-color .3s ease, box-shadow .3s ease",
          boxShadow: scrolled ? "0 8px 28px rgba(0,0,0,.18)" : "none",
        }}
        className="fs-nav"
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
          <Link
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
          </Link>

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

          <a
            href="https://app.freeserp.com/signup"
            onClick={() => pushDataLayer({ event: "cta_click" })}
            className="fs-cta-btn fs-nav-cta"
            style={{ background: "#000", color: "#fff" }}
          >
            Get started for free
            <span className="fs-arrow-wrap">
              <span className="fs-arrow fs-arrow-1">
                <ArrowUpRight />
              </span>
              <span className="fs-arrow fs-arrow-2">
                <ArrowUpRight />
              </span>
            </span>
          </a>

          {/* Hamburger — visible only on mobile */}
          <button
            className="fs-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#fff",
            }}
          >
            {menuOpen ? (
              /* X icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Burger icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            className="fs-mobile-menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(10,10,20,.96)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderTop: "1px solid rgba(255,255,255,.08)",
              padding: "24px 24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV.map((n) => (
              <a
                key={n}
                href={navHref(n)}
                onClick={closeMenu}
                className={`fs-mobile-nav-link${n === currentNav ? " is-current" : ""}`}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 18,
                  fontWeight: 500,
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,.07)",
                  letterSpacing: "-0.02em",
                }}
              >
                {n}
              </a>
            ))}
            <a
              href="https://app.freeserp.com/signup"
              onClick={() => {
                pushDataLayer({ event: "cta_click" });
                closeMenu();
              }}
              className="fs-cta-btn"
              style={{
                background: "#0454ff",
                color: "#fff",
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              Get started for free
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
        )}
      </nav>
    </>
  );
}
