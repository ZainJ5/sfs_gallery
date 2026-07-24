import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import EventForm from "../../EventForm";
import { updateEvent, deleteEvent } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }) {
  const { id } = await params;
  await connectDB();

  let doc = null;
  try {
    doc = await Event.findById(id).lean();
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const initial = serialize(doc);

  return (
    <div>
      <PageHeader
        title="Edit Event"
        subtitle={initial.title}
        action={<DeleteButton action={deleteEvent} id={id} redirectAfter="/admin/events" />}
      />
      <EventForm action={updateEvent.bind(null, id)} initial={initial} />
    </div>
  );
}
