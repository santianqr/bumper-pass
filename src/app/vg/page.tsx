import VGForm from "@/components/vg-form";

export default function VGPage() {
  return (
    <main>
      <section className="flex justify-center bg-gradient-to-r from-[#E62534] to-[#F59F0F] py-12 text-background">
        <div className="max-w-screen-sm">
          <p className="text-5xl font-medium tracking-tighter">
            Welcome to our
          </p>
          <h2 className="text-6xl font-bold tracking-wide">
            Variation Generator
          </h2>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="max-w-screen-sm">
          <p>Instructions</p>
          <ul className="list-inside list-disc marker:text-foreground/60">
            <li>
              Be specific as possible about your style, personality and
              interests to create a unique suggestions for your plate.
            </li>
            <li>Maximum XX characters.</li>
            <li>
              We have an estimated time of 1 to 2 minutes to have your results,
              depending on how specific you are.
            </li>
          </ul>
        </div>
      </section>
      <VGForm />
    </main>
  );
}
