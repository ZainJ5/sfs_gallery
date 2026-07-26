import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";
import InquireButton from "../../_components/InquireButton";

export const dynamic = "force-dynamic";

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

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-bold uppercase text-heading sm:text-4xl">
        {e.title}
      </h1>

      {e.description && (
        <div
          className="prose-content mt-8 text-justify"
          dangerouslySetInnerHTML={{ __html: e.description }}
        />
      )}

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img}
              alt={e.title}
              className="mx-auto w-full object-contain"
            />
          ))}
        </div>
      )}

      <InquireButton subject={e.title} />
    </article>
  );
}
