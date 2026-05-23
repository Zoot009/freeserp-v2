import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freeserp.com"),
  title: "FreeSERP — Track Keyword Rankings for Free",
  description:
    "Free SERP checker instantly checks your website's keyword ranking position and graph search engine keyword ranking positions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* gtag.js — single loader, multiple config() calls for both the
            Google Ads (AW-) and Google Analytics 4 (G-) tags. This is Google's
            recommended pattern when running more than one tag on a page. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5236DFCJLX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5236DFCJLX');
            gtag('config', 'AW-18179127431');
          `}
        </Script>
      </body>
    </html>
  );
}
