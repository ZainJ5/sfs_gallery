import PDFDocument from "pdfkit";
import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_UPLOAD_BASE || "/uploads";

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "...", mdash: "-", ndash: "-", rsquo: "'", lsquo: "'",
  ldquo: '"', rdquo: '"', eacute: "é", ntilde: "ñ",
};

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => {
      const k = name.toLowerCase();
      return k in ENTITIES ? ENTITIES[k] : m;
    });
}

/** Turn stored bio HTML into readable plain text with paragraph breaks. */
function htmlToText(html) {
  if (!html) return "";
  let t = String(html);
  t = t.replace(/<\s*br\s*\/?>/gi, "\n");
  t = t.replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n\n");
  t = t.replace(/<[^>]+>/g, "");
  t = decodeEntities(t);
  return t
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Standard PDF fonts (Helvetica) use WinAnsi / Latin-1 encoding. Normalize the
 * fancy punctuation that shows up in migrated WordPress content to ASCII and
 * drop anything outside Latin-1 so pdfkit never throws on an unmappable glyph.
 */
function pdfSafe(v) {
  return String(v ?? "")
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "");
}

/** Resolve an image URL (local /uploads path or remote) to a JPEG buffer pdfkit can embed. */
async function loadImageJpeg(url) {
  try {
    let input;
    if (/^https?:\/\//i.test(url)) {
      const res = await fetch(url);
      if (!res.ok) return null;
      input = Buffer.from(await res.arrayBuffer());
    } else {
      const diskPath = url.startsWith(PUBLIC_BASE)
        ? path.join(process.cwd(), UPLOAD_DIR, url.slice(PUBLIC_BASE.length))
        : path.join(process.cwd(), "public", url.replace(/^\/+/, ""));
      input = await readFile(diskPath);
    }
    // pdfkit only embeds JPEG/PNG — normalize everything (webp, avif, png…) to JPEG.
    return await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();
  } catch {
    return null; // missing/unreadable image — the row still renders with a placeholder
  }
}

/**
 * Build a one-file "artist information sheet" PDF: name, bio, and every artwork
 * with its image thumbnail and Title / Size / Medium / Price.
 * @returns {Promise<Buffer>}
 */
export async function buildArtistPdf(artist, arts = []) {
  const list = Array.isArray(arts) ? arts : [];
  // Preload images (some may be remote fetches) before we start streaming the doc.
  const imgs = await Promise.all(
    list.map((a) => (a.images?.[0] ? loadImageJpeg(a.images[0]) : Promise.resolve(null)))
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: `${pdfSafe(artist.name)} - Artist Information`,
      Author: "San Francisco Street Gallery",
    },
  });

  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise((resolve, reject) => {
    doc.on("end", resolve);
    doc.on("error", reject);
  });

  const M = 50; // matches the `margin` option above (doc.page.margins is an object, not a scalar)
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const contentW = pageW - M * 2;

  // Header
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#111111")
    .text(pdfSafe(artist.name).toUpperCase(), { align: "center" });
  doc.moveDown(0.25);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#8a6d3b")
    .text("SAN FRANCISCO STREET GALLERY", { align: "center", characterSpacing: 1 });
  doc.moveDown(1.2);

  // Bio
  const bio = htmlToText(artist.bio);
  if (bio) {
    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor("#333333")
      .text(pdfSafe(bio), { align: "left", lineGap: 2 });
    doc.moveDown(1);
  }

  // Works
  if (list.length) {
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#111111").text(`Works (${list.length})`);
    doc.moveDown(0.4);
    doc.moveTo(M, doc.y).lineTo(pageW - M, doc.y).strokeColor("#dddddd").lineWidth(1).stroke();
    doc.moveDown(0.6);
  }

  const imgW = 150;
  const rowMinH = 150;
  const gap = 18;

  for (let i = 0; i < list.length; i++) {
    const art = list[i];
    const imgBuf = imgs[i];

    if (doc.y + rowMinH > pageH - M) doc.addPage();
    const top = doc.y;

    if (imgBuf) {
      try {
        doc.image(imgBuf, M, top, { fit: [imgW, rowMinH], align: "center", valign: "top" });
      } catch {
        /* corrupt image — leave the space blank */
      }
    } else {
      doc.save().rect(M, top, imgW, rowMinH).fill("#f2f2f2").restore();
      doc
        .fillColor("#aaaaaa")
        .font("Helvetica")
        .fontSize(8)
        .text("No image", M, top + rowMinH / 2 - 4, { width: imgW, align: "center" });
    }

    const tx = M + imgW + gap;
    const tw = contentW - imgW - gap;
    let ty = top;

    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111111").text(pdfSafe(art.title || "Untitled"), tx, ty, { width: tw });
    ty = doc.y + 6;

    const rows = [
      ["Size", art.dimensions],
      ["Medium", art.medium],
      ["Price", art.price],
    ];
    for (const [label, val] of rows) {
      if (!val) continue;
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#555555").text(`${label}:  `, tx, ty, { width: tw, continued: true });
      doc.font("Helvetica").fillColor("#222222").text(pdfSafe(val));
      ty = doc.y + 4;
    }

    doc.y = Math.max(top + rowMinH, ty) + 16;
    if (i < list.length - 1) {
      doc.moveTo(M, doc.y - 8).lineTo(pageW - M, doc.y - 8).strokeColor("#eeeeee").lineWidth(1).stroke();
    }
  }

  doc.end();
  await done;
  return Buffer.concat(chunks);
}

export default buildArtistPdf;
