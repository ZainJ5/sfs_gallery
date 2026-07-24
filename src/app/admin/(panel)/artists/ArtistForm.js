"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/app/admin/_components/kit";
import { Field, Input, Toggle, SubmitButton, FormError } from "@/app/admin/_components/form";
import ImageUploader from "@/app/admin/_components/ImageUploader";
import RichTextEditor from "@/app/admin/_components/RichTextEditor";

export default function ArtistForm({ action, initial = {} }) {
  const [state, formAction] = useActionState(action, {});
  const s = initial.socials || {};

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <FormError>{state?.error}</FormError>

      <Card>
        <div className="grid gap-6 sm:grid-cols-[auto,1fr]">
          <Field label="Photo">
            <ImageUploader
              name="photoUrl"
              defaultValue={initial.photoUrl || ""}
              subdir="artists"
            />
          </Field>

          <div className="space-y-4">
            <Field label="Name" required>
              <Input name="name" defaultValue={initial.name || ""} required />
            </Field>
            <Field label="Slug" hint="Leave blank to auto-generate from the name.">
              <Input name="slug" defaultValue={initial.slug || ""} placeholder="amado-pena" />
            </Field>
            <div className="flex items-center gap-6">
              <Field label="Sort order">
                <Input
                  type="number"
                  name="order"
                  defaultValue={initial.order ?? 0}
                  className="w-28"
                />
              </Field>
              <div className="pt-6">
                <Toggle
                  name="published"
                  defaultChecked={initial.published ?? true}
                  label="Published"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Field label="Biography">
          <RichTextEditor name="bio" defaultValue={initial.bio || ""} />
        </Field>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
          Social links
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Facebook">
            <Input name="facebook" defaultValue={s.facebook || ""} placeholder="https://…" />
          </Field>
          <Field label="Instagram">
            <Input name="instagram" defaultValue={s.instagram || ""} placeholder="https://…" />
          </Field>
          <Field label="Website">
            <Input name="website" defaultValue={s.website || ""} placeholder="https://…" />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>Save artist</SubmitButton>
        <Link
          href="/admin/artists"
          className="rounded-md px-4 py-2 text-sm text-body hover:text-heading"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
