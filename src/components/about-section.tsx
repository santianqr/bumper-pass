"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AboutSection() {
  const pathname = usePathname();
  return (
    <section className="space-y-8 ">
      <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight first:mt-0">
        About us
      </h2>

      <div
        className={`mx-auto text-sm ${pathname === "/about" ? "flex max-w-screen-md flex-col items-center space-y-4" : "flex items-center space-y-4"}`}
      >
        <div>
          <p>
            We are excited to provide you a unique experience to express your
            style and personality on the road. Your vehicle deserves more than
            just a plate, it deserves a statement!
          </p>
          <p>
            <span className="font-semibold">Our mission</span> is improve the
            exchange and procurement of personalized license plates through
            conectivity and innovation.
          </p>
          <p>
            <span className="font-semibold">Our vision</span> is to enable
            customers to search for personalized license plates, generate
            suggestions for different combinatios, and offers and intermediating
            platform for buying and selling of personalized license plates.
          </p>
        </div>
        <Image src="/car_about.webp" width={500} height={500} alt="car_about" />
      </div>
    </section>
  );
}
