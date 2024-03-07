import { CircleUser } from "lucide-react";
import SettingsForm from "@/components/settings-form";
import NotificationsForm from "@/components/settings-notifications-form";

export default function Settings() {
  return (
    <main className="flex">
      <aside className="bg-foreground/15 p-8 text-primary">
        <CircleUser size={128} />
      </aside>
      <section className="space-y-4 p-8">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Settings & Preferences
        </h3>
        <SettingsForm />
        <NotificationsForm />
      </section>
    </main>
  );
}
