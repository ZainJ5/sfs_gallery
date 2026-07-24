import { MapPin, Phone, Mail } from "lucide-react";
import { getSettings } from "@/lib/settings";
import ContactForm from "../_components/ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-heading sm:text-4xl">
        Contact Us
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-body">
        We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon
        as we can.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-heading">Get in touch</h2>
          <div className="mt-4 space-y-3 text-body">
            {s.address && (
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" /> {s.address}
              </p>
            )}
            {s.phones?.office && (
              <p className="flex items-center gap-3">
                <Phone size={18} /> Office: {s.phones.office}
              </p>
            )}
            {s.phones?.direct && (
              <p className="flex items-center gap-3">
                <Phone size={18} /> Direct: {s.phones.direct}
              </p>
            )}
            {s.email && (
              <p className="flex items-center gap-3">
                <Mail size={18} />
                <a href={`mailto:${s.email}`} className="hover:text-heading">
                  {s.email}
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <ContactForm source="contact" />
        </div>
      </div>
    </div>
  );
}
