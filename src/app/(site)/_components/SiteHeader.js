"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Artists", href: "/artists" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader({ logoUrl, siteTitle }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white">
      {/* Centered logo lockup */}
      <div className="px-4 pt-8 pb-3 text-center">
        <Link href="/" className="inline-block" onClick={() => setOpen(false)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={siteTitle || "San Francisco Street Art Gallery"}
              className="mx-auto h-16 w-auto sm:h-20"
            />
          ) : (
            <span className="text-2xl font-bold tracking-[0.15em] text-heading">
              SFS GALLERY
            </span>
          )}
        </Link>
      </div>

      {/* Centered desktop nav */}
      <nav className="hidden md:block pb-5">
        <ul className="flex items-center justify-center gap-9">
          {NAV.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`text-sm uppercase tracking-[0.08em] transition-colors ${
                  isActive(i.href)
                    ? "text-gold"
                    : "text-heading hover:text-gold"
                }`}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile toggle */}
      <div className="pb-3 text-center md:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 text-heading"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line md:hidden">
          <ul className="flex flex-col items-center py-2">
            {NAV.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-sm uppercase tracking-[0.08em] ${
                    isActive(i.href) ? "text-gold" : "text-heading"
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
