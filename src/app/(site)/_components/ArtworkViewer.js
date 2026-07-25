"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Mail, Share2 } from "lucide-react";
import SocialIcon from "./SocialIcon";

const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-heading placeholder:text-zinc-400 outline-none focus:border-gold focus:ring-1 focus:ring-gold";

export default function ArtworkViewer({ artworks = [], artistName = "", instagram = "" }) {
  const [idx, setIdx] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "Hi, I'm interested in this work. Could you please provide more information about the piece?",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const has = artworks.length > 0;
  const art = has ? artworks[idx] : null;
  const prev = () => setIdx((i) => (i - 1 + artworks.length) % artworks.length);
  const next = () => setIdx((i) => (i + 1) % artworks.length);
  const up = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
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

  function copyLink() {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const info = [
    ["Title", art?.title],
    ["Size", art?.size],
    ["Medium", art?.medium],
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Artwork viewer */}
      <div>
        <div className="flex items-center justify-center bg-zinc-50">
          {art?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={art.image}
              alt={artistName}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-sm text-zinc-300">
              No artwork yet
            </div>
          )}
        </div>
        {artworks.length > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={prev}
              aria-label="Previous artwork"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-body">
              {idx + 1} / {artworks.length}
            </span>
            <button
              onClick={next}
              aria-label="Next artwork"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Info + inquiry */}
      <div>
        <div className="space-y-1.5">
          {info.map(([label, val]) => (
            <p key={label} className="font-slab text-lg font-bold text-heading">
              {label}
              {val ? <span className="font-normal text-body">: {val}</span> : null}
            </p>
          ))}
        </div>

        <h3 className="mt-6 font-slab text-lg font-bold text-heading">Inquiry Form:</h3>
        {status === "ok" ? (
          <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-4 py-6 text-sm text-green-700">
            Thank you — your inquiry has been sent.
          </div>
        ) : (
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
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-slab text-sm font-bold text-heading">
            Share on Social Media
          </span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="text-[#1877f2] transition-opacity hover:opacity-70"
          >
            <SocialIcon name="facebook" size={20} />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(artistName)}&body=${encodeURIComponent(shareUrl)}`}
            aria-label="Share via email"
            className="text-heading transition-opacity hover:opacity-70"
          >
            <Mail size={20} />
          </a>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#e1306c] transition-opacity hover:opacity-70"
            >
              <SocialIcon name="instagram" size={20} />
            </a>
          )}
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="text-body transition-colors hover:text-gold"
          >
            <Share2 size={18} />
          </button>
          {copied && <span className="text-xs text-green-600">Copied!</span>}
        </div>
      </div>
    </div>
  );
}
