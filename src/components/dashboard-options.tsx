import { SearchCheck, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function DashboardOptions() {
  return (
    <div className="grid grid-cols-3 justify-items-stretch ">
      <Link
        className="flex flex-col items-center justify-self-end"
        href="/account/dashboard/my-search"
      >
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
          <SearchCheck size={60} />
        </div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          My Search Results
        </h4>
      </Link>
      <div className="justify-self-center border-l-2 border-primary/20"></div>
      <Link
        className="flex flex-col items-center justify-self-start"
        href="/account/dashboard/my-vg"
      >
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary bg-gradient-to-r from-[#E62534] to-[#F59F0F] p-1 text-[#FFFFFF]">
          <Lightbulb size={60} />
        </div>
        <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight">
          My Variation
          <br />
          Generator Results
        </h4>
      </Link>
    </div>
  );
}
