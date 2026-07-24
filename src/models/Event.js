import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    date: { type: Date },
    location: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    description: { type: String, default: "" }, // HTML
    gallery: { type: [String], default: [] },
    department: { type: String, default: "events" },
    published: { type: Boolean, default: true },
    wpSlug: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
