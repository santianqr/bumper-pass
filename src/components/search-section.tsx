import { SearchForm } from "./search-form";
import { Card, CardContent } from "@/components/ui/card";
import { Plate } from "./plate";
import Link from "next/link";

export function SearchSection() {
  return (
    <section className="from- flex flex-col items-center space-y-8 bg-gradient-to-r from-[#E62534]/90 to-[#F59F0F]/85 py-4">
      <h2 className="col-span-2 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Search Now!
      </h2>
      <div className="grid grid-cols-2 items-center justify-items-center gap-4">
        <Card className="flex max-w-sm items-center border-none bg-[#B1B1B1]/20 shadow-md">
          <CardContent className="pt-6">
            <SearchForm />
          </CardContent>
        </Card>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            How it works?
          </h3>
          <p className="mb-4 text-sm">Lets search for your license plate.</p>
          <ul className="mb-4 list-inside list-decimal space-y-2 text-sm">
            <li>
              <Link
                href="/login"
                className="font-semibold underline decoration-foreground"
              >
                Click here to login
              </Link>{" "}
              and start to use our search service, if you dont have and account{" "}
              <Link
                href="/register"
                className="font-semibold underline decoration-foreground"
              >
                click here to sign up.
              </Link>
            </li>
            <li>Choose the type of vehicle your have (auto or motorcycle).</li>
            <li>Next, select the state where your vehicle is registered.</li>
            <li>
              Now, the most exciting moment has arrived! In this field, you will
              enter exactly what you want to see reflected on your plate.
              Remember that you can combine letters, numbers, and the available
              symbols. Then, click on search to know if your desired plate is
              available.
            </li>
          </ul>
          <p className="mb-4 text-xs text-muted-foreground">
            *Only certain specific types of plates allow including symbols
          </p>
          <Plate bpPlate="BMPRP4S" />

          <p className="text-center text-xs text-muted-foreground">
            *This is not an official preview of your plate
          </p>
        </div>
      </div>
    </section>
  );
}
