"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base, fallback, excludeId = null) {
  let root = slugify(base || fallback) || "event";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Event.findOne(query).select("_id").lean();
    if (!exists) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

function parse(formData) {
  const dateStr = String(formData.get("date") || "").trim();
  return {
    title: String(formData.get("title") || "").trim(),
    slugInput: String(formData.get("slug") || "").trim(),
    date: dateStr ? new Date(dateStr) : null,
    location: String(formData.get("location") || "").trim(),
    coverUrl: String(formData.get("coverUrl") || "").trim(),
    thumbnailUrl: String(formData.get("thumbnailUrl") || "").trim(),
    description: String(formData.get("description") || ""),
    gallery: formData.getAll("gallery").map(String).filter(Boolean),
    videos: String(formData.get("videos") || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    published: formData.get("published") === "true",
    department: "events",
  };
}

export async function createEvent(prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.title);
    await Event.create(rest);
  } catch (err) {
    return { error: err.message || "Could not create event." };
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEvent(id, prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title) return { error: "Title is required." };
  try {
    await connectDB();
    const { slugInput, ...rest } = data;
    rest.slug = await uniqueSlug(slugInput, data.title, id);
    await Event.findByIdAndUpdate(id, rest);
  } catch (err) {
    return { error: err.message || "Could not update event." };
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEvent(id) {
  await requireAuth();
  await connectDB();
  await Event.findByIdAndDelete(id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
