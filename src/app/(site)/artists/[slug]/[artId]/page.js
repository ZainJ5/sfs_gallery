import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { serialize } from "@/lib/serialize";
import { getSettings } from "@/lib/settings";
import InquiryForm from "../../../_components/InquiryForm";
import ShareButtons from "../../../_components/ShareButtons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const a = await Artist.findOne({ slug }).select("name").lean();
  return { title: a ? a.name : "Artwork" };
}

export default async function ArtworkPage({ params }) {
  const { slug, artId } = await params;
  await connectDB();

  const artist = await Artist.findOne({ slug, published: true }).lean();
  if (!artist) notFound();

  const arts = serialize(
    await Art.find({ artist: artist._id, published: true }).sort({ order: 1, createdAt: 1 }).lean()
  );
  const idx = arts.findIndex((x) => String(x._id) === String(artId));
  if (idx < 0) notFound();

  const art = arts[idx];
  const prev = arts[(idx - 1 + arts.length) % arts.length];
  const next = arts[(idx + 1) % arts.length];
  const settings = await getSettings();
  const a = serialize(artist);

  const title = art.title || "";
  const info = [
    ["Title", title],
    ["Size", art.dimensions],
    ["Medium", art.medium],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        {a.name}
      </h1>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-center bg-zinc-50">
            {art.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={art.images[0]}
                alt={title || a.name}
                className="max-h-[70vh] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center text-sm text-zinc-300">
                No image
              </div>
            )}
          </div>
          {arts.length > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <Link
                href={`/artists/${a.slug}/${prev._id}`}
                aria-label="Previous artwork"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-white"
              >
                <ChevronLeft size={20} />
              </Link>
              <span className="text-sm text-body">
                {idx + 1} / {arts.length}
              </span>
              <Link
                href={`/artists/${a.slug}/${next._id}`}
                aria-label="Next artwork"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-white"
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="space-y-1.5">
            {info.map(([label, val]) => (
              <p key={label} className="font-slab text-lg font-bold text-heading">
                {label}
                {val ? <span className="font-normal text-body">: {val}</span> : null}
              </p>
            ))}
          </div>

          <h3 className="mt-6 font-slab text-lg font-bold text-heading">Inquiry Form:</h3>
          <InquiryForm artistName={a.name} artworkTitle={title} />
          <ShareButtons artistName={a.name} instagram={settings.socials?.instagram || ""} />
        </div>
      </div>

      <nav className="mt-14 border-t border-line pt-6 text-sm uppercase tracking-wide">
        <Link href={`/artists/${a.slug}`} className="text-gold hover:text-gold-dark">
          ← Back to {a.name}
        </Link>
      </nav>
    </div>
  );
}
