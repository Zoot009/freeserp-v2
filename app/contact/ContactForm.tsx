"use client";

import { useState } from "react";
import { COLORS } from "@/components/site/constants";

type Status = "idle" | "sending" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  outline: "none",
  background: "#fff",
  color: COLORS.black,
  boxSizing: "border-box",
};

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: COLORS.black }}>
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: COLORS.black }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: COLORS.black }}>
          Message
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          padding: "13px 28px",
          background: status === "sending" ? COLORS.subtle : COLORS.blue,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: status === "sending" ? "not-allowed" : "pointer",
          transition: "background .2s",
          alignSelf: "flex-start",
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p style={{ color: COLORS.green, fontSize: 14, margin: 0 }}>
          Message sent! We will get back to you shortly.
        </p>
      )}
      {status === "error" && (
        <p style={{ color: COLORS.red, fontSize: 14, margin: 0 }}>
          Something went wrong. Please email us directly at{" "}
          <a href="mailto:support@freeserp.com" style={{ color: COLORS.blue }}>
            support@freeserp.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
