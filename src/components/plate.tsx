import Image from "next/image";

type Props = {
  bpPlate: string;
};

export function Plate({ bpPlate }: Props) {
  return (
    <div className="relative mx-auto h-[99px] w-[180px]">
      <Image
        src="/bp_plate.webp"
        width={180}
        height={180}
        alt="bumperpass_plate"
      />
      <p
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[30%] transform font-serif text-2xl font-semibold -tracking-tighter  text-black/80`}
      >
        {bpPlate}
      </p>
    </div>
  );
}
