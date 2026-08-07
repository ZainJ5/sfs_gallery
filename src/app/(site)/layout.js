import Script from "next/script";
import { getSettings } from "@/lib/settings";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";
import HeadScripts from "./_components/HeadScripts";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: { default: s.siteTitle, template: `%s | ${s.siteTitle}` },
    description: s.metaDescription || undefined,
    keywords: s.metaKeywords || undefined,
    // Favicon comes from the file-convention icons in src/app/ (favicon.ico,
    // icon.png, apple-icon.png — the SFS emblem), not the full wide logo.
    openGraph: {
      title: s.siteTitle,
      description: s.metaDescription || undefined,
      type: "website",
    },
  };
}

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader logoUrl={settings.logoUrl} siteTitle={settings.siteTitle} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <HeadScripts pixelCode={settings.pixelCode} gaCode={settings.gaCode} />
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
