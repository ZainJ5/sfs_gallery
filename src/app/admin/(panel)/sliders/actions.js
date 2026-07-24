"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";
import { requireAuth } from "@/lib/auth";

function parse(formData) {
  return {
    imageUrl: String(formData.get("imageUrl") || "").trim(),
    heading: String(formData.get("heading") || "").trim(),
    subheading: String(formData.get("subheading") || "").trim(),
    linkUrl: String(formData.get("linkUrl") || "").trim(),
    order: Number(formData.get("order") || 0),
    active: formData.get("active") === "true",
  };
}

export async function createSlider(prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.imageUrl) return { error: "An image is required." };
  try {
    await connectDB();
    await Slider.create(data);
  } catch (err) {
    return { error: err.message || "Could not create slider." };
  }
  revalidatePath("/admin/sliders");
  revalidatePath("/");
  redirect("/admin/sliders");
}

export async function updateSlider(id, prevState, formData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.imageUrl) return { error: "An image is required." };
  try {
    await connectDB();
    await Slider.findByIdAndUpdate(id, data);
  } catch (err) {
    return { error: err.message || "Could not update slider." };
  }
  revalidatePath("/admin/sliders");
  revalidatePath("/");
  redirect("/admin/sliders");
}

export async function deleteSlider(id) {
  await requireAuth();
  await connectDB();
  await Slider.findByIdAndDelete(id);
  revalidatePath("/admin/sliders");
  revalidatePath("/");
}
