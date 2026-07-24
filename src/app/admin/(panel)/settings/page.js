import { PageHeader } from "@/app/admin/_components/kit";
import { getSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const initial = await getSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Global site configuration — branding, SEO, tracking and contact details."
      />
      <SettingsForm action={saveSettings} initial={initial} />
    </div>
  );
}
