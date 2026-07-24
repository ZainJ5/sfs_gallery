"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-heading outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export default function ContactForm({ source = "contact", artistName = "", showSubject = true }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source, artistName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your message.");
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-700">
        Thank you — your message has been sent. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Your name *"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className={inputClass}
          type="email"
          placeholder="Your email *"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        {showSubject && (
          <input
            className={inputClass}
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
          />
        )}
      </div>
      <textarea
        className={`${inputClass} min-h-[120px]`}
        placeholder={artistName ? `I'm interested in ${artistName}'s work…` : "Your message"}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-heading px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
