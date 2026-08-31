import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";
import InquireButton from "../../_components/InquireButton";

export const dynamic = "force-dynamic";

// Flip to true to show the event inquiry button again.
const SHOW_INQUIRE_BUTTON = false;

// Extract a YouTube video id from the common URL formats (or a bare id).
function youtubeId(url) {
  const s = String(url || "").trim();
  const m = s.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/|live\/))([A-Za-z0-9_-]{6,})/
  );
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{6,}$/.test(s)) return s;
  return "";
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

  const images = [...new Set([e.coverUrl, ...(e.gallery || [])].filter(Boolean))];
  const videos = (e.videos || []).map(youtubeId).filter(Boolean);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-bold uppercase text-heading sm:text-4xl">
        {e.title}
      </h1>

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img}
              alt={e.title}
              loading="lazy"
              decoding="async"
              className="mx-auto w-full object-contain"
            />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-8 space-y-6">
          {videos.map((id) => (
            <div key={id} className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={e.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {e.description && (
        <div
          className="prose-content mt-8 text-justify"
          dangerouslySetInnerHTML={{ __html: e.description }}
        />
      )}

      {SHOW_INQUIRE_BUTTON && <InquireButton subject={e.title} />}
    </article>
  );
}
