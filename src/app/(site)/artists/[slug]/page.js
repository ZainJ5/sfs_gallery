import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { serialize } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const a = await Artist.findOne({ slug }).select("name bio").lean();
  return {
    title: a ? a.name : "Artist",
    description: a?.bio ? String(a.bio).replace(/<[^>]+>/g, "").slice(0, 160) : undefined,
  };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const artist = await Artist.findOne({ slug, published: true }).lean();
  if (!artist) notFound();

  const arts = serialize(
    await Art.find({ artist: artist._id, published: true }).sort({ order: 1, createdAt: 1 }).lean()
  );

  const all = await Artist.find({ published: true })
    .sort({ order: 1, name: 1 })
    .select("name slug")
    .lean();
  const idx = all.findIndex((x) => String(x._id) === String(artist._id));
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const a = serialize(artist);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        {a.name}
      </h1>

      {a.bio && (
        <div
          className="prose-content mx-auto mb-10 max-w-4xl"
          dangerouslySetInnerHTML={{ __html: a.bio }}
        />
      )}

      <div className="mb-10 flex justify-center">
        <a
          href={`/artists/${a.slug}/download`}
          className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download artist info (PDF)
        </a>
      </div>

      {arts.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {arts.map((art) => (
            <Link
              key={art._id}
              href={`/artists/${a.slug}/${art._id}`}
              className="group block aspect-square overflow-hidden bg-white"
            >
              {art.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={art.images[0]}
                  alt={art.title || a.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-300">
                  No image
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <nav className="mt-14 flex items-center justify-between border-t border-line pt-6 text-sm uppercase tracking-wide">
        {prev ? (
          <Link href={`/artists/${prev.slug}`} className="text-gold hover:text-gold-dark">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/artists/${next.slug}`} className="text-gold hover:text-gold-dark">
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
