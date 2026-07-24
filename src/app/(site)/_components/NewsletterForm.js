"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "", "loading", "ok", "error"
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("ok");
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <div className="flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-l-md border border-line bg-white px-3 py-2.5 text-sm text-heading outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-r-md bg-heading px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Join"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-2 text-xs ${
            status === "ok" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
