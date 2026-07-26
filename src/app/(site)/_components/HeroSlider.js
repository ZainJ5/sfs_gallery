"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ slides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return (
      <section className="mx-auto max-w-[1140px] px-4 pt-4 sm:px-6">
        <div className="flex aspect-[2/1] items-center justify-center bg-zinc-100">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-[0.15em] text-heading sm:text-5xl">
              SFS GALLERY
            </h1>
            <p className="mt-3 text-sm uppercase tracking-widest text-body">
              Santa Fe, New Mexico
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1140px] px-4 pt-4 sm:px-6">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((s, i) => {
              const inner = (
                <div className="relative aspect-[2/1] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.imageUrl}
                    alt={s.heading || `Slide ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {(s.heading || s.subheading) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 px-4 text-center text-white">
                      {s.heading && (
                        <h2 className="max-w-3xl text-2xl font-semibold sm:text-4xl">
                          {s.heading}
                        </h2>
                      )}
                      {s.subheading && (
                        <p className="mt-3 max-w-xl text-sm sm:text-lg">{s.subheading}</p>
                      )}
                    </div>
                  )}
                </div>
              );
              return (
                <div key={s._id || i} className="min-w-0 flex-[0_0_100%]">
                  {s.linkUrl ? (
                    <a href={s.linkUrl} className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white/90 transition hover:bg-black/45"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white/90 transition hover:bg-black/45"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 py-5">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === selected ? "bg-[#3b66d3]" : "bg-zinc-300 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
