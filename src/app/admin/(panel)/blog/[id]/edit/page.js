import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import PostForm from "../../PostForm";
import { updatePost, deletePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  await connectDB();

  let doc = null;
  try {
    doc = await BlogPost.findById(id).lean();
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const initial = serialize(doc);

  return (
    <div>
      <PageHeader
        title="Edit Blog"
        subtitle={initial.title}
        action={<DeleteButton action={deletePost} id={id} redirectAfter="/admin/blog" />}
      />
      <PostForm action={updatePost.bind(null, id)} initial={initial} />
    </div>
  );
}
