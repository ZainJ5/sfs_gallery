import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    body: { type: String, default: "" },
    source: { type: String, default: "contact" }, // "contact" | "inquire"
    artistName: { type: String, default: "" }, // set when an INQUIRE came from an artist page
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
