import { Plus } from "lucide-react";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";
import { PageHeader, ButtonLink } from "@/app/admin/_components/kit";
import DataTable from "@/app/admin/_components/DataTable";
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

const columns = [
  { key: "title", label: "Event", type: "thumb", image: "coverUrl" },
  { key: "location", label: "Location", type: "text" },
  { key: "date", label: "Date", type: "date" },
  { key: "published", label: "Status", type: "bool", trueLabel: "Published", falseLabel: "Draft" },
];

export default async function EventsListPage() {
  await connectDB();
  const rows = serialize(await Event.find().sort({ date: -1, createdAt: -1 }).lean());

  return (
    <div>
      <PageHeader
        title="All Events"
        subtitle={`${rows.length} event${rows.length === 1 ? "" : "s"}`}
        action={
          <ButtonLink href="/admin/events/new">
            <Plus size={16} /> Add Event
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        basePath="/admin/events"
        deleteAction={deleteEvent}
        searchKeys={["title", "location"]}
        emptyLabel="No events yet."
      />
    </div>
  );
}
