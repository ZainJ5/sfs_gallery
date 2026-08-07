import SocialIcon from "./SocialIcon";
import NewsletterFooter from "./NewsletterFooter";

export default function SiteFooter({ settings = {} }) {
  const socials = settings.socials || {};
  const phones = settings.phones || {};

  const socialLinks = [
    { href: socials.facebook, name: "facebook" },
    { href: socials.instagram, name: "instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-12 bg-white pb-12 pt-6 text-center">
      <h3 className="text-lg font-bold text-heading">San Francisco Street Gallery</h3>
      {settings.address && (
        <p className="mt-1.5 text-sm text-body">{settings.address}</p>
      )}
      <p className="mt-1 text-xs text-body">
        {phones.office && (
          <>
            <span className="font-semibold text-heading">O:</span> {phones.office}{" "}
            |{" "}
          </>
        )}
        {phones.direct && (
          <>
            <span className="font-semibold text-heading">D:</span> {phones.direct}{" "}
          </>
        )}
        {settings.email && (
          <>
            <span className="font-semibold text-heading">E:</span>{" "}
            <a href={`mailto:${settings.email}`} className="hover:text-gold">
              {settings.email}
            </a>{" "}
          </>
        )}
      </p>

      {socialLinks.length > 0 && (
        <div className="mt-4 flex justify-center gap-3">
          {socialLinks.map(({ href, name }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-heading text-white transition-colors hover:bg-gold"
            >
              <SocialIcon name={name} size={16} />
            </a>
          ))}
        </div>
      )}

      <NewsletterFooter />
    </footer>
  );
}
