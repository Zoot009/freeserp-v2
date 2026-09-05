"use client";

import { useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  POPULAR_LOCATIONS,
  ALL_LOCATIONS,
  flagFor,
} from "@/components/site/locations";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLanding, trackLandingAndFlush } from "@/components/landing/track";

/**
 * The hero's check form: domain, keyword, country, device — then signup.
 *
 * The four inputs are collected here rather than on the far side of the hop
 * because they are the argument. By the time a visitor has picked a keyword, a
 * country and a device, they have agreed with the page that all three change
 * the answer; asking for them after the signup wall would waste that.
 *
 * On submit the visitor goes to the app's /signup carrying all four as query
 * params, so the app can pre-fill and run their first check immediately rather
 * than making them retype it. This page runs no check of its own.
 *
 * Two things this must not get wrong, both borrowed from ./Cta:
 *
 *  1. useAppUrl carries the visitor's campaign UTMs across to the app origin.
 *     A paid click that loses its UTMs on the signup hop is an unattributable
 *     conversion, which on an ad landing page is the whole point of the page.
 *     The four form params are merged onto that URL rather than replacing its
 *     query string.
 *  2. trackLandingAndFlush uses sendBeacon, because this click navigates
 *     cross-origin immediately and a batched event would race the unload.
 *
 * Country defaults to the UK rather than geolocating: this page is bought
 * against UK traffic, so GB is right far more often than not, and it saves a
 * blocking third-party request on a paid click.
 */

type Device = "desktop" | "mobile";

export function CheckForm({
  dict,
}: {
  dict: {
    domainLabel: string;
    domainPlaceholder: string;
    keywordLabel: string;
    keywordPlaceholder: string;
    countryLabel: string;
    deviceLabel: string;
    desktop: string;
    mobile: string;
    submit: string;
    checking: string;
    disclaimer: string;
  };
}) {
  const appUrl = useAppUrl();
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("gb");
  const [device, setDevice] = useState<Device>("desktop");
  // Held from the click until the browser actually leaves, so the button cannot
  // be fired twice during the hop.
  const [leaving, setLeaving] = useState(false);
  // One form_start per page load, not per keystroke.
  const startedRef = useRef(false);

  function onFirstInput() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackLanding("form_start", { form: "hero_check" });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const kw = keyword.trim();
    const dom = domain.trim();
    // `required` on both inputs means the browser blocks an empty submit before
    // this runs; the guard covers whitespace-only input and a double Enter.
    if (!kw || !dom || leaving) return;

    // Merged onto appUrl's own query rather than hand-built, so any UTMs it has
    // appended survive.
    const url = new URL(appUrl("/signup"));
    url.searchParams.set("domain", dom);
    url.searchParams.set("keyword", kw);
    url.searchParams.set("country", country);
    url.searchParams.set("device", device);
    const href = url.toString();

    setLeaving(true);
    trackLandingAndFlush("signup_cta_click", {
      placement: "hero_check",
      page: "free_serp_checker_uk",
      domain: dom,
      keyword: kw,
      country,
      device,
      href,
    });
    window.location.href = href;
  }

  return (
    <div className="mx-auto mt-9 w-full max-w-[920px]">
      <form onSubmit={submit} className="uk-form">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="uk-field-group">
            <span className="uk-label">{dict.domainLabel}</span>
            <input
              type="text"
              required
              value={domain}
              disabled={leaving}
              onChange={(e) => {
                onFirstInput();
                setDomain(e.target.value);
              }}
              placeholder={dict.domainPlaceholder}
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              className="uk-input"
            />
          </label>

          <label className="uk-field-group">
            <span className="uk-label">{dict.keywordLabel}</span>
            <input
              type="text"
              required
              value={keyword}
              disabled={leaving}
              onChange={(e) => {
                onFirstInput();
                setKeyword(e.target.value);
              }}
              placeholder={dict.keywordPlaceholder}
              className="uk-input"
            />
          </label>

          <label className="uk-field-group">
            <span className="uk-label">{dict.countryLabel}</span>
            <select
              value={country}
              disabled={leaving}
              onChange={(e) => setCountry(e.target.value)}
              aria-label={dict.countryLabel}
              className="uk-input uk-select"
            >
              <optgroup label="Popular">
                {POPULAR_LOCATIONS.map((l) => (
                  <option key={`p-${l.code}`} value={l.code}>
                    {l.name} {flagFor(l.code)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All countries">
                {ALL_LOCATIONS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} {flagFor(l.code)}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <div className="uk-field-group">
            <span className="uk-label">{dict.deviceLabel}</span>
            {/* A two-button radio group rather than a <select>: there are only
                ever two, and the choice has to be readable at a glance. */}
            <div className="uk-toggle" role="group" aria-label={dict.deviceLabel}>
              {(["desktop", "mobile"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={leaving}
                  aria-pressed={device === d}
                  onClick={() => setDevice(d)}
                  className="uk-toggle-btn"
                >
                  {d === "desktop" ? dict.desktop : dict.mobile}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={leaving}
          className="uk-btn uk-btn-lg uk-btn-primary mt-4 w-full disabled:cursor-wait disabled:opacity-80"
        >
          {leaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {dict.checking}
            </>
          ) : (
            <>
              {dict.submit}
              <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.2} />
            </>
          )}
        </button>
      </form>

      <span className="uk-note">{dict.disclaimer}</span>
    </div>
  );
}
