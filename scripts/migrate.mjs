import nextEnv from "@next/env";
import mongoose from "mongoose";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import Artist from "../src/models/Artist.js";
import Art from "../src/models/Art.js";
import Event from "../src/models/Event.js";
import BlogPost from "../src/models/BlogPost.js";
import Slider from "../src/models/Slider.js";
import Setting from "../src/models/Setting.js";

nextEnv.loadEnvConfig(process.cwd());

const BASE = "https://sfsgallery.com";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_UPLOAD_BASE || "/uploads";
const DRY = process.argv.includes("--dry");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; SFSMigrate/1.0)" };
const BAD_IMG = /(Logo\.png|\/fv\.png|slider\d+)/i;
const SKIP_SLUGS = new Set(["test", "event-1"]);

const imageCache = new Map();

function norm(u) {
  if (!u) return "";
  return u.startsWith("//") ? "https:" + u : u;
}

async function fetchText(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (err) {
      if (attempt === 2) throw err;
    }
  }
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

function stripDecode(html) {
  return cheerio.load(`<x>${html || ""}</x>`).root().text().replace(/\s+/g, " ").trim();
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function downloadImage(srcUrl, subdir) {
  const url = norm(srcUrl);
  if (!url) return "";
  if (imageCache.has(url)) return imageCache.get(url);
  if (DRY) return "(dry)";
  try {
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const pathname = new URL(url).pathname;
    let ext = (path.extname(pathname) || ".jpg").toLowerCase();
    if (!/\.(jpe?g|png|webp|gif|avif)$/.test(ext)) ext = ".jpg";
    const base = path
      .basename(pathname, path.extname(pathname))
      .replace(/[^a-z0-9_-]/gi, "")
      .slice(0, 40);
    const name = `${base || "img"}-${crypto.createHash("md5").update(url).digest("hex").slice(0, 8)}${ext}`;
    const destDir = path.join(process.cwd(), UPLOAD_DIR, subdir);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(path.join(destDir, name), buf);
    const publicUrl = `${PUBLIC_BASE}/${subdir}/${name}`.replace(/\/{2,}/g, "/");
    imageCache.set(url, publicUrl);
    return publicUrl;
  } catch (err) {
    console.warn("    ! image failed:", url, "-", err.message);
    return "";
  }
}

function nameFromTitle($, slug) {
  let t = ($("title").text() || "").trim();
  t = t.replace(/\s*[–—|-]\s*SFS Gallery\s*$/i, "").trim();
  if (!t) t = $(".elementor-widget-heading .elementor-heading-title").first().text().trim();
  if (!t) t = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return t;
}

function extractParagraphs($) {
  const scope = $(".entry-content").first().clone();
  scope.find("script, style, noscript, img, form").remove();
  scope.find('[class*="modal"], [class*="inquire"], [id*="modal"]').remove();
  scope.find(".elementor-widget-heading, .elementor-widget-button, nav").remove();
  scope.find('a[href*="/uploads/"]').remove();
  const paras = [];
  scope.find("p").each((i, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t.length > 30 && !/Powered by Dodstech/i.test(t)) paras.push(t);
  });
  return paras;
}

function collectImages(root, $) {
  const seen = new Set();
  const out = [];
  root.find('a[href*="/uploads/"]').each((i, el) => {
    const h = $(el).attr("href") || "";
    if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(h) && !BAD_IMG.test(h)) {
      const u = norm(h);
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
  });
  if (out.length === 0) {
    root.find("img").each((i, el) => {
      let s = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src") || "";
      if (!s.includes("/uploads/") || BAD_IMG.test(s)) return;
      s = s.replace(/-\d+x\d+(\.(jpe?g|png|webp|gif))/i, "$1");
      const u = norm(s);
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    });
  }
  return out;
}

function mainImage($) {
  const og = $('meta[property="og:image"]').attr("content");
  if (og && !BAD_IMG.test(og)) return norm(og);
  let found = "";
  $(".entry-content img, img").each((i, el) => {
    if (found) return;
    let s = $(el).attr("src") || $(el).attr("data-src") || "";
    if (s.includes("/uploads/") && !BAD_IMG.test(s)) {
      found = norm(s.replace(/-\d+x\d+(\.(jpe?g|png|webp|gif))/i, "$1"));
    }
  });
  return found;
}

function extractSlugs(html) {
  const $ = cheerio.load(html);
  const set = new Set();
  $('a[href*="/portfolio/"]').each((i, el) => {
    const m = ($(el).attr("href") || "").match(/\/portfolio\/([^/?#]+)\/?/);
    if (m && !SKIP_SLUGS.has(m[1])) set.add(m[1]);
  });
  return [...set];
}

async function mapPool(items, limit, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        await fn(items[idx], idx);
      } catch (err) {
        console.warn("  ! failed:", items[idx], "-", err.message);
      }
    }
  });
  await Promise.all(workers);
}

