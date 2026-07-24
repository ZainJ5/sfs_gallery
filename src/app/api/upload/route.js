import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    const subdir = String(form.get("subdir") || "");
    const url = await saveUpload(file, subdir);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Upload failed." },
      { status: 400 }
    );
  }
}
