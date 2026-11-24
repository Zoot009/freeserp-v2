import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BuildView } from "@/components/ai-chat/BuildView";

// A visitor's private page: their chatbot's build, then the chatbot. The token in the address is the access; never indexed.

export const metadata: Metadata = {
  title: "Your AI chatbot | Freeserp.com",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function AiChatBuildPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <>
      {/* A white page: the dark bar from the top, or the white nav links would vanish. */}
      <Nav solid />
      <BuildView token={token} />
      <Footer />
    </>
  );
}
