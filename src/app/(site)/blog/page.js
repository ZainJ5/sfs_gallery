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
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-heading sm:text-4xl">Blog</h1>
      {posts.length === 0 ? (
        <p className="mt-12 text-center text-body">No posts yet.</p>
      ) : (
        <div className="mt-12 space-y-10">
          {posts.map((p) => (
            <article key={p._id} className="border-b border-line pb-10 last:border-0">
              <h2 className="text-2xl font-semibold text-heading">
                <Link href={`/blog/${p.slug}`} className="hover:text-brand-dark">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-body">
                {[p.author, fmtDate(p.publishedAt)].filter(Boolean).join(" · ")}
              </p>
              {p.excerpt && <p className="mt-3 leading-7 text-body">{p.excerpt}</p>}
              <Link
                href={`/blog/${p.slug}`}
                className="mt-3 inline-block text-sm uppercase tracking-wide text-brand-dark hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
