import { SearchCheck, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function CardServices() {
  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center">
      <Card className="grid max-w-xs grid-cols-1 justify-items-center border-none shadow-none">
        <CardHeader className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
          <SearchCheck size={60} />
        </CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Free Search
        </CardTitle>
        <CardContent className="space-y-2 text-sm">
          <p>
            With our innovate online custom license plate search service, you
            can conduct searches efficiently and hassle-free! With us, you can
            explore multiple options, optimizing your time.
          </p>
          <p>
            Once you find the perfect plate for you, well send you directly to
            the purchase site, so you can place your order in minutes.
          </p>
        </CardContent>
        <CardDescription></CardDescription>
        <CardFooter>
          <Link href="/#search-now">
            <Button
              type="submit"
              className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
            >
              Make a search
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card className="grid max-w-xs grid-cols-1 justify-items-center border-none shadow-none">
        <CardHeader className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
          <Lightbulb size={60} />
        </CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Variation Generator
        </CardTitle>
        <CardContent className="space-y-2 text-sm">
          <p>
            With this revolutionary service, youll discover the most creative
            way to customize your license plates! get creative and unique
            suggestions for your plate, generated based on your style,
            personality and interests.
          </p>
        </CardContent>
        <CardDescription></CardDescription>
        <CardFooter>
          <Link href="/vg">
            <Button
              type="submit"
              className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
            >
              Learn more
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
