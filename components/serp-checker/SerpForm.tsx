"use client";

import { useState } from "react";
import { COLORS } from "@/components/site/constants";
import { COUNTRIES } from "./data";

type Device = "desktop" | "mobile";

export function SerpForm() {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("United States");
  const [device, setDevice] = useState<Device>("desktop");
  const [submitted, setSubmitted] = useState<null | { domain: string; keyword: string; country: string; device: Device }>(null);

  return (
    <div className="fs-serp-card-wrap" style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
      <div className="fs-serp-halo" aria-hidden="true" />
      <div
        className="fs-serp-card"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          textAlign: "left",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted({ domain, keyword, country, device });
          }}
        >
          <div
            className="fs-form-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
          >
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Domain</span>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="fs-serp-input"
                style={inputStyle}
              />
            </label>
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Keyword</span>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="best running shoes"
                className="fs-serp-input"
                style={inputStyle}
              />
            </label>
          </div>

          <div
            className="fs-form-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}
          >
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Country</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="fs-serp-input"
                style={{ ...inputStyle, background: "#fff", appearance: "none", cursor: "pointer" }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <div>
              <span style={labelStyle}>Device</span>
              <div
                style={{
                  marginTop: 6,
                  background: COLORS.softGray,
                  padding: 4,
                  borderRadius: 10,
                  position: "relative",
                  display: "flex",
                  height: 46,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    width: "calc(50% - 4px)",
                    background: COLORS.blue,
                    borderRadius: 8,
                    transition: "transform .3s ease",
                    transform: `translateX(${device === "desktop" ? 0 : "100%"})`,
                  }}
                />
                {(["desktop", "mobile"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    style={{
                      position: "relative",
                      background: "transparent",
                      border: "none",
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      color: device === d ? "#fff" : COLORS.black,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontFamily: "inherit",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="fs-serp-submit"
            style={{
              width: "100%",
              background: COLORS.blue,
              color: "#fff",
              border: "none",
              padding: "16px 24px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "-.1px",
              boxShadow: "0 8px 22px rgba(4,84,255,.25)",
            }}
          >
            Check Rankings →
          </button>
        </form>

        {submitted && (
          <div
            style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 12,
              background: COLORS.softGray,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "8px 16px",
              fontSize: 14,
              color: COLORS.black,
            }}
          >
            <span style={{ color: COLORS.gray }}>Domain:</span>
            <span style={{ fontWeight: 500 }}>{submitted.domain}</span>
            <span style={{ color: COLORS.gray }}>Keyword:</span>
            <span style={{ fontWeight: 500 }}>{submitted.keyword}</span>
            <span style={{ color: COLORS.gray }}>Country:</span>
            <span style={{ fontWeight: 500 }}>{submitted.country}</span>
            <span style={{ color: COLORS.gray }}>Device:</span>
            <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{submitted.device}</span>
            <span style={{ color: COLORS.gray }}>Status:</span>
            <span style={{ color: COLORS.blue, fontWeight: 600 }}>
              Connect the FreeSERP API to run a live check
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.gray,
  letterSpacing: ".08em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  color: COLORS.black,
};
