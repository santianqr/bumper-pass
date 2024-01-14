"use client";

import { useState } from "react";
import Image from "next/image";
import platess from "@/public/bp_plate.png";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ApiData = {
  plates: string[];
};

type VGPopUpProps = {
  userContent: string;
  plates: string[];
  setUserContent: (value: string) => void;
};

export default function VgPopUp({
  userContent,
  plates,
  setUserContent,
}: VGPopUpProps) {
  const [feedback, setFeedback] = useState("");
  const [newPreferences, setNewPreferences] = useState("");
  const [apiData, setApiData] = useState<ApiData | null>(null);

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
    setApiData(data);
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
    setApiData(data);
  };

  return (
    <article>
      <div>
        <p>Are you liking the suggestions?</p>
        <p>Press yes to continue</p>
        <p>Press no to edit your preferences</p>
      </div>
      <div>
        <Button size={"sm"} className="w-12" onClick={handleYes}>
          Yes
        </Button>
        <Button size={"sm"} className="w-12" onClick={handleNo}>
          No
        </Button>
      </div>
      <div>
        {feedback === "no" && (
          <div>
            <Textarea
              onChange={(e) => setNewPreferences(e.target.value)}
              value={newPreferences}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        )}
        {apiData &&
          apiData.plates.map(
            (
              plate: string,
              index: number // Define los tipos aquí
            ) => <p key={index}>{plate}</p>
          )}
      </div>
    </article>
  );
}
