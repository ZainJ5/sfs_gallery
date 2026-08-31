import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    date: { type: Date },
    location: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" }, // pre-cropped image for the events grid
    description: { type: String, default: "" }, // HTML
    gallery: { type: [String], default: [] },
    videos: { type: [String], default: [] }, // YouTube links, embedded on the event page
    department: { type: String, default: "events" },
    published: { type: Boolean, default: true },
    wpSlug: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
