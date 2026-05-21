import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/components/legal/data";

export const metadata: Metadata = {
  title: PRIVACY.metaTitle,
  description: PRIVACY.metaDescription,
  alternates: { canonical: "https://freeserp.com/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: PRIVACY.metaTitle,
    description: PRIVACY.metaDescription,
    url: "https://freeserp.com/privacy",
    siteName: "FreeSERP",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}
