export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- .ico isn't optimizable by next/image
    <img src="/landing-logo-mark.ico" alt="FreeSerp" className={className} />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      Free<span className="text-accent">Serp</span>
    </span>
  );
}
