import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SearchNotAvailable() {
  return (
    <div className="mt-2 flex flex-col items-center space-y-2 text-center text-sm">
      <p className="text-xl font-semibold">Sorry!</p>
      <p>It seems this plate is already taken</p>

      <p>
        Try searching for another option, or explore other creative options with
        the help of our{" "}
        <Link href="/services/vg" className="font-medium text-primary">
          Variation Generator
        </Link>
      </p>
      <Link href="/services/vg">
        <Button className="rounded-2xl">Go!</Button>
      </Link>
      <p className="font-medium text-primary">
        Clic below to get our tailored creative alternatives.
      </p>
    </div>
  );
}
