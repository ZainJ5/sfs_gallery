"use client";

import { useActionState } from "react";
import { Card } from "@/app/admin/_components/kit";
import {
  Field,
  Input,
  Textarea,
  SubmitButton,
  FormError,
} from "@/app/admin/_components/form";
import ImageUploader from "@/app/admin/_components/ImageUploader";

export default function SettingsForm({ action, initial = {} }) {
  const [state, formAction] = useActionState(action, {});
  const socials = initial.socials || {};
  const phones = initial.phones || {};

  return (
    <form action={formAction} className="space-y-6">
      <FormError>{state?.error}</FormError>
      {state?.ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.message}
        </div>
      )}

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
          Branding & SEO
        </h3>
        <div className="grid gap-6 sm:grid-cols-[auto,1fr]">
          <Field label="Logo">
            <ImageUploader name="logoUrl" defaultValue={initial.logoUrl || ""} subdir="settings" />
          </Field>
          <div className="space-y-4">
            <Field label="Site title">
              <Input name="siteTitle" defaultValue={initial.siteTitle || ""} />
            </Field>
            <Field label="Meta keywords" hint="Comma-separated.">
              <Input name="metaKeywords" defaultValue={initial.metaKeywords || ""} />
            </Field>
            <Field label="Meta description">
              <Textarea name="metaDescription" defaultValue={initial.metaDescription || ""} />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
          Tracking codes
        </h3>
        <div className="space-y-4">
          <Field
            label="Meta Pixel code"
            hint="Paste the full snippet, including <script> tags. Injected site-wide."
          >
            <Textarea name="pixelCode" defaultValue={initial.pixelCode || ""} className="font-mono text-xs" />
          </Field>
          <Field
            label="Google Analytics code"
            hint="Paste the full GA/gtag snippet, including <script> tags."
          >
            <Textarea name="gaCode" defaultValue={initial.gaCode || ""} className="font-mono text-xs" />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
          Contact details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Address">
            <Input name="address" defaultValue={initial.address || ""} />
          </Field>
          <Field label="Email">
            <Input name="email" defaultValue={initial.email || ""} />
          </Field>
          <Field label="Phone (office)">
            <Input name="phoneOffice" defaultValue={phones.office || ""} />
          </Field>
          <Field label="Phone (direct)">
            <Input name="phoneDirect" defaultValue={phones.direct || ""} />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
          Social media
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook">
            <Input name="facebook" defaultValue={socials.facebook || ""} placeholder="https://facebook.com/…" />
          </Field>
          <Field label="Instagram">
            <Input name="instagram" defaultValue={socials.instagram || ""} placeholder="https://instagram.com/…" />
          </Field>
          <Field label="Twitter / X">
            <Input name="twitter" defaultValue={socials.twitter || ""} />
          </Field>
          <Field label="YouTube">
            <Input name="youtube" defaultValue={socials.youtube || ""} />
          </Field>
          <Field label="LinkedIn">
            <Input name="linkedin" defaultValue={socials.linkedin || ""} />
          </Field>
        </div>
      </Card>

      <SubmitButton>Save settings</SubmitButton>
    </form>
  );
}
