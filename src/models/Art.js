import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, default: "", lowercase: true, trim: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
    artistName: { type: String, default: "" }, // denormalized for listing
    images: { type: [String], default: [] },
    price: { type: String, default: "" },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Art || mongoose.model("Art", ArtSchema);
