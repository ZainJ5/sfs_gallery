import { Plus } from "lucide-react";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { serialize } from "@/lib/serialize";
import { PageHeader, ButtonLink } from "@/app/admin/_components/kit";
import DataTable from "@/app/admin/_components/DataTable";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

const columns = [
  { key: "title", label: "Post", type: "thumb", image: "coverUrl" },
  { key: "author", label: "Author", type: "text" },
  { key: "publishedAt", label: "Date", type: "date" },
  { key: "published", label: "Status", type: "bool", trueLabel: "Published", falseLabel: "Draft" },
];

export default async function BlogListPage() {
  await connectDB();
  const rows = serialize(await BlogPost.find().sort({ publishedAt: -1 }).lean());

  return (
    <div>
      <PageHeader
        title="All Blogs"
        subtitle={`${rows.length} post${rows.length === 1 ? "" : "s"}`}
        action={
          <ButtonLink href="/admin/blog/new">
            <Plus size={16} /> Add Blog
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        basePath="/admin/blog"
        deleteAction={deletePost}
        searchKeys={["title", "author"]}
        emptyLabel="No blog posts yet."
      />
    </div>
  );
}
