import Link from "next/link";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { getSettings } from "@/lib/settings";
import HeroSlider from "./_components/HeroSlider";
import ArtistCard from "./_components/ArtistCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();
  const [slides, artists, settings] = await Promise.all([
    Slider.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean().then(serialize),
    Artist.find({ published: true }).sort({ order: 1, name: 1 }).limit(8).lean().then(serialize),
    getSettings(),
  ]);

  return (
    <div>
      <HeroSlider slides={slides} />

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
          {settings.siteTitle}
        </h1>
        <p className="mt-4 leading-8 text-body">
          {settings.metaDescription ||
            "A contemporary fine art gallery in the heart of Santa Fe, representing a diverse group of established and emerging artists."}
        </p>
        {settings.address && <p className="mt-2 text-sm text-body">{settings.address}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/artists"
            className="rounded-full bg-heading px-7 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-brand-dark"
          >
            Meet the Artists
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-line px-7 py-3 text-sm uppercase tracking-widest text-heading transition-colors hover:bg-zinc-50"
          >
            Upcoming Events
          </Link>
        </div>
      </section>

      {artists.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-semibold text-heading">
            Featured Artists
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((a) => (
              <ArtistCard key={a._id} artist={a} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/artists"
              className="text-sm uppercase tracking-widest text-brand-dark hover:underline"
            >
              View all artists →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
