"use client";

import { useState } from "react";

export default function NewsletterFooter() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("ok");
      setMsg("Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    }
  }

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-bold uppercase tracking-[0.12em] text-gold transition-colors hover:text-gold-dark"
      >
        Join Our Mailing List
      </button>
      {open && (
        <form onSubmit={submit} className="mx-auto mt-3 flex max-w-xs">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="min-w-0 flex-1 rounded-l-md border border-line px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-r-md bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
          >
            {status === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}
      {msg && (
        <p className={`mt-2 text-xs ${status === "ok" ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
