import { Plus } from "lucide-react";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { serialize } from "@/lib/serialize";
import { PageHeader, ButtonLink } from "@/app/admin/_components/kit";
import DataTable from "@/app/admin/_components/DataTable";
import { deleteArtist } from "./actions";

export const dynamic = "force-dynamic";

const columns = [
  { key: "name", label: "Artist", type: "thumb", image: "photoUrl" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "order", label: "Order", type: "text" },
  { key: "published", label: "Status", type: "bool", trueLabel: "Published", falseLabel: "Draft" },
];

export default async function ArtistsListPage() {
  await connectDB();
  const rows = serialize(await Artist.find().sort({ order: 1, name: 1 }).lean());

  return (
    <div>
      <PageHeader
        title="All Artists"
        subtitle={`${rows.length} artist${rows.length === 1 ? "" : "s"}`}
        action={
          <ButtonLink href="/admin/artists/new">
            <Plus size={16} /> Add Artist
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        basePath="/admin/artists"
        deleteAction={deleteArtist}
        searchKeys={["name", "slug"]}
        emptyLabel="No artists yet. Add your first artist."
      />
    </div>
  );
}
