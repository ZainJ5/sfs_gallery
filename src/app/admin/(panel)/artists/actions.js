"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base, fallback, excludeId = null) {
  let root = slugify(base || fallback) || "artist";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Artist.findOne(query).select("_id").lean();
    if (!exists) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

function parse(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    slugInput: String(formData.get("slug") || "").trim(),
    bio: String(formData.get("bio") || ""),
    photoUrl: String(formData.get("photoUrl") || ""),
    socials: {
      facebook: String(formData.get("facebook") || "").trim(),
      instagram: String(formData.get("instagram") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    },
    order: Number(formData.get("order") || 0),
    published: formData.get("published") === "true",
    department: "artist",
  };
}

export async function createArtist(prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return { error: "Name is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.name);
    await Artist.create(rest);
  } catch (err) {
    return { error: err.message || "Could not create artist." };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function updateArtist(id, prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return { error: "Name is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.name, id);
    await Artist.findByIdAndUpdate(id, rest);
  } catch (err) {
    return { error: err.message || "Could not update artist." };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function deleteArtist(id) {
  await requireAuth();
  await connectDB();
  await Artist.findByIdAndDelete(id);
  // Also remove that artist's artworks.
  await Art.deleteMany({ artist: id });
  revalidatePath("/admin/artists");
  revalidatePath("/admin/art");
  revalidatePath("/artists");
}
