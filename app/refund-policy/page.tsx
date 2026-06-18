import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { REFUND } from "@/components/legal/data";

export const metadata: Metadata = {
  title: REFUND.metaTitle,
  description: REFUND.metaDescription,
  alternates: { canonical: "https://freeserp.com/refund-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: REFUND.metaTitle,
    description: REFUND.metaDescription,
    url: "https://freeserp.com/refund-policy",
    siteName: "FreeSERP",
    type: "website",
  },
};

export default function RefundPolicyPage() {
  return <LegalPage doc={REFUND} />;
}
