import { requireAuth } from "@/lib/auth";
import Sidebar from "@/app/admin/_components/Sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · SFS Gallery",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }) {
  const session = await requireAuth();
  const user = { name: session.name || "Administrator", email: session.email || "" };

  return (
    <div className="min-h-screen bg-zinc-100 text-heading">
      <Sidebar user={user} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
