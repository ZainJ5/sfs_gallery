"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Share2, ArrowLeft } from "lucide-react";
import SocialIcon from "./SocialIcon";

export default function ShareButtons({ artistName = "", instagram = "", backHref = "" }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
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
      {backHref && (
        <Link
          href={backHref}
          aria-label="Back to artist page"
          title="Back to artist page"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-white"
        >
          <ArrowLeft size={16} />
        </Link>
      )}
    </div>
  );
}
