import { SearchCheck, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  id: string;
};

export default function ServicesSection({ id }: Props) {
  return (
    <section id={id} className="space-y-4 border-t-2 border-[#E62534]">
      <div className="mx-auto w-40 rounded-b-lg bg-[#E62534] p-2">
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight text-[#FFFFFF] first:mt-0">
          Services
        </h2>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-4">
        <div className="flex max-w-xs flex-col items-center justify-between space-y-4">
          <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
            <SearchCheck size={60} />
          </div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Free Search
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              With our innovate online custom license plate search service, you
              can conduct searches efficiently and hassle-free! With us, you can
              explore multiple options, optimizing your time.
            </p>
            <p>
              Once you find the perfect plate for you, well send you directly to
              the purchase site, so you can place your order in minutes.
            </p>
          </div>
          <Button
            type="submit"
            className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
          >
            Make a search
          </Button>
        </div>
        <div className="flex max-w-xs flex-col items-center space-y-4">
          <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
            <Lightbulb size={60} />
          </div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Variation Generator
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              With this revolutionary service, youll discover the most creative
              way to customize your license plates! get creative and unique
              suggestions for your plate, generated based on your style,
              personality and interests.
            </p>
          </div>
          <Link href="/vg">
            <Button
              type="submit"
              className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
            >
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
