import nextEnv from "@next/env";
import mongoose from "mongoose";

nextEnv.loadEnvConfig(process.cwd());

const BASE = "https://sfsgallery.com";

async function main() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sfs_gallery"
  );
  const col = mongoose.connection.collection("blogposts");

  const res = await fetch(`${BASE}/wp-json/wp/v2/posts?per_page=50&_embed`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const posts = await res.json();

  let updated = 0;
  for (const p of posts) {
    const terms = (p._embedded?.["wp:term"] || []).flat();
    const categories = [
      ...new Set(
        terms.filter((t) => t.taxonomy === "category").map((t) => t.name).filter(Boolean)
      ),
    ];
    const tags = [
      ...new Set(
        terms.filter((t) => t.taxonomy === "post_tag").map((t) => t.name).filter(Boolean)
      ),
    ];
    const r = await col.updateOne({ wpId: p.id }, { $set: { categories, tags } });
    if (r.matchedCount) updated++;
  }

  console.log(`WP posts fetched: ${posts.length} | updated: ${updated}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
