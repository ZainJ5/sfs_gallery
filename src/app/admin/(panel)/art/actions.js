"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Art from "@/models/Art";
import Artist from "@/models/Artist";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";

function parse(formData) {
  return {
    title: String(formData.get("title") || "").trim(),
    slugInput: String(formData.get("slug") || "").trim(),
    artist: String(formData.get("artist") || "") || null,
    price: String(formData.get("price") || "").trim(),
    medium: String(formData.get("medium") || "").trim(),
    dimensions: String(formData.get("dimensions") || "").trim(),
    description: String(formData.get("description") || ""),
    images: formData.getAll("images").map(String).filter(Boolean),
    featured: formData.get("featured") === "true",
    order: Number(formData.get("order") || 0),
    published: formData.get("published") === "true",
  };
}

async function withArtistName(data) {
  if (data.artist) {
    const a = await Artist.findById(data.artist).select("name").lean();
    data.artistName = a?.name || "";
  } else {
    data.artist = null;
    data.artistName = "";
  }
  return data;
}

export async function createArt(prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    data.slug = slugify(data.slugInput || data.title);
    await withArtistName(data);
    const { slugInput, ...rest } = data;
    await Art.create(rest);
  } catch (err) {
    return { error: err.message || "Could not create artwork." };
  }
  revalidatePath("/admin/art");
  revalidatePath("/artists");
  redirect("/admin/art");
}

export async function updateArt(id, prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    data.slug = slugify(data.slugInput || data.title);
    await withArtistName(data);
    const { slugInput, ...rest } = data;
    await Art.findByIdAndUpdate(id, rest);
  } catch (err) {
    return { error: err.message || "Could not update artwork." };
  }
  revalidatePath("/admin/art");
  revalidatePath("/artists");
  redirect("/admin/art");
}

export async function deleteArt(id) {
  await requireAuth();
  await connectDB();
  await Art.findByIdAndDelete(id);
  revalidatePath("/admin/art");
  revalidatePath("/artists");
}
