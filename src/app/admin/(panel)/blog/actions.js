"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base, fallback, excludeId = null) {
  let root = slugify(base || fallback) || "post";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await BlogPost.findOne(query).select("_id").lean();
    if (!exists) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

function parse(formData) {
  const dateStr = String(formData.get("publishedAt") || "").trim();
  return {
    title: String(formData.get("title") || "").trim(),
    slugInput: String(formData.get("slug") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    body: String(formData.get("body") || ""),
    coverUrl: String(formData.get("coverUrl") || "").trim(),
    author: String(formData.get("author") || "").trim(),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    publishedAt: dateStr ? new Date(dateStr) : new Date(),
    published: formData.get("published") === "true",
  };
}

export async function createPost(prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.title);
    await BlogPost.create(rest);
  } catch (err) {
    return { error: err.message || "Could not create post." };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updatePost(id, prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.title, id);
    await BlogPost.findByIdAndUpdate(id, rest);
  } catch (err) {
    return { error: err.message || "Could not update post." };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slugInput || slugify(data.title)}`);
  redirect("/admin/blog");
}

export async function deletePost(id) {
  await requireAuth();
  await connectDB();
  await BlogPost.findByIdAndDelete(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
