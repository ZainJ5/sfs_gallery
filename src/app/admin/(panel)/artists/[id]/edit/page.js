import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import ArtistForm from "../../ArtistForm";
import { updateArtist, deleteArtist } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditArtistPage({ params }) {
  const { id } = await params;
  await connectDB();

  let doc = null;
  try {
    doc = await Artist.findById(id).lean();
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const initial = serialize(doc);

  return (
    <div>
      <PageHeader
        title="Edit Artist"
        subtitle={initial.name}
        action={
          <DeleteButton action={deleteArtist} id={id} redirectAfter="/admin/artists" />
        }
      />
      <ArtistForm action={updateArtist.bind(null, id)} initial={initial} />
    </div>
  );
}
