import { MapPin, Phone, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import SocialIcon from "./SocialIcon";

export default function SiteFooter({ settings = {} }) {
  const socials = settings.socials || {};
  const phones = settings.phones || {};
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: socials.facebook, name: "facebook" },
    { href: socials.instagram, name: "instagram" },
    { href: socials.twitter, name: "twitter" },
    { href: socials.youtube, name: "youtube" },
    { href: socials.linkedin, name: "linkedin" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-20 border-t border-line bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold tracking-[0.2em] text-heading">
            SFS GALLERY
          </h3>
          <div className="mt-4 space-y-2 text-sm text-body">
            {settings.address && (
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                {settings.address}
              </p>
            )}
            {phones.office && (
              <p className="flex items-center gap-2">
                <Phone size={16} /> Office: {phones.office}
              </p>
            )}
            {phones.direct && (
              <p className="flex items-center gap-2">
                <Phone size={16} /> Direct: {phones.direct}
              </p>
            )}
            {settings.email && (
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${settings.email}`} className="hover:text-heading">
                  {settings.email}
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-heading">
            Join our mailing list
          </h4>
          <p className="mt-3 text-sm text-body">
            Be the first to hear about new works and upcoming events.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-heading">
            Follow us
          </h4>
          <div className="mt-4 flex gap-3">
            {socialLinks.length === 0 ? (
              <span className="text-sm text-body">—</span>
            ) : (
              socialLinks.map(({ href, name }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition-colors hover:border-heading hover:text-heading"
                >
                  <SocialIcon name={name} size={16} />
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-body">
        © {year} San Francisco Street Gallery. All rights reserved.
      </div>
    </footer>
  );
}
