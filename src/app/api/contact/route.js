import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    await connectDB();
    await Message.create({
      name,
      email,
      phone: String(body.phone || "").trim(),
      subject: String(body.subject || "").trim(),
      body: String(body.message ?? body.body ?? "").trim(),
      source: String(body.source || "contact"),
      artistName: String(body.artistName || "").trim(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }
}
