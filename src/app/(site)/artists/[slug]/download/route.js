import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Art from "@/models/Art";
import { buildArtistPdf } from "@/lib/artistPdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function asciiFilename(s) {
  const base = String(s || "artist")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${base || "artist"}-info.pdf`;
}

export async function GET(_request, { params }) {
  const { slug } = await params;
  await connectDB();

  const artist = await Artist.findOne({ slug, published: true }).lean();
  if (!artist) return new Response("Artist not found", { status: 404 });

  const arts = await Art.find({ artist: artist._id, published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  try {
    const pdf = await buildArtistPdf(artist, arts);
    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFilename(artist.slug || artist.name)}"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("artist PDF generation failed:", err);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
