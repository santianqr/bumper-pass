import { VGResults } from "@/components/vg-results";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";

export default async function VGPage() {
  const session = await getServerAuthSession();

  const userPlates = await db.customPlate.findMany({
    where: { userId: session?.user.id },
    select: {
      plate: true,
    },
  });

  const plates = userPlates.map((plate) => plate.plate);
  return (
    <main className="flex flex-col justify-center space-y-8">
      <section className="flex justify-center bg-gradient-to-r from-[#E62534] to-[#F59F0F] py-12 text-background">
        <div>
          <p className="text-5xl font-medium tracking-tighter">
            Welcome to our
          </p>
          <h2 className="text-6xl font-bold tracking-wide">
            Variation Generator
          </h2>
        </div>
      </section>
      <section className="mx-auto flex max-w-screen-sm justify-center">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-primary">Instructions</p>
          <ul className="list-inside list-disc text-sm marker:text-foreground/60">
            <li>
              Be as specific as possible about your tastes and preferences. The
              more details you provide, the more personalized your suggestions
              will be.
            </li>
            <li>Separate each of your preferences by a full stop (.).</li>
            <li>
              Do not mention any preferences for spaces or symbols in your text,
              use the checkboxes below for that.
            </li>
            <li>Maximum of 180 characters.</li>
            <li>
              Inappropriate or offensive words/slangs and topics are not
              accepted in any language.
            </li>
          </ul>
          <p className="text-sm">
            <span className="font-medium">SPECIFIC EXAMPLE:</span>I love dogs
            and I have a beautiful labrador named Sally. I play videogames and I
            love Super Mario. I used to play soccer in high school and my
            favorite player is Messi. (168 characters)
          </p>
          <p className="text-sm">
            <span className="font-medium">NON-SPECIFIC EXAMPLE:</span>I love
            dogs, videogames, and soccer. (36 characters)
          </p>
        </div>
      </section>
      <VGResults plates={plates} />
    </main>
  );
}
