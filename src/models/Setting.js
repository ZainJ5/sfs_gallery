import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    // Singleton document — always keyed "global".
    key: { type: String, default: "global", unique: true },
    logoUrl: { type: String, default: "" },
    siteTitle: { type: String, default: "San Francisco Street Gallery" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    pixelCode: { type: String, default: "" },
    gaCode: { type: String, default: "" },
    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    address: {
      type: String,
      default: "50 E. San Francisco Street, Santa Fe, NM 87501",
    },
    phones: {
      office: { type: String, default: "505.982.0689" },
      direct: { type: String, default: "718.559.2535" },
    },
    email: { type: String, default: "contact@sfsgallery.com" },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
