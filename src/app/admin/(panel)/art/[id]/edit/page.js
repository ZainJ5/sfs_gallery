import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Art from "@/models/Art";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import ArtForm from "../../ArtForm";
import { updateArt, deleteArt } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditArtPage({ params }) {
  const { id } = await params;
  await connectDB();

  let doc = null;
  try {
    doc = await Art.findById(id).lean();
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const initial = serialize(doc);
  const artists = serialize(await Artist.find().sort({ name: 1 }).select("name").lean());

  return (
    <div>
      <PageHeader
        title="Edit Art"
        subtitle={initial.title}
        action={<DeleteButton action={deleteArt} id={id} redirectAfter="/admin/art" />}
      />
      <ArtForm action={updateArt.bind(null, id)} initial={initial} artists={artists} />
    </div>
  );
}
