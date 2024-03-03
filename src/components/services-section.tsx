import CardsServices from "./cards-services";

type Props = {
  id: string;
};

export default function ServicesSection({ id }: Props) {
  return (
    <section id={id} className="space-y-4 border-t-2 border-[#E62534]">
      <div className="mx-auto w-40 rounded-b-lg bg-[#E62534] p-2">
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight text-[#FFFFFF] first:mt-0">
          Services
        </h2>
      </div>
      <CardsServices />
    </section>
  );
}
