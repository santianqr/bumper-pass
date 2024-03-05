import { Button } from "@/components/ui/button";

export default function VGPopup() {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow flex flex-col items-center space-y-2">
      <p className="text-sm font-medium leading-none">
        Are you liking current suggestions?
      </p>
      <div className="space-x-4">
        <Button
          type="submit"
          className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
        >
          Yes
        </Button>
        <Button
          type="submit"
          className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
        >
          No
        </Button>
      </div>
    </div>
  );
}
