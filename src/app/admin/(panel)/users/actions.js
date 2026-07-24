"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import { requireAuth } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export async function saveUser(prevState, formData) {
  await requireAuth();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "admin");

  if (!name || !email) return { error: "Name and email are required." };

  try {
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      existing.name = name;
      existing.role = role;
      if (password) existing.passwordHash = await hashPassword(password);
      await existing.save();
    } else {
      if (!password) return { error: "A password is required for a new user." };
      await User.create({ name, email, role, passwordHash: await hashPassword(password) });
    }
  } catch (err) {
    return { error: err.message || "Could not save user." };
  }
  revalidatePath("/admin/users");
  return { ok: true, message: "User saved." };
}

export async function deleteUser(id) {
  await requireAuth();
  await connectDB();
  const count = await User.countDocuments();
  if (count <= 1) return; // never remove the last admin
  await User.findByIdAndDelete(id);
  revalidatePath("/admin/users");
}

export async function deleteSubscriber(id) {
  await requireAuth();
  await connectDB();
  await Subscriber.findByIdAndDelete(id);
  revalidatePath("/admin/users");
}
