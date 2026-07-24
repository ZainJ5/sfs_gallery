import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" }, // HTML
    coverUrl: { type: String, default: "" },
    author: { type: String, default: "" },
    tags: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
    wpId: { type: Number }, // original WordPress post id (import dedupe)
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
