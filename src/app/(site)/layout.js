import { getSettings } from "@/lib/settings";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";
import HeadScripts from "./_components/HeadScripts";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: { default: s.siteTitle, template: `%s | ${s.siteTitle}` },
    description: s.metaDescription || undefined,
    keywords: s.metaKeywords || undefined,
    icons: s.logoUrl ? { icon: s.logoUrl } : undefined,
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
    </>
  );
}
