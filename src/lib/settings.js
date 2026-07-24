import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

export const SETTINGS_DEFAULTS = {
  logoUrl: "",
  siteTitle: "San Francisco Street Gallery",
  metaKeywords: "",
  metaDescription:
    "San Francisco Street Gallery — contemporary art gallery in Santa Fe, New Mexico.",
  pixelCode: "",
  gaCode: "",
  socials: { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "" },
  address: "50 E. San Francisco Street, Santa Fe, NM 87501",
  phones: { office: "505.982.0689", direct: "718.559.2535" },
  email: "contact@sfsgallery.com",
};

/**
 * Load the site Settings singleton. Always resolves — falls back to
 * defaults when the DB is unreachable or unseeded so the site still renders.
 */
export async function getSettings() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "global" }).lean();
    if (!doc) return { ...SETTINGS_DEFAULTS };
    const plain = JSON.parse(JSON.stringify(doc));
    return {
      ...SETTINGS_DEFAULTS,
      ...plain,
      socials: { ...SETTINGS_DEFAULTS.socials, ...(plain.socials || {}) },
      phones: { ...SETTINGS_DEFAULTS.phones, ...(plain.phones || {}) },
    };
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

export default getSettings;
