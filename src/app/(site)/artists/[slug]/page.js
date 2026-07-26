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
