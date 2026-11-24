import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiChatLanding } from "@/components/ai-chat/AiChatLanding";
import { demoSettings } from "@/components/ai-chat/config";

// freeserp.com/ai-chat/<code>: the ad campaigns' page. Not indexed (ads only), and only for a code the chatbot server
// knows (its TRY_CAMPAIGNS); there, a demo reads up to 100 pages of the visitor's website.

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Free AI Chatbot for Your Website | Freeserp.com",
  description: "Turn your website into an AI chatbot that answers customers day and night. Try it live in minutes, free.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function AiChatCampaignPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Za-z0-9-]{6,60}$/.test(code)) notFound();
  const { open, categories, campaign, reachable } = await demoSettings(code);
  // An unknown code is no page. If the chatbot server can't be reached, still show it: the server checks the code again.
  if (reachable && !campaign) notFound();
  return <AiChatLanding open={open} categories={categories} campaign={code} />;
}
