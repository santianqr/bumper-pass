import CardSearch from "@/components/card_search";
import CardVG from "@/components/card_vg";
import Image from "next/image";

export default function Page() {
  return (
    <main className="py-2">
      <div className="mx-auto flex flex-col items-center space-y-4">
        <h2 className="max-w-6xl scroll-m-20 pb-2 text-3xl tracking-tight first:mt-0">
          SERVICES
        </h2>
        <div className="relative h-60 w-full">
          <Image
            src="/bg_services.jpg"
            alt="bg_services"
            fill
            style={{
              objectFit: "cover", // cover, contain, none
            }}
          />
          <div className="absolute top-0 left-0 h-full w-full bg-white/55" />
        </div>
        <div className="max-w-6xl w-full grid grid-cols-2 justify-items-center">
          <CardSearch />
          <CardVG />
        </div>
      </div>
    </main>
  );
}
