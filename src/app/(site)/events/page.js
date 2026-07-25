import Link from "next/link";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events" };

export default async function EventsPage() {
  await connectDB();
  const events = serialize(
    await Event.find({ published: true }).sort({ date: -1, createdAt: -1 }).lean()
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        Events
      </h1>
      {events.length === 0 ? (
        <p className="text-center text-body">No events to display yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e._id} href={`/events/${e.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
                {e.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.coverUrl}
                    alt={e.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-200" />
                )}
              </div>
              <h2 className="mt-3 text-center text-lg font-bold text-heading transition-colors group-hover:text-gold">
                {e.title}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
