import { AboutSection } from "@/components/about-section";
import { SearchSection } from "@/components/search-section";
import { ServicesSection } from "@/components/services-section";
import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    return (
      <main className="space-y-16">
        <SearchSection />
        <AboutSection />
        <ServicesSection />
      </main>
    );
  } else {
    return (
      <main className="flex justify-center">
        <Image
          src="/building_website.webp"
          alt="website_building_image"
          width={900}
          height={300}
        />
      </main>
    );
  }
}
