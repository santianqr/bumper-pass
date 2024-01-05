import { useState } from "react";

type VGPopUpProps = {
  userContent: string;
  plates: string[];
  setUserContent: (value: string) => void;
};

export default function VGPopUp({
  userContent,
  plates,
  setUserContent,
}: VGPopUpProps) {
  const [feedback, setFeedback] = useState("");
  const [newPreferences, setNewPreferences] = useState("");

  const handleYes = async () => {
    // Aquí puedes enviar los datos al backend
    const response = await fetch("/api/yes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userContent, plates }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleNo = () => {
    setFeedback("no");
  };

  const handleSend = async () => {
    // Aquí puedes enviar los datos al backend
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
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col">
      <p>Le están gustando las respuestas?</p>
      <div>
        <button onClick={handleYes}>Yes</button>
        <button onClick={handleNo}>No</button>
        {feedback === "no" && (
          <div>
            <textarea
              onChange={(e) => setNewPreferences(e.target.value)}
              value={newPreferences}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
