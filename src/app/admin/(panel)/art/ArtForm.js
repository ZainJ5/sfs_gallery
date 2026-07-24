"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/app/admin/_components/kit";
import {
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  SubmitButton,
  FormError,
} from "@/app/admin/_components/form";
import MultiImageUploader from "@/app/admin/_components/MultiImageUploader";

export default function ArtForm({ action, initial = {}, artists = [] }) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <FormError>{state?.error}</FormError>

      <Card>
        <Field label="Images" hint="First image is used as the cover. Drag order with the arrows.">
          <MultiImageUploader
            name="images"
            defaultValue={initial.images || []}
            subdir="art"
          />
        </Field>
      </Card>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <Input name="title" defaultValue={initial.title || ""} required />
          </Field>
          <Field label="Artist">
            <Select name="artist" defaultValue={initial.artist || ""}>
              <option value="">— Unassigned —</option>
              {artists.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price">
            <Input name="price" defaultValue={initial.price || ""} placeholder="$1,200" />
          </Field>
          <Field label="Medium">
            <Input name="medium" defaultValue={initial.medium || ""} placeholder="Oil on canvas" />
          </Field>
          <Field label="Dimensions">
            <Input name="dimensions" defaultValue={initial.dimensions || ""} placeholder='24" x 36"' />
          </Field>
          <Field label="Sort order">
            <Input type="number" name="order" defaultValue={initial.order ?? 0} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Description">
            <Textarea name="description" defaultValue={initial.description || ""} />
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-8">
          <Toggle name="featured" defaultChecked={initial.featured ?? false} label="Featured" />
          <Toggle name="published" defaultChecked={initial.published ?? true} label="Published" />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>Save artwork</SubmitButton>
        <Link href="/admin/art" className="rounded-md px-4 py-2 text-sm text-body hover:text-heading">
          Cancel
        </Link>
      </div>
    </form>
  );
}
