import { NextRequest, NextResponse } from "next/server";

// The visitor's country, from the header Vercel adds to every request. Its own
// route so the homepage stays prerendered: reading headers in the page would
// make every visit render on the server. Absent locally, so the answer is null there.
export function GET(req: NextRequest) {
  return NextResponse.json(
    { country: req.headers.get("x-vercel-ip-country") },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
