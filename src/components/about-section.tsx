import Image from "next/image";

type Props = {
  id: string;
};

export default function AboutSection({ id }: Props) {
  return (
    <section
      id={id}
      className="mb-14 grid grid-cols-2 items-center justify-items-center gap-4 space-y-8 pt-14"
    >
      <h2 className="col-span-2 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        About us
      </h2>

      <div className="space-y-4 text-sm">
        <p>
          We are excited to provide you a unique experience to express your
          style and personality on the road. Your vehicle deserves more than
          just a plate, it deserves a statement!
        </p>
        <p>
          <span className="font-semibold">Our mission</span> is improve the
          exchange and procurement of personalized license plates through
          conectivity and innovation.
        </p>
        <p>
          <span className="font-semibold">Our vision</span> is to enable
          customers to search for personalized license plates, generate
          suggestions for different combinatios, and offers and intermediating
          platform for buying and selling of personalized license plates.
        </p>
      </div>
      <Image src="/car_about.webp" width={500} height={500} alt="car_about" />
    </section>
  );
}
