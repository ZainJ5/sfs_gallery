"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { requireAuth } from "@/lib/auth";

export async function saveSettings(prevState, formData) {
  await requireAuth();

  const data = {
    logoUrl: String(formData.get("logoUrl") || "").trim(),
    siteTitle: String(formData.get("siteTitle") || "").trim(),
    metaKeywords: String(formData.get("metaKeywords") || "").trim(),
    metaDescription: String(formData.get("metaDescription") || "").trim(),
    pixelCode: String(formData.get("pixelCode") || ""),
    gaCode: String(formData.get("gaCode") || ""),
    address: String(formData.get("address") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phones: {
      office: String(formData.get("phoneOffice") || "").trim(),
      direct: String(formData.get("phoneDirect") || "").trim(),
    },
    socials: {
      facebook: String(formData.get("facebook") || "").trim(),
      instagram: String(formData.get("instagram") || "").trim(),
      twitter: String(formData.get("twitter") || "").trim(),
      youtube: String(formData.get("youtube") || "").trim(),
      linkedin: String(formData.get("linkedin") || "").trim(),
    },
  };

  try {
    await connectDB();
    await Setting.findOneAndUpdate(
      { key: "global" },
      { $set: data, $setOnInsert: { key: "global" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    return { error: err.message || "Could not save settings." };
  }

  // Settings feed the header, footer and <head> across the whole site.
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
