"use client";

import { useState } from "react";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-heading placeholder:italic placeholder:text-zinc-400 outline-none focus:border-gold focus:ring-1 focus:ring-gold";
const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-heading";

export default function ContactPageForm() {
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken("contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${f.firstName} ${f.lastName}`.trim(),
          email: f.email,
          phone: f.phone,
          message: f.message,
          source: "contact",
          recaptchaToken,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send your message.");
      setStatus("ok");
      setF({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-10 text-center text-sm text-green-700">
        Thank you — your message has been sent. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls}>First Name</label>
          <input
            className={inputCls}
            placeholder="Enter your first name"
            required
            value={f.firstName}
            onChange={(e) => up("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input
            className={inputCls}
            placeholder="Enter your last name"
            value={f.lastName}
            onChange={(e) => up("lastName", e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Email Address</label>
          <input
            type="email"
            className={inputCls}
            placeholder="Enter your email address"
            required
            value={f.email}
            onChange={(e) => up("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input
            className={inputCls}
            placeholder="Enter your phone number"
            value={f.phone}
            onChange={(e) => up("phone", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Your Message</label>
        <textarea
          className={`${inputCls} min-h-[190px]`}
          placeholder="Write your message here"
          value={f.message}
          onChange={(e) => up("message", e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-gold px-9 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
