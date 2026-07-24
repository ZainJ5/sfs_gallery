import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";
import ArtistGallery from "../../_components/ArtistGallery";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const e = await Event.findOne({ slug }).select("title").lean();
  return { title: e ? e.title : "Event" };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const doc = await Event.findOne({ slug, published: true }).lean();
  if (!doc) notFound();
  const e = serialize(doc);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-4xl font-semibold text-heading">{e.title}</h1>
      <p className="mt-3 text-center text-body">
        {[fmtDate(e.date), e.location].filter(Boolean).join(" · ")}
      </p>
      {e.coverUrl && (
        <div className="mt-8 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.coverUrl} alt={e.title} className="w-full object-cover" />
        </div>
      )}
      {e.description && (
        <div
          className="prose-content mx-auto mt-8 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: e.description }}
        />
      )}
      {Array.isArray(e.gallery) && e.gallery.length > 0 && (
        <ArtistGallery images={e.gallery} showInquire={false} />
      )}
    </article>
  );
}
