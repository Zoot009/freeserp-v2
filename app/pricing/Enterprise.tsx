// The "talk to us" band.
//
// Deliberately the last thing on the page and visually the darkest: a self-serve
// pricing page should sell itself three times before it offers a conversation.
// It exists because some buyers cannot use a card at all — agencies on invoices,
// anyone needing an MSA — and without a route for them the page simply loses
// them at the checkout button.

import { TalkToUs } from "./TalkToUs";

const POINTS = [
  "Volume credit pricing",
  "Invoicing and purchase orders",
  "Multiple seats on one balance",
  "White-labelled client reports",
  "Priority queue for scheduled checks",
  "A named contact, not a ticket queue",
];

const FOR_WHO = [
  "Agencies billing several clients",
  "In-house teams across many sites",
  "Anyone who needs an invoice, not a card",
  "Volumes past the Agency plan",
];

export function Enterprise() {
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 80px" }}>
      <div className="pr-ent">
        <div style={{ padding: "36px 34px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
            FreeSERP for teams
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,.62)", margin: "12px 0 22px" }}>
            Past a certain size the question stops being how many credits and starts being how the
            account is run — who can spend, who gets billed, and what the reports look like when a
            client sees them.
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
            {FOR_WHO.map((f) => (
              <li
                key={f}
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,.75)",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span aria-hidden style={{ color: "#4a8fff", lineHeight: 1.5, flexShrink: 0 }}>—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ padding: "36px 34px", background: "#11161f" }}>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Let&apos;s talk</div>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)", margin: "6px 0 20px" }}>
            Tell us what you are tracking and we will put a number on it.
          </p>

          <TalkToUs />

          <ul
            style={{
              listStyle: "none",
              margin: "22px 0 0",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 9,
            }}
          >
            {POINTS.map((p) => (
              <li
                key={p}
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,.8)",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path
                    d="M2 7L5.5 10.5L12 3.5"
                    stroke="#4a8fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
