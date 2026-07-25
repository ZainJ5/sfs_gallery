import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import ArtistCard from "../_components/ArtistCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Artists" };

export default async function ArtistsPage() {
  await connectDB();
  const artists = serialize(
    await Artist.find({ published: true }).sort({ order: 1, name: 1 }).lean()
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        Artists
      </h1>
      {artists.length === 0 ? (
        <p className="text-center text-body">No artists to display yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
          {artists.map((a) => (
            <ArtistCard key={a._id} artist={a} />
          ))}
        </div>
      )}
    </div>
  );
}
