"use client";

import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ApiData = {
  plates: string[];
};

type VGPopUpProps = {
  userContent: string;
  plates: string[];
  setUserContent: (value: string) => void;
  updatePlates: (newPlates: string[]) => void;
  setShowComponent: (value: boolean) => void; // Aquí agregas la nueva función
};

export default function VgPopUp({
  userContent,
  plates,
  setUserContent,
  updatePlates,
  setShowComponent,
}: VGPopUpProps) {
  const [feedback, setFeedback] = useState("");
  const [newPreferences, setNewPreferences] = useState("");

  const handleYes = async () => {
    const response = await fetch("/api/yes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userContent, plates }),
    });
    const data: ApiData = await response.json(); // Usa el tipo ApiData aquí
    console.log(data);
    updatePlates(data.plates);
    setShowComponent(false);
  };

  const handleNo = () => {
    setFeedback("no");
  };

  const handleSend = async () => {
    const response = await fetch("/api/no", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userContent:
          userContent.split(":")[0] + ". my preferences are: " + newPreferences,
        plates: plates,
      }),
    });
    const data: ApiData = await response.json(); // Usa el tipo ApiData aquí
    console.log(data);
    updatePlates(data.plates);
    setShowComponent(false);
  };

  return (
    <article className="p-6 max-w-sm w-full mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">
      <div>
        <p className="font-semibold text-md">Are you liking the suggestions?</p>
        <p className="text-sm">Press yes to continue</p>
        <p className="text-sm">Press no to edit your preferences</p>
      </div>
      <div className="space-x-4 mt-2">
        <Button size={"sm"} className="w-12" onClick={handleYes}>
          Yes
        </Button>
        <Button size={"sm"} className="w-12" onClick={handleNo}>
          No
        </Button>
      </div>
      <div className="mt-2 max-w-sm w-full">
        {feedback === "no" && (
          <div className="space-y-2 items-center flex flex-col">
            <Textarea
              onChange={(e) => setNewPreferences(e.target.value)}
              value={newPreferences}
            />
            <Button onClick={handleSend}>Send</Button>
            <LoaderIcon className="animate-spin" />
          </div>
        )}
      </div>
    </article>
  );
}
