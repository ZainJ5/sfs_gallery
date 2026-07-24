"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ArtistGallery({ images = [], artistName = "", showInquire = true }) {
  const [index, setIndex] = useState(-1);
  const [inquire, setInquire] = useState(false);
  const open = index >= 0 && index < images.length;

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setIndex(-1);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <>
      {images.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group aspect-square overflow-hidden bg-zinc-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {showInquire && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setInquire(true)}
            className="rounded-full bg-heading px-10 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-brand-dark"
          >
            Inquire
          </button>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={() => setIndex(-1)}
        >
          <button
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={() => setIndex(-1)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-3 text-white/80 hover:text-white sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={40} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-3 text-white/80 hover:text-white sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            aria-label="Next"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {inquire && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setInquire(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-heading">
                Inquire{artistName ? ` about ${artistName}` : ""}
              </h3>
              <button
                onClick={() => setInquire(false)}
                className="text-body hover:text-heading"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <ContactForm source="inquire" artistName={artistName} showSubject={false} />
          </div>
        </div>
      )}
    </>
  );
}
