import { NextRequest, NextResponse } from "next/server";

// The backend (freeserp-backend) owns email — it holds the SMTP credentials and
// exposes POST /api/contact. This route is a thin server-to-server proxy so the
// browser keeps talking to the same origin (no CORS) while delivery happens
// through the project's real email infrastructure.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!BACKEND_URL) {
    console.error("contact: NEXT_PUBLIC_BACKEND_URL is not set");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`contact: backend responded ${res.status}`, detail);
      return NextResponse.json(
        { error: "Failed to send message." },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact: failed to reach backend", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }
}
