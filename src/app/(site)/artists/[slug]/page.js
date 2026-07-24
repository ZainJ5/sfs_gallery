import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { serialize } from "@/lib/serialize";
import ArtistGallery from "../../_components/ArtistGallery";

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

export default async function ArtistDetailPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const artist = await Artist.findOne({ slug, published: true }).lean();
  if (!artist) notFound();

  const arts = serialize(
    await Art.find({ artist: artist._id, published: true }).sort({ order: 1, createdAt: 1 }).lean()
  );
  const images = arts.flatMap((a) => (Array.isArray(a.images) ? a.images : [])).filter(Boolean);

  const all = await Artist.find({ published: true })
    .sort({ order: 1, name: 1 })
    .select("name slug")
    .lean();
  const idx = all.findIndex((x) => String(x._id) === String(artist._id));
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const a = serialize(artist);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-4xl font-semibold text-heading">{a.name}</h1>
      {a.bio && (
        <div
          className="prose-content mx-auto mt-6 max-w-2xl text-center"
          dangerouslySetInnerHTML={{ __html: a.bio }}
        />
      )}

      <ArtistGallery images={images} artistName={a.name} />

      <nav className="mt-16 flex items-center justify-between border-t border-line pt-6 text-sm uppercase tracking-wide">
        {prev ? (
          <Link href={`/artists/${prev.slug}`} className="text-body hover:text-heading">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/artists/${next.slug}`} className="text-body hover:text-heading">
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
