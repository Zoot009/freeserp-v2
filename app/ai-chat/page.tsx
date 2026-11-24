import type { Metadata } from "next";
import { AiChatLanding } from "@/components/ai-chat/AiChatLanding";
import { demoSettings } from "@/components/ai-chat/config";

// freeserp.com/ai-chat: the organic page (indexed). Its demos read the visitor's homepage.

const PAGE_URL = "https://freeserp.com/ai-chat";
const TITLE = "Free AI Chatbot for Your Website | Freeserp.com";
const DESCRIPTION = "Turn your website into an AI chatbot that answers customers day and night. Enter your website and try it live in minutes, free.";

export const revalidate = 300;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "ai chatbot for website, free website chatbot, ai customer support chatbot, chatbot builder, whatsapp chatbot",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, siteName: "FreeSERP", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function AiChatPage() {
  const { open, categories } = await demoSettings();
  return <AiChatLanding open={open} categories={categories} />;
}
