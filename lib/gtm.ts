/**
 * Tiny wrapper around the GTM dataLayer. GTM is loaded in app/layout.tsx;
 * conversion tags subscribe to these custom events from the GTM container.
 */
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!window.dataLayer) return;
  window.dataLayer.push(event);
}

export {};
