import nextEnv from "@next/env";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

nextEnv.loadEnvConfig(process.cwd());

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sfs_gallery";
  const email = (process.env.ADMIN_EMAIL || "admin@sfsgallery.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    await existing.save();
    console.log(`✓ Updated existing admin: ${email}`);
  } else {
    await User.create({ name: "Administrator", email, passwordHash, role: "admin" });
    console.log(`✓ Created admin: ${email}`);
  }

  console.log(`  Password: ${password}  (change it after first login)`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
