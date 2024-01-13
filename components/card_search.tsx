import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CardSearch() {
  return (
    <Card className="max-w-96 flex flex-col items-center border-none shadow-none">
      <CardHeader className="flex items-center">
        <SearchCheck className="w-16 h-16 text-background rounded-full bg-gradient-to-r from-primary to-primary/60 " />

        <CardTitle>Free Search</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80 space-y-1">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis ipsam,
          sit beatae molestias deleniti quidem natus officiis veniam nihil
          tempora. Cum, asperiores ullam? Blanditiis quo rem, deleniti
          repudiandae aliquid minima?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis ipsam,
          sit beatae molestias deleniti quidem natus officiis veniam nihil
          tempora. Cum, asperiores ullam? Blanditiis quo rem, deleniti
          repudiandae aliquid minima?
        </p>
      </CardContent>
      <CardFooter>
        <Link href="/">
          <Button className="space-x-1">
            <ArrowRight className="rounded-full bg-background text-primary" />
            <p>Make a search</p>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
