"use client";

import { useState } from "react";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-heading placeholder:text-zinc-400 outline-none focus:border-gold focus:ring-1 focus:ring-gold";

export default function InquiryForm({ artistName = "", artworkTitle = "" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "Hi, I'm interested in this work. Could you please provide more information about the piece?",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const up = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken("inquire");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source: "inquire",
          artistName,
          subject: artworkTitle ? `Inquiry: ${artworkTitle}` : "",
          recaptchaToken,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send your inquiry.");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "ok") {
    return (
      <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-4 py-6 text-sm text-green-700">
        Thank you — your inquiry has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <input
        className={inputCls}
        placeholder="Full Name *"
        required
        value={form.name}
        onChange={(e) => up("name", e.target.value)}
      />
      <input
        type="email"
        className={inputCls}
        placeholder="Email Address *"
        required
        value={form.email}
        onChange={(e) => up("email", e.target.value)}
      />
      <input
        className={inputCls}
        placeholder="Phone Number"
        value={form.phone}
        onChange={(e) => up("phone", e.target.value)}
      />
      <textarea
        className={`${inputCls} min-h-[120px]`}
        value={form.message}
        onChange={(e) => up("message", e.target.value)}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-heading px-8 py-2.5 text-sm font-medium uppercase tracking-wide text-heading transition-colors hover:bg-heading hover:text-white disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Inquire"}
      </button>
    </form>
  );
}
