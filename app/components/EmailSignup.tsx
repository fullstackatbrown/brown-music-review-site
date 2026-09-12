"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Connect to mailing list service (Mailchimp, Buttondown, etc.)
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <section style={{
      width: "100%",
      padding: "42px 34px",
      borderTop: "1px solid #0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
      fontFamily: "var(--font-helvetica)",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        fontWeight: 700,
        color: "#0a0a0a",
        margin: 0,
      }}>
        Never Miss a Review
      </h2>
      <p style={{
        fontFamily: "var(--font-helvetica)",
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        color: "#888",
        margin: 0,
      }}>
        Subscribe to get the latest from Brown Music Review
      </p>

      {status === "success" ? (
        <p style={{
          fontFamily: "var(--font-helvetica)",
          fontSize: "0.72rem",
          color: "#e01010",
          letterSpacing: "0.08em",
        }}>
          ✓ You&apos;re subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          gap: "6px",
          marginTop: "6px",
          width: "100%",
          maxWidth: "360px",
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            style={{
              flex: 1,
              padding: "9px 12px",
              border: "1px solid #0a0a0a",
              fontFamily: "var(--font-helvetica)",
              fontSize: "0.8rem",
              outline: "none",
              background: "#fff",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "9px 18px",
              background: "#0a0a0a",
              color: "#fff",
              border: "none",
              fontFamily: "var(--font-helvetica)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
    </section>
  );
}
