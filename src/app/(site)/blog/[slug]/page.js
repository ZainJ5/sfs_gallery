import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { serialize } from "@/lib/serialize";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const p = await BlogPost.findOne({ slug }).select("title excerpt").lean();
  return { title: p ? p.title : "Post", description: p?.excerpt || undefined };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const doc = await BlogPost.findOne({ slug, published: true }).lean();
  if (!doc) notFound();
  const p = serialize(doc);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-bold uppercase text-heading sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-3 text-center text-xs uppercase tracking-wide text-body">
        {[p.author, fmtDate(p.publishedAt)].filter(Boolean).join(" · ")}
      </p>
      {p.coverUrl && (
        <div className="mt-8 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.coverUrl} alt={p.title} className="w-full object-cover" />
        </div>
      )}
      {p.body ? (
        <div
          className="prose-content mt-8 text-justify"
          dangerouslySetInnerHTML={{ __html: p.body }}
        />
      ) : (
        p.excerpt && <p className="prose-content mt-8">{p.excerpt}</p>
      )}
      <div className="mt-10">
        <Link
          href="/blog"
          className="text-sm uppercase tracking-wide text-gold hover:text-gold-dark"
        >
          ← Back to blog
        </Link>
      </div>
    </article>
  );
}
