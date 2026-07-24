import { PageHeader } from "@/app/admin/_components/kit";
import EventForm from "../EventForm";
import { createEvent } from "../actions";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div>
      <PageHeader title="Add Event" subtitle="Create a new event." />
      <EventForm action={createEvent} />
    </div>
  );
}
