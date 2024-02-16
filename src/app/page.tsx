import AboutSection from "@/components/about-section";
import SearchSection from "@/components/search-section";
import ServicesSection from "@/components/services-section";

export default function Home() {
  return (
    <main className="container space-y-20">
      <SearchSection />
      <AboutSection />
      <ServicesSection />
    </main>
  );
}
