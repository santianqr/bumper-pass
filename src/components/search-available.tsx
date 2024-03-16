import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SearchAvailable() {
  return (
    <div className="mt-2 flex flex-col items-center space-y-2 text-sm">
      <p className="text-xl font-semibold">Hurray!</p>
      <p>It seems that this plate is available, hit the gas and get it fast!</p>

      <Link href="https://www.dmv.ca.gov/wasapp/ipp2/initPers.do" target="_blank">
        <Button className="rounded-2xl">Take me to the DMV</Button>
      </Link>
    </div>
  );
}
