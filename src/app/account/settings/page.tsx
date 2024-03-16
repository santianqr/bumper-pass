import { CircleUser } from "lucide-react";
import { SettingsForm } from "@/components/settings-form";
import { NotificactionsForm } from "@/components/settings-notifications-form";
import { api } from "@/trpc/server";

import { unstable_noStore as noStore } from "next/cache";
import DeleteForm from "@/components/settings-delete-form";

export default async function Settings() {
  noStore();
  const suscribeData = await api.func.getSuscribe.query();
  const suscribe = suscribeData?.suscribe ?? false;
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
        <NotificactionsForm suscribe={suscribe} />
        <DeleteForm />
      </section>
    </main>
  );
}
