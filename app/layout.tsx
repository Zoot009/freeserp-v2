import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { UtmCapture } from "@/components/site/UtmCapture";
import { SessionReplay } from "@/components/site/SessionReplay";
import { CookieNotice } from "@/components/site/CookieNotice";
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://freeserp.com/#organization",
                  "name": "FreeSERP",
                  "url": "https://freeserp.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://freeserp.com/logo.png",
                    "width": 512,
                    "height": 512,
                  },
                  "email": "support@freeserp.com",
                  "description":
                    "FreeSERP rank tracking and competitor intelligence for SEOs, marketers, and developers.",
                  "knowsAbout": [
                    "SERP rank tracking",
                    "Keyword research",
                    "Competitor analysis",
                    "AI Overviews",
                    "Generative Engine Optimization",
                    "Answer Engine Optimization",
                  ],
                  "sameAs": [
                    "https://in.linkedin.com/company/zootdigital",
                    "https://www.instagram.com/zootdigitalmarketing/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://freeserp.com/#website",
                  "url": "https://freeserp.com",
                  "name": "FreeSERP",
                  "publisher": { "@id": "https://freeserp.com/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate":
                        "https://freeserp.com/serp-checker?keyword={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        {/* GTM loaded lazyOnload (browser-idle), NOT afterInteractive.
            This container is what injects the heavy third-party tags —
            ContentSquare (~158KB), LogRocket (~270KB), Facebook Pixel (~200KB)
            and duplicate GA loads — which together were ~500KB of unused JS and
            ~2.3s of main-thread script evaluation on the critical path. Idle
            loading moves all of it AFTER the page is interactive.
            The direct gtag.js below stays afterInteractive so Google Ads /
            GA4 conversion tracking still fires promptly. */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MG3XS6F6');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MG3XS6F6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        {/* First-party UTM/attribution capture (useSearchParams ⇒ Suspense). */}
        <Suspense fallback={null}>
          <UtmCapture />
        </Suspense>
        <SessionReplay />
        <CookieNotice />
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
