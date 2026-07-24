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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-heading sm:text-4xl">
        Our Artists
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-body">
        Explore the artists represented by San Francisco Street Gallery.
      </p>
      {artists.length === 0 ? (
        <p className="mt-12 text-center text-body">No artists to display yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {artists.map((a) => (
            <ArtistCard key={a._id} artist={a} />
          ))}
        </div>
      )}
    </div>
  );
}
