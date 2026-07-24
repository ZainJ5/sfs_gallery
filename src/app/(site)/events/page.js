import Link from "next/link";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events" };

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EventsPage() {
  await connectDB();
  const events = serialize(
    await Event.find({ published: true }).sort({ date: -1, createdAt: -1 }).lean()
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-heading sm:text-4xl">Events</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-body">
        Exhibitions, openings and gatherings at the gallery.
      </p>
      {events.length === 0 ? (
        <p className="mt-12 text-center text-body">No events to display yet.</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e._id} href={`/events/${e.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                {e.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.coverUrl}
                    alt={e.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-300">
                    No image
                  </div>
                )}
              </div>
              <h2 className="mt-3 text-lg font-medium text-heading group-hover:text-brand-dark">
                {e.title}
              </h2>
              <p className="text-sm text-body">
                {[fmtDate(e.date), e.location].filter(Boolean).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
