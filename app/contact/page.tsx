import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { COLORS } from "@/components/site/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | FreeSERP",
  description: "Get in touch with the FreeSERP team. We are here to help.",
  alternates: { canonical: "https://freeserp.com/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact Us | FreeSERP",
    description: "Get in touch with the FreeSERP team. We are here to help.",
    url: "https://freeserp.com/contact",
    siteName: "FreeSERP",
    type: "website",
  },
};

const mono = "var(--font-geist-mono), monospace";

export default function ContactPage() {
  return (
    <>
      <Nav />

      <header style={{ background: "#0a0a14", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <span
              style={{
                fontFamily: mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: COLORS.blue,
              }}
            >
              Support
            </span>
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: "16px 0 0",
              }}
            >
              Contact Us
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,.62)",
                fontSize: 16,
                lineHeight: 1.55,
                maxWidth: 520,
                margin: "18px 0 0",
              }}
            >
              Have a question or need help? Fill out the form and we will get back to you as soon as possible.
            </p>
          </Reveal>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "60px 40px 110px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "start",
          }}
          className="fs-contact-grid"
        >
          {/* Contact info */}
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    margin: "0 0 16px",
                    color: COLORS.black,
                  }}
                >
                  Get in touch
                </h2>
                <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                  Our support team is ready to answer your questions about FreeSERP plans, features, or anything else.
                </p>
              </div>

              {/* Email */}
              <div
                style={{
                  padding: "20px 22px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  background: COLORS.blueBg,
                }}
              >
                <p style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: COLORS.blue, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Email
                </p>
                <a
                  href="mailto:support@freeserp.com"
                  style={{ fontSize: 15, color: COLORS.blue, textDecoration: "none", fontWeight: 500 }}
                >
                  support@freeserp.com
                </a>
              </div>

              {/* Director */}
              <div
                style={{
                  padding: "20px 22px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  background: COLORS.softGray,
                }}
              >
                <p style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: COLORS.subtle, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Director
                </p>
                <p style={{ fontSize: 15, color: COLORS.black, fontWeight: 600, margin: 0 }}>
                  Prasad Vishnu Pol
                </p>
              </div>

              {/* Address */}
              <div
                style={{
                  padding: "20px 22px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  background: COLORS.softGray,
                }}
              >
                <p style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: COLORS.subtle, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Address
                </p>
                <address style={{ fontStyle: "normal", fontSize: 15, color: COLORS.gray, lineHeight: 1.65, margin: 0 }}>
                  3069, U Wing, Akshar Business Park,<br />
                  Janta Market Rd, Opposite APMC<br />
                  Fruits and Vegetable Market,<br />
                  Sector 25, Vashi,<br />
                  Navi Mumbai, Maharashtra 400703
                </address>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.08}>
            <div
              style={{
                padding: "32px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 18,
                background: "#fff",
                boxShadow: "0 2px 24px rgba(0,0,0,.06)",
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: "0 0 24px",
                  color: COLORS.black,
                }}
              >
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .fs-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
