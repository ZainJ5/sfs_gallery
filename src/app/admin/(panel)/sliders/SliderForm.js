"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/app/admin/_components/kit";
import { Field, Input, Toggle, SubmitButton, FormError } from "@/app/admin/_components/form";
import ImageUploader from "@/app/admin/_components/ImageUploader";

export default function SliderForm({ action, initial = {} }) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <FormError>{state?.error}</FormError>

      <Card>
        <div className="grid gap-6 sm:grid-cols-[auto,1fr]">
          <Field label="Slide image" required>
            <ImageUploader name="imageUrl" defaultValue={initial.imageUrl || ""} subdir="sliders" />
          </Field>
          <div className="space-y-4">
            <Field label="Heading" hint="Optional text overlaid on the slide.">
              <Input name="heading" defaultValue={initial.heading || ""} />
            </Field>
            <Field label="Subheading">
              <Input name="subheading" defaultValue={initial.subheading || ""} />
            </Field>
            <Field label="Link URL" hint="Where the slide links to (optional).">
              <Input name="linkUrl" defaultValue={initial.linkUrl || ""} placeholder="/artists" />
            </Field>
            <div className="flex items-center gap-8">
              <Field label="Sort order">
                <Input type="number" name="order" defaultValue={initial.order ?? 0} className="w-28" />
              </Field>
              <div className="pt-6">
                <Toggle name="active" defaultChecked={initial.active ?? true} label="Active" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>Save slide</SubmitButton>
        <Link href="/admin/sliders" className="rounded-md px-4 py-2 text-sm text-body hover:text-heading">
          Cancel
        </Link>
      </div>
    </form>
  );
}
