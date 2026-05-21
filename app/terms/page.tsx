import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/components/legal/data";

export const metadata: Metadata = {
  title: TERMS.metaTitle,
  description: TERMS.metaDescription,
  alternates: { canonical: "https://freeserp.com/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TERMS.metaTitle,
    description: TERMS.metaDescription,
    url: "https://freeserp.com/terms",
    siteName: "FreeSERP",
    type: "website",
  },
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
