"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Palette,
  Image as ImageIcon,
  CalendarDays,
  FileText,
  GalleryHorizontalEnd,
  Mail,
  UsersRound,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { label: "Analytics", href: "/admin", icon: BarChart3 },
  {
    label: "Artists",
    icon: Palette,
    children: [
      { label: "All Artists", href: "/admin/artists" },
      { label: "Add Artist", href: "/admin/artists/new" },
    ],
  },
  {
    label: "Art",
    icon: ImageIcon,
    children: [
      { label: "All Arts", href: "/admin/art" },
      { label: "Add Art", href: "/admin/art/new" },
    ],
  },
  {
    label: "Events",
    icon: CalendarDays,
    children: [
      { label: "All Events", href: "/admin/events" },
      { label: "Add Event", href: "/admin/events/new" },
    ],
  },
  {
    label: "Blog",
    icon: FileText,
    children: [
      { label: "All Blogs", href: "/admin/blog" },
      { label: "Add Blog", href: "/admin/blog/new" },
    ],
  },
  {
    label: "Sliders",
    icon: GalleryHorizontalEnd,
    children: [
      { label: "All Sliders", href: "/admin/sliders" },
      { label: "Add Slider", href: "/admin/sliders/new" },
    ],
  },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "User Data", href: "/admin/users", icon: UsersRound },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isLinkActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  if (href.endsWith("/new")) return pathname === href;
  return (
    pathname === href ||
    (pathname.startsWith(href + "/") && !pathname.endsWith("/new"))
  );
}

function groupHasActive(pathname, group) {
  return group.children?.some((c) => isLinkActive(pathname, c.href));
}

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    for (const item of NAV) {
      if (item.children) init[item.label] = groupHasActive(pathname, item);
    }
    return init;
  });

  function toggleGroup(label) {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const panel = (
    <div className="flex h-full flex-col bg-[#141414] text-zinc-300">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="block" onClick={() => setMobileOpen(false)}>
          <span className="text-lg font-bold tracking-[0.2em] text-white">
            SFS GALLERY
          </span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-widest text-zinc-500">
            Admin Portal
          </span>
        </Link>
        <button
          className="lg:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          if (!item.children) {
            const active = isLinkActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          }
          const open = openGroups[item.label];
          const groupActive = groupHasActive(pathname, item);
          return (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  groupActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="mb-1 ml-4 space-y-1 border-l border-white/10 pl-3">
                  {item.children.map((child) => {
                    const active = isLinkActive(pathname, child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} /> View site
        </a>
        <div className="rounded-md px-3 py-2">
          <p className="truncate text-sm font-medium text-white">
            {user?.name || "Admin"}
          </p>
          <p className="truncate text-xs text-zinc-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-[#141414] px-4 py-3 text-white lg:hidden">
        <span className="text-base font-bold tracking-[0.2em]">SFS GALLERY</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{panel}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">{panel}</div>
        </div>
      )}
    </>
  );
}
