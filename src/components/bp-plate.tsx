import Image from "next/image";

type BPPlateProps = {
  bp_plate: string;
};

export default function BPPlate({ bp_plate }: BPPlateProps) {
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
        {bp_plate}
      </p>
    </div>
  );
}
