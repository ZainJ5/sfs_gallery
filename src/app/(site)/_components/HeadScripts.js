"use client";

import { useEffect, useRef } from "react";

/**
 * Injects admin-stored raw snippets (Meta Pixel / Google Analytics) into
 * <head>. Uses createContextualFragment so the parsed <script> tags actually
 * execute (unlike dangerouslySetInnerHTML, whose scripts never run).
 */
export default function HeadScripts({ pixelCode, gaCode }) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const inject = (html) => {
      if (!html || !html.trim()) return;
      try {
        const frag = document.createRange().createContextualFragment(html);
        document.head.appendChild(frag);
      } catch {
        /* ignore malformed snippets */
      }
    };

    inject(gaCode);
    inject(pixelCode);
  }, [pixelCode, gaCode]);

  return null;
}
