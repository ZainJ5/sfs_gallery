import Link from "next/link";
import { Palette, Image as ImageIcon, CalendarDays, FileText, GalleryHorizontalEnd, Mail, UsersRound, MailWarning } from "lucide-react";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import Event from "@/models/Event";
import BlogPost from "@/models/BlogPost";
import Slider from "@/models/Slider";
import Message from "@/models/Message";
import Subscriber from "@/models/Subscriber";
import { serialize } from "@/lib/serialize";
import { PageHeader, StatCard, Card, Badge, EmptyState } from "@/app/admin/_components/kit";
import DashboardChart from "@/app/admin/_components/DashboardChart";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  let stats = {
    artists: 0,
    arts: 0,
    events: 0,
    posts: 0,
    sliders: 0,
    messages: 0,
    unread: 0,
    subscribers: 0,
  };
  let recentMessages = [];
  let recentSubs = [];
  let dbError = false;

  try {
    await connectDB();
    const [artists, arts, events, posts, sliders, messages, unread, subscribers] =
      await Promise.all([
        Artist.countDocuments(),
        Art.countDocuments(),
        Event.countDocuments(),
        BlogPost.countDocuments(),
        Slider.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
        Subscriber.countDocuments(),
      ]);
    stats = { artists, arts, events, posts, sliders, messages, unread, subscribers };
    recentMessages = serialize(
      await Message.find().sort({ createdAt: -1 }).limit(6).lean()
    );
    recentSubs = serialize(
      await Subscriber.find().sort({ createdAt: -1 }).limit(6).lean()
    );
  } catch {
    dbError = true;
  }

  const chartData = [
    { name: "Artists", count: stats.artists },
    { name: "Art", count: stats.arts },
    { name: "Events", count: stats.events },
    { name: "Blog", count: stats.posts },
    { name: "Sliders", count: stats.sliders },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Overview of your gallery content and engagement."
      />

      {dbError && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not connect to the database. Check <code>MONGODB_URI</code> in your
          environment.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Artists" value={stats.artists} icon={Palette} href="/admin/artists" />
        <StatCard label="Artworks" value={stats.arts} icon={ImageIcon} href="/admin/art" />
        <StatCard label="Events" value={stats.events} icon={CalendarDays} href="/admin/events" />
        <StatCard label="Blog Posts" value={stats.posts} icon={FileText} href="/admin/blog" />
        <StatCard label="Sliders" value={stats.sliders} icon={GalleryHorizontalEnd} href="/admin/sliders" />
        <StatCard label="Messages" value={stats.messages} icon={Mail} href="/admin/messages" />
        <StatCard label="Unread" value={stats.unread} icon={MailWarning} href="/admin/messages" />
        <StatCard label="Subscribers" value={stats.subscribers} icon={UsersRound} href="/admin/users" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
            Content overview
          </h2>
          <DashboardChart data={chartData} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-body">
              Recent messages
            </h2>
            <Link href="/admin/messages" className="text-xs text-brand-dark hover:underline">
              View all
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-body">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentMessages.map((m) => (
                <li key={m._id} className="border-b border-line pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-heading">
                      {m.name}
                    </span>
                    {!m.read && <Badge tone="amber">New</Badge>}
                  </div>
                  <p className="truncate text-xs text-body">{m.subject || m.body}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{fmtDate(m.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-body">
              Recent subscribers
            </h2>
            <Link href="/admin/users" className="text-xs text-brand-dark hover:underline">
              View all
            </Link>
          </div>
          {recentSubs.length === 0 ? (
            <p className="text-sm text-body">No subscribers yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentSubs.map((s) => (
                <span
                  key={s._id}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                >
                  {s.email}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
