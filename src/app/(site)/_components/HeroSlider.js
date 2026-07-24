"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ slides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!slides || slides.length === 0) {
    return (
      <section className="flex h-[55vh] items-center justify-center bg-zinc-100">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-[0.15em] text-heading sm:text-5xl">
            SFS GALLERY
          </h1>
          <p className="mt-3 text-sm uppercase tracking-widest text-body">
            Santa Fe, New Mexico
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => {
            const inner = (
              <div className="relative h-[58vh] w-full sm:h-[80vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl}
                  alt={s.heading || `Slide ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {(s.heading || s.subheading) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 px-4 text-center text-white">
                    {s.heading && (
                      <h2 className="max-w-3xl text-3xl font-semibold sm:text-5xl">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/90 transition hover:bg-black/50"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/90 transition hover:bg-black/50"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}
    </section>
  );
}
