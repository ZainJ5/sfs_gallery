import { Plus } from "lucide-react";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";
import { serialize } from "@/lib/serialize";
import { PageHeader, ButtonLink } from "@/app/admin/_components/kit";
import DataTable from "@/app/admin/_components/DataTable";
import { deleteSlider } from "./actions";

export const dynamic = "force-dynamic";

const columns = [
  { key: "imageUrl", label: "Image", type: "image" },
  { key: "heading", label: "Heading", type: "text" },
  { key: "order", label: "Order", type: "text" },
  { key: "active", label: "Status", type: "bool", trueLabel: "Active", falseLabel: "Hidden" },
];

export default async function SlidersListPage() {
  await connectDB();
  const rows = serialize(await Slider.find().sort({ order: 1, createdAt: 1 }).lean());

  return (
    <div>
      <PageHeader
        title="All Sliders"
        subtitle={`${rows.length} slide${rows.length === 1 ? "" : "s"} in the homepage hero`}
        action={
          <ButtonLink href="/admin/sliders/new">
            <Plus size={16} /> Add Slider
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        basePath="/admin/sliders"
        deleteAction={deleteSlider}
        emptyLabel="No slides yet. Add your first hero slide."
      />
    </div>
  );
}
