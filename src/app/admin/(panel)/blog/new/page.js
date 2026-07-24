import { PageHeader } from "@/app/admin/_components/kit";
import PostForm from "../PostForm";
import { createPost } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="Add Blog" subtitle="Write a new blog post." />
      <PostForm action={createPost} />
    </div>
  );
}