async function migrateArtists(slugs) {
  let order = 0;
  await mapPool(slugs, 4, async (slug) => {
    const $ = cheerio.load(await fetchText(`${BASE}/portfolio/${slug}/`));
    const name = nameFromTitle($, slug);
    const paras = extractParagraphs($);
    const bio = paras.map((p) => `<p>${esc(p)}</p>`).join("\n");
    let gallery = collectImages($(".entry-content").first(), $);
    if (gallery.length === 0) {
      const m = mainImage($);
      if (m) gallery = [m];
    }
    console.log(`  artist ${slug}: "${name}" bio=${paras.length}p gallery=${gallery.length}`);
    if (paras.length === 0 && gallery.length === 0) {
      console.log(`    (skipped — empty)`);
      return;
    }
    if (DRY) return;

    const localGallery = [];
    for (const g of gallery) {
      const l = await downloadImage(g, `artists/${slug}`);
      if (l) localGallery.push(l);
    }
    const doc = await Artist.findOneAndUpdate(
      { slug },
      {
        $set: {
          name,
          slug,
          bio,
          photoUrl: localGallery[0] || "",
          department: "artist",
          published: true,
          wpSlug: slug,
          order: order++,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await Art.deleteMany({ artist: doc._id });
    let n = 0;
    for (const img of localGallery) {
      n += 1;
      await Art.create({
        title: `${name} — ${n}`,
        slug: `${slug}-${n}`,
        artist: doc._id,
        artistName: name,
        images: [img],
        published: true,
        order: n,
      });
    }
  });
}

async function migrateEvents(slugs) {
  await mapPool(slugs, 4, async (slug) => {
    const $ = cheerio.load(await fetchText(`${BASE}/portfolio/${slug}/`));
    const title = nameFromTitle($, slug);
    const paras = extractParagraphs($);
    const description = paras.map((p) => `<p>${esc(p)}</p>`).join("\n");
    let gallery = collectImages($(".entry-content").first(), $);
    const cover = gallery[0] || mainImage($);
    if (gallery.length === 0 && cover) gallery = [cover];
    console.log(`  event ${slug}: "${title}" desc=${paras.length}p gallery=${gallery.length}`);
    if (DRY) return;

    const localGallery = [];
    for (const g of gallery) {
      const l = await downloadImage(g, `events/${slug}`);
      if (l) localGallery.push(l);
    }
    await Event.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          slug,
          description,
          coverUrl: localGallery[0] || "",
          gallery: localGallery,
          department: "events",
          published: true,
          wpSlug: slug,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  });
}

async function migrateBlog() {
  let posts = [];
  try {
    posts = await fetchJson(`${BASE}/wp-json/wp/v2/posts?per_page=50&_embed`);
  } catch (err) {
    console.warn("  ! blog fetch failed:", err.message);
    return;
  }
  let kept = 0;
  for (const p of posts) {
    const title = stripDecode(p.title?.rendered || "");
    const author = p._embedded?.author?.[0]?.name || "";
    const authorSlug = p._embedded?.author?.[0]?.slug || "";
    const spam =
      /casino|pin.?up|kazino|казино|слот|\bslot\b|bahis|bonus|betting/i.test(title) ||
      /hex\d+/i.test(authorSlug) ||
      /hex\d+/i.test(author);
    if (spam) {
      console.log("  skip spam:", title.slice(0, 45));
      continue;
    }
    const slug = p.slug;
    const excerpt = stripDecode(p.excerpt?.rendered || "").slice(0, 300);
    const body = p.content?.rendered || "";
    const featured = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
    console.log(`  blog ${slug}: "${title.slice(0, 45)}" by ${author || "?"} img=${featured ? "y" : "n"}`);
    kept += 1;
    if (DRY) continue;

    const coverUrl = featured ? await downloadImage(featured, "blog") : "";
    await BlogPost.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          slug,
          excerpt,
          body,
          coverUrl,
          author,
          publishedAt: new Date(p.date || Date.now()),
          published: true,
          wpId: p.id,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
  console.log("Blog kept:", kept);
}

async function migrateSlidersAndLogo() {
  // Logo
  const logo = await downloadImage(`${BASE}/wp-content/uploads/2026/06/Logo.png`, "settings");
  if (!DRY && logo) {
    await Setting.findOneAndUpdate(
      { key: "global" },
      { $set: { logoUrl: logo }, $setOnInsert: { key: "global" } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
  console.log("Logo:", logo);

  // Sliders (Smart Slider 3 images slider1..9)
  const home = await fetchText(`${BASE}/`);
  const matches = [
    ...home.matchAll(
      /(?:https:)?\/\/sfsgallery\.com\/wp-content\/uploads\/[^"'\\ )]*slider\d+[^"'\\ )]*\.(?:jpg|jpeg|png|webp)/gi
    ),
  ].map((m) => norm(m[0]));
  const sliderUrls = [...new Set(matches)].sort((a, b) => {
    const na = +(a.match(/slider(\d+)/i)?.[1] || 0);
    const nb = +(b.match(/slider(\d+)/i)?.[1] || 0);
    return na - nb;
  });
  console.log("Slider images found:", sliderUrls.length);
  if (DRY) return;
  if (sliderUrls.length > 0) {
    await Slider.deleteMany({});
    let order = 0;
    for (const u of sliderUrls) {
      const local = await downloadImage(u, "sliders");
      if (local) await Slider.create({ imageUrl: local, order: order++, active: true });
    }
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sfs_gallery");
  console.log(`\n=== SFS Gallery migration ${DRY ? "(DRY RUN)" : ""} ===\n`);

  console.log("» Sliders & logo");
  await migrateSlidersAndLogo();

  console.log("\n» Classifying portfolio items");
  const artistSlugs = extractSlugs(await fetchText(`${BASE}/department/artist/`));
  const eventSlugs = extractSlugs(await fetchText(`${BASE}/department/events/`));
  console.log(`  ${artistSlugs.length} artists, ${eventSlugs.length} events`);

  console.log("\n» Artists");
  await migrateArtists(artistSlugs);

  console.log("\n» Events");
  await migrateEvents(eventSlugs);

  console.log("\n» Blog");
  await migrateBlog();

  const [artists, arts, events, blog, sliders] = await Promise.all([
    Artist.countDocuments(),
    Art.countDocuments(),
    Event.countDocuments(),
    BlogPost.countDocuments(),
    Slider.countDocuments(),
  ]);
  console.log(
    `\n=== Done. DB now has: ${artists} artists, ${arts} arts, ${events} events, ${blog} blog posts, ${sliders} sliders ===`
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
