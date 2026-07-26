import Link from "next/link";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { serialize } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function SidebarHeading({ children }) {
  return (
    <div className="mb-4">
      <span className="mb-2 block h-0.5 w-10 bg-gold" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-heading">
        {children}
      </h3>
    </div>
  );
}

export default async function BlogPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = String(sp.q || "").trim();
  const category = String(sp.category || "").trim();

  await connectDB();
  const filter = { published: true };
  if (category) filter.categories = new RegExp(`^${category}$`, "i");
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }, { body: rx }];
  }

  const [posts, recent, allCats] = await Promise.all([
    BlogPost.find(filter).sort({ publishedAt: -1 }).lean().then(serialize),
    BlogPost.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .select("title slug")
      .lean()
      .then(serialize),
    BlogPost.distinct("categories", { published: true }),
  ]);
  const categories = [...new Set(allCats.filter(Boolean))].sort();

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6">
      <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        Blog
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_270px]">
        {/* Post list */}
        <div>
          {(q || category) && (
            <p className="mb-8 text-center text-sm text-body">
              {posts.length} result{posts.length === 1 ? "" : "s"}
              {category ? ` in “${category}”` : ""}
              {q ? ` for “${q}”` : ""} ·{" "}
              <Link href="/blog" className="text-gold hover:underline">
                clear
              </Link>
            </p>
          )}
          {posts.length === 0 ? (
            <p className="text-center text-body">No posts found.</p>
          ) : (
            <div className="space-y-14">
              {posts.map((p) => (
                <article key={p._id} className="text-center">
                  <h2 className="text-2xl font-bold uppercase text-heading">
                    <Link href={`/blog/${p.slug}`} className="hover:text-gold">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-wide text-body">
                    {[
                      fmtDate(p.publishedAt),
                      "0 Comments",
                      p.categories?.length ? p.categories.join(", ") : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {p.coverUrl && (
                    <Link
                      href={`/blog/${p.slug}`}
                      className="mt-5 block overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.coverUrl}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full object-cover"
                      />
                    </Link>
                  )}
                  {p.excerpt && (
                    <p className="mx-auto mt-5 max-w-2xl leading-8 text-body">
                      {p.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${p.slug}`}
                    className="mt-4 inline-block text-sm uppercase tracking-wide text-gold hover:text-gold-dark"
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          <div>
            <SidebarHeading>Search</SidebarHeading>
            <form action="/blog" method="get" className="space-y-3">
              <input
                name="q"
                defaultValue={q}
                placeholder="Enter Keyword..."
                className="w-full border border-line px-3 py-2.5 text-sm text-heading outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="w-full bg-gold px-4 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-gold-dark"
              >
                Search
              </button>
            </form>
          </div>

          <div>
            <SidebarHeading>Recent Posts</SidebarHeading>
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r._id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-sm leading-snug text-body transition-colors hover:text-gold"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {categories.length > 0 && (
            <div>
              <SidebarHeading>Categories</SidebarHeading>
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(c)}`}
                      className="block border border-line px-4 py-2.5 text-center text-sm uppercase tracking-wide text-heading transition-colors hover:border-gold hover:text-gold"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
