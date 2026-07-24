import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_UPLOAD_BASE || "/uploads";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

/**
 * Persist an uploaded File to disk and return its public URL path.
 * @param {File} file  Web File (from request.formData()).
 * @param {string} subdir  Optional subfolder under the upload dir (e.g. "artists").
 */
export async function saveUpload(file, subdir = "") {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No file provided.");
  }
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Unsupported file type. Use JPG, PNG, WEBP, GIF, AVIF or SVG.");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) throw new Error("File too large (max 12 MB).");

  const safeSub = String(subdir).replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "");
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

  const destDir = path.join(process.cwd(), UPLOAD_DIR, safeSub);
  await mkdir(destDir, { recursive: true });
  await writeFile(path.join(destDir, filename), buffer);

  return [PUBLIC_BASE, safeSub, filename]
    .filter(Boolean)
    .join("/")
    .replace(/\/{2,}/g, "/");
}
