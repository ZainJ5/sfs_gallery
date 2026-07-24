import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import ArtForm from "../ArtForm";
import { createArt } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewArtPage() {
  await connectDB();
  const artists = serialize(await Artist.find().sort({ name: 1 }).select("name").lean());
  return (
    <div>
      <PageHeader title="Add Art" subtitle="Add a new artwork." />
      <ArtForm action={createArt} artists={artists} />
    </div>
  );
}
