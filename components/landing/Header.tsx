"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/landing/ui/Logo";
import { useAppUrl } from "@/lib/useAppUrl";

type HeaderDict = {
  getStarted: string;
  tryFree: string;
};

export default function Header({ dict }: { dict: HeaderDict }) {
  const [scrolled, setScrolled] = useState(false);
  const appUrl = useAppUrl();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!scrolled) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-100 hidden border-b border-black/5 bg-white/80 shadow-[0_8px_30px_-15px_rgba(11,16,32,0.15)] backdrop-blur-xl sm:block">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-3 px-6 py-3.5">
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 text-[19px] font-extrabold tracking-tight whitespace-nowrap text-[#0b1020]"
          >
            <LogoMark className="h-[26px] w-[26px] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <span>
              Free<span className="text-accent">Serp</span>
            </span>
          </a>
          <a
            href={appUrl("/signup")}
            className="group flex shrink-0 items-center gap-1.5 rounded-full bg-[#0b1020] px-[22px] py-3 text-[14.5px] font-bold whitespace-nowrap text-white transition-all duration-300 hover:bg-accent hover:shadow-[0_10px_30px_-8px_rgba(47,107,255,0.6)]"
          >
            {dict.getStarted}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-100 border-t border-black/5 bg-white/80 px-4 py-3 shadow-[0_-8px_30px_-15px_rgba(11,16,32,0.15)] backdrop-blur-xl sm:hidden">
        <a
          href={appUrl("/signup")}
          className="group flex items-center justify-center gap-1.5 rounded-full bg-[#0b1020] px-4 py-3 text-[14px] font-bold whitespace-nowrap text-white transition-all duration-300 hover:bg-accent hover:shadow-[0_10px_30px_-8px_rgba(47,107,255,0.6)]"
        >
          {dict.tryFree}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </>
  );
}
