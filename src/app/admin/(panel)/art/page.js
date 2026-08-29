import { Plus, Images } from "lucide-react";
import { connectDB } from "@/lib/db";
import Art from "@/models/Art";
import { serialize } from "@/lib/serialize";
import { PageHeader, ButtonLink } from "@/app/admin/_components/kit";
import DataTable from "@/app/admin/_components/DataTable";
import { deleteArt } from "./actions";

export const dynamic = "force-dynamic";

const columns = [
  { key: "title", label: "Artwork", type: "thumb", image: "cover" },
  { key: "artistName", label: "Artist", type: "text" },
  { key: "price", label: "Price", type: "text" },
  { key: "featured", label: "Featured", type: "bool", trueLabel: "Yes", falseLabel: "No" },
  { key: "published", label: "Status", type: "bool", trueLabel: "Published", falseLabel: "Draft" },
];

export default async function ArtListPage() {
  await connectDB();
  const docs = serialize(await Art.find().sort({ order: 1, createdAt: -1 }).lean());
  const rows = docs.map((d) => ({ ...d, cover: d.images?.[0] || "" }));

  return (
    <div>
      <PageHeader
        title="All Arts"
        subtitle={`${rows.length} artwork${rows.length === 1 ? "" : "s"}`}
        action={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/admin/art/bulk" variant="outline">
              <Images size={16} /> Bulk Add
            </ButtonLink>
            <ButtonLink href="/admin/art/new">
              <Plus size={16} /> Add Art
            </ButtonLink>
          </div>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        basePath="/admin/art"
        deleteAction={deleteArt}
        searchKeys={["title", "artistName"]}
        emptyLabel="No artworks yet."
      />
    </div>
  );
}
