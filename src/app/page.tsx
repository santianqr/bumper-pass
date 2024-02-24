import AboutSection from "@/components/about-section";
import SearchSection from "@/components/search-section";
import ServicesSection from "@/components/services-section";

export default function Home() {
  return (
    <main className="container">
      <SearchSection id="search-now" />
      <AboutSection id="about"/>
      <ServicesSection id="services" />
    </main>
  );
}

{/* cooment */}
