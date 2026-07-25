import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { serialize } from "@/lib/serialize";
import { getSettings } from "@/lib/settings";
import ArtworkViewer from "../../_components/ArtworkViewer";

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
  const settings = await getSettings();

  // Flatten to one entry per artwork image, carrying its title/size/medium.
  const artworks = [];
  for (const art of arts) {
    const cleanTitle = art.title && !/\s[—-]\s\d+$/.test(art.title) ? art.title : "";
    const imgs = Array.isArray(art.images) && art.images.length ? art.images : [];
    for (const img of imgs) {
      artworks.push({
        image: img,
        title: cleanTitle,
        size: art.dimensions || "",
        medium: art.medium || "",
      });
    }
  }

  const a = serialize(artist);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        {a.name}
      </h1>
      <ArtworkViewer
        artworks={artworks}
        artistName={a.name}
        bio={a.bio || ""}
        instagram={settings.socials?.instagram || ""}
      />
    </div>
  );
}
