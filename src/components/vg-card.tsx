import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BPPlate from "./bp-plate";

type VGCardProps = {
  result: string[];
  description: string;
};

export default function VGCard({ result, description }: VGCardProps) {
  return (
    <Card className="flex max-w-screen-sm flex-col items-stretch">
      <CardHeader>
        <CardTitle>Your type</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardContent className="flex flex-wrap justify-center">
          {result.map((bp_plate, index) => (
            <div key={index} className="w-1/2 p-4">
              <BPPlate bp_plate={bp_plate} />
            </div>
          ))}
        </CardContent>
      </CardContent>
      <CardFooter className="self-end">
        <Link href="/account/dashbpard">
          <Button
            type="submit"
            className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
          >
            Go to my dashboard
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
