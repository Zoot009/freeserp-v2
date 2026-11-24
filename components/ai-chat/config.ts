// The AI chatbot demo (freeserp.com/ai-chat). The chatbot server does all the work through its public API
// (/api/public/try); this site only shows the pages. That server's TRY_ALLOWED_ORIGINS must list this site, and its
// TRY_CAMPAIGNS lists the ad codes (freeserp.com/ai-chat/<code>) whose demos read the whole website.
export const CHATBOT_API = (process.env.NEXT_PUBLIC_CHATBOT_API_URL || "https://whatsappchatbot.zootcloud.com").replace(/\/+$/, "");

export type Category = { key: string; label: string };

export type DemoStatus = {
  business: string;
  website: string;
  state: "building" | "ready" | "review";
  step: number;
  pagesFound: number;
  pagesRead: number;
  chatUrl: string | null;
  demoUrl: string | null;
  logoUrl: string | null; // the visitor's website logo, once their homepage has been read
};

// Shown if the chatbot server can't be reached when the page is rendered, so the page still works.
const FALLBACK: Category[] = [
  { key: "mobile_phone_shop", label: "Mobile phone shop" },
  { key: "courier", label: "Courier company" },
  { key: "website_agency", label: "Website development agency" },
  { key: "seo_agency", label: "SEO agency" },
  { key: "digital_marketing", label: "Digital marketing agency" },
  { key: "office_rental", label: "Office rental company" },
  { key: "restaurant", label: "Restaurant" },
  { key: "hotel", label: "Hotel" },
  { key: "ecommerce", label: "E-commerce business" },
  { key: "other", label: "Other" },
];

/** The form's categories, whether demos are open, and whether an ad code is real. Server side, cached 5 minutes. */
export async function demoSettings(campaign?: string): Promise<{ open: boolean; categories: Category[]; campaign: boolean; reachable: boolean }> {
  try {
    const q = campaign ? `?campaign=${encodeURIComponent(campaign)}` : "";
    const res = await fetch(`${CHATBOT_API}/api/public/try${q}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
    if (res.ok) return { ...((await res.json()) as { open: boolean; categories: Category[]; campaign: boolean }), reachable: true };
  } catch {
    /* unreachable right now: show the page anyway */
  }
  return { open: true, categories: FALLBACK, campaign: false, reachable: false };
}
