"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { requireAuth } from "@/lib/auth";

export async function setRead(id, read) {
  await requireAuth();
  await connectDB();
  await Message.findByIdAndUpdate(id, { read: !!read });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id) {
  await requireAuth();
  await connectDB();
  await Message.findByIdAndDelete(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
