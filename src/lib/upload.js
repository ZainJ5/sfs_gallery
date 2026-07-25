import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

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

const MAX_BYTES = 15 * 1024 * 1024; // accept up to 15 MB in (output is compressed)
const MAX_DIMENSION = 1920; // downscale very large images

/**
 * Persist an uploaded File to disk, compressed/optimized with sharp, and
 * return its public URL path.
 * @param {File} file  Web File (from request.formData()).
 * @param {string} subdir  Optional subfolder under the upload dir (e.g. "artists").
 */
export async function saveUpload(file, subdir = "") {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No file provided.");
  }
  const inputExt = ALLOWED[file.type];
  if (!inputExt) {
    throw new Error("Unsupported file type. Use JPG, PNG, WEBP, GIF, AVIF or SVG.");
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  if (inputBuffer.length > MAX_BYTES) throw new Error("File too large (max 15 MB).");

  // Optimize raster images. Leave SVG (vector) and GIF (possibly animated) untouched.
  let outBuffer = inputBuffer;
  let ext = inputExt;

  if (inputExt !== "svg" && inputExt !== "gif") {
    try {
      let img = sharp(inputBuffer, { failOn: "none" }).rotate(); // honor EXIF orientation
      const meta = await img.metadata();
      if (meta.width && meta.width > MAX_DIMENSION) {
        img = img.resize({ width: MAX_DIMENSION, withoutEnlargement: true });
      }
      if (inputExt === "png") {
        outBuffer = await img.png({ compressionLevel: 9 }).toBuffer();
        ext = "png";
      } else if (inputExt === "webp") {
        outBuffer = await img.webp({ quality: 80 }).toBuffer();
        ext = "webp";
      } else if (inputExt === "avif") {
        outBuffer = await img.avif({ quality: 55 }).toBuffer();
        ext = "avif";
      } else {
        outBuffer = await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        ext = "jpg";
      }
      // If optimization somehow grew the file, keep the smaller original.
      if (outBuffer.length >= inputBuffer.length) {
        outBuffer = inputBuffer;
        ext = inputExt;
      }
    } catch {
      outBuffer = inputBuffer; // fall back to the original on any sharp error
      ext = inputExt;
    }
  }

  const safeSub = String(subdir).replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "");
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

  const destDir = path.join(process.cwd(), UPLOAD_DIR, safeSub);
  await mkdir(destDir, { recursive: true });
  await writeFile(path.join(destDir, filename), outBuffer);

  return [PUBLIC_BASE, safeSub, filename]
    .filter(Boolean)
    .join("/")
    .replace(/\/{2,}/g, "/");
}
