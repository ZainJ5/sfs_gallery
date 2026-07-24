import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model("Slider", SliderSchema);
