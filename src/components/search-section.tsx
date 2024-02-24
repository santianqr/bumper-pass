import SearchForm from "./search-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
};


export default function SearchSection( {id} : Props) {
  return (
    <section id={id} className="grid grid-cols-2 content-center justify-items-center gap-4 space-y-8 pt-12">
      <h2 className="col-span-2 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Search Now!
      </h2>
      <Card className="flex max-h-80 max-w-sm items-center">
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
              href="#"
              className="font-semibold underline decoration-foreground"
            >
              Click here to login
            </Link>{" "}
            and start to use our search service, if you dont have and account{" "}
            <Link
              href="#"
              className="font-semibold underline decoration-foreground"
            >
              click here to sign up.
            </Link>
          </li>
          <li>Choose the type of vehicle your have (auto or motorcycle).</li>
          <li>Next, select the state where your vehicle is registered.</li>
          <li>
            Now, the most exciting moment has arrived! In this field, you will
            enter exactly what you want to see reflected on your plate. Remember
            that you can combine letters, numbers, and the available symbols.
            Then, click on search to know if your desired plate is available.
          </li>
        </ul>
        <p className="mb-4 text-xs text-muted-foreground">
          *Only certain specific types of plates allow including symbols
        </p>
        <div className="relative mx-auto h-[99px] w-[180px]">
          <Image
            src="/bp_plate.webp"
            width={180}
            height={180}
            alt="bumperpass_plate"
          />
          <p
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[30%] transform font-serif text-2xl -tracking-tighter text-black/80  font-semibold`}
          >
            BM3RP4SS
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          *This is not an official preview of your plate
        </p>
      </div>
    </section>
  );
}
