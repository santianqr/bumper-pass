import { AccountForm } from "@/components/account-form";
import { CircleUser } from "lucide-react";
import { api } from "@/trpc/server";
import { unstable_noStore as noStore } from "next/cache";

export default async function Account() {
  noStore();
  const accountData = await api.func.getAccount.query();
  return (
    <main className="flex">
      <aside className="bg-foreground/15 p-8 text-primary">
        <CircleUser size={128} />
      </aside>
      <section className="space-y-4 p-8">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Account Information
        </h3>
        {accountData ? (
          <AccountForm accountData={accountData} />
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </main>
  );
}
