import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CardSearch() {
  return (
    <Card className="max-w-96 border-none grid grid-rows-3 grid-flow justify-items-center shadow-none">
      <CardHeader className="flex items-center">
        <Lightbulb className="w-16 h-16 text-background rounded-full bg-gradient-to-r from-primary to-primary/60 " />

        <CardTitle>Variation Generator</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis ipsam,
          sit beatae molestias deleniti quidem natus officiis veniam nihil
          tempora. Cum, asperiores ullam? Blanditiis quo rem, deleniti
          repudiandae aliquid minima?
        </p>
      </CardContent>
      <CardFooter className="flex items-end">
        <Link href="/services/vg">
          <Button className="space-x-1">
            <ArrowRight className="rounded-full bg-background text-primary" />
            <p>Learn more</p>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
