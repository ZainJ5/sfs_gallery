/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp is a native module and pdfkit ships .afm font files it loads from disk —
  // keep both external so they're required at runtime, not bundled.
  serverExternalPackages: ["sharp", "pdfkit"],
  async redirects() {
    return [
      // Old WordPress entry point. Printed QR codes point at /index.php, so send
      // it to the homepage permanently (308) — no need to reprint the QR codes.
      { source: "/index.php", destination: "/", permanent: true },
    ];
  },
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
