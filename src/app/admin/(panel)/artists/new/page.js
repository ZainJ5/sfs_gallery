import { PageHeader } from "@/app/admin/_components/kit";
import ArtistForm from "../ArtistForm";
import { createArtist } from "../actions";

export const dynamic = "force-dynamic";

export default function NewArtistPage() {
  return (
    <div>
      <PageHeader title="Add Artist" subtitle="Create a new artist profile." />
      <ArtistForm action={createArtist} />
    </div>
  );
}
