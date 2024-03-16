"use client";

import { ServicesCard } from "./services-card";
import { usePathname } from "next/navigation";

export function ServicesSection() {
  const pathname = usePathname();
  return (
    <section
      className={`space-y-8 ${pathname === "/services" ? "" : "border-t-2 border-[#E62534]"}`}
    >
      <div
        className={`mx-auto w-40 ${pathname === "/services" ? "" : "rounded-b-lg bg-[#E62534] p-2"}`}
      >
        <h2
          className={`scroll-m-20 text-center text-3xl font-semibold tracking-tight ${pathname === "/services" ? "" : "text-background"} first:mt-0`}
        >
          Services
        </h2>
      </div>
      <ServicesCard />
    </section>
  );
}
