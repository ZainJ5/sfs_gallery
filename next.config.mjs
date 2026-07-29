/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp is a native module and pdfkit ships .afm font files it loads from disk —
  // keep both external so they're required at runtime, not bundled.
  serverExternalPackages: ["sharp", "pdfkit"],
  images: {
    // Locally uploaded media, served from /public/uploads (Next in dev, NGINX in prod).
    localPatterns: [{ pathname: "/uploads/**" }],
    // Allow the live WordPress host as a fallback source before media is migrated to disk.
    remotePatterns: [
      { protocol: "https", hostname: "sfsgallery.com" },
      { protocol: "https", hostname: "www.sfsgallery.com" },
    ],
  },
};

export default nextConfig;
