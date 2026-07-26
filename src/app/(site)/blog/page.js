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

export default async function BlogPage() {
  await connectDB();
  const posts = serialize(
    await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).lean()
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        Blog
      </h1>
      {posts.length === 0 ? (
        <p className="text-center text-body">No posts yet.</p>
      ) : (
        <div className="space-y-16">
          {posts.map((p) => (
            <article key={p._id} className="text-center">
              <h2 className="text-2xl font-bold uppercase text-heading">
                <Link href={`/blog/${p.slug}`} className="hover:text-gold">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-xs uppercase tracking-wide text-body">
                {[
                  p.author,
                  fmtDate(p.publishedAt),
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
                    className="mx-auto max-h-[480px] w-full object-cover"
                  />
                </Link>
              )}
              {p.excerpt && (
                <p className="mx-auto mt-5 max-w-3xl leading-8 text-body">
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
  );
}
