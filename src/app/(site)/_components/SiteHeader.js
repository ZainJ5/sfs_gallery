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
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteTitle} className="h-11 w-auto" />
          ) : (
            <span className="text-xl font-bold tracking-[0.2em] text-heading">
              SFS GALLERY
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`text-sm uppercase tracking-wide transition-colors ${
                isActive(i.href)
                  ? "font-medium text-heading"
                  : "text-body hover:text-heading"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <button
          className="text-heading md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <div className="flex flex-col px-4 py-2">
            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-sm uppercase tracking-wide ${
                  isActive(i.href) ? "font-medium text-heading" : "text-body"
                }`}
              >
                {i.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
