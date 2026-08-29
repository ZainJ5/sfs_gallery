import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import BulkArtForm from "../BulkArtForm";
import { createArtBulk } from "../actions";

export const dynamic = "force-dynamic";

export default async function BulkArtPage() {
  await connectDB();
  const artists = serialize(await Artist.find().sort({ name: 1 }).select("name").lean());
  return (
    <div>
      <PageHeader
        title="Bulk Add Art"
        subtitle="Upload many images at once and set each one's details."
      />
      <BulkArtForm artists={artists} action={createArtBulk} />
    </div>
  );
}
