"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/app/admin/_components/kit";
import { Field, Input, Toggle, SubmitButton, FormError } from "@/app/admin/_components/form";
import ImageUploader from "@/app/admin/_components/ImageUploader";
import MultiImageUploader from "@/app/admin/_components/MultiImageUploader";
import RichTextEditor from "@/app/admin/_components/RichTextEditor";

function toDateInput(d) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function EventForm({ action, initial = {} }) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <FormError>{state?.error}</FormError>

      <Card>
        <div className="grid gap-6 sm:grid-cols-[auto,1fr]">
          <Field label="Cover image">
            <ImageUploader name="coverUrl" defaultValue={initial.coverUrl || ""} subdir="events" />
          </Field>
          <div className="space-y-4">
            <Field label="Title" required>
              <Input name="title" defaultValue={initial.title || ""} required />
            </Field>
            <Field label="Slug" hint="Leave blank to auto-generate.">
              <Input name="slug" defaultValue={initial.slug || ""} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input type="date" name="date" defaultValue={toDateInput(initial.date)} />
              </Field>
              <Field label="Location">
                <Input name="location" defaultValue={initial.location || ""} placeholder="Santa Fe, NM" />
              </Field>
            </div>
            <Toggle name="published" defaultChecked={initial.published ?? true} label="Published" />
          </div>
        </div>
      </Card>

      <Card>
        <Field label="Description">
          <RichTextEditor name="description" defaultValue={initial.description || ""} />
        </Field>
      </Card>

      <Card>
        <Field label="Photo gallery">
          <MultiImageUploader name="gallery" defaultValue={initial.gallery || []} subdir="events" />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>Save event</SubmitButton>
        <Link href="/admin/events" className="rounded-md px-4 py-2 text-sm text-body hover:text-heading">
          Cancel
        </Link>
      </div>
    </form>
  );
}
