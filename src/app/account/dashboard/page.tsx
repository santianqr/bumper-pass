import DashboardOptions from "@/components/dashboard-options";

export default function UserDashboard() {
  return (
    <main>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        User Dashboard
      </h3>
      <section className="h-[60vh] flex items-center justify-center">
        {" "}
        <DashboardOptions />
      </section>
    </main>
  );
}
