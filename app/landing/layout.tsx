import "./landing.css";
// preview.css (1485 lines, the replica dashboard) is NOT imported here on
// purpose. It is imported inside PreviewOverlay instead, so it code-splits with
// that lazily-loaded component and never render-blocks the landing page — the
// preview only appears after a visitor submits a domain.

export default function LandingSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
