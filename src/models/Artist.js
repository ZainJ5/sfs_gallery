import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, default: "" }, // HTML
    photoUrl: { type: String, default: "" },
    department: { type: String, default: "artist" },
    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    wpSlug: { type: String, default: "" }, // original WordPress slug (import dedupe)
  },
  { timestamps: true }
);

export default mongoose.models.Artist || mongoose.model("Artist", ArtistSchema);
