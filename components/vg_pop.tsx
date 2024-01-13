import { useState } from "react";
import Image from "next/image";
import platess from "@/public/Recurso 68.svg";
import styles from "@/styles/vg.module.css";

type VGPopUpProps = {
  userContent: string;
  plates: string[];
  setUserContent: (value: string) => void;
};

// Si conoces la estructura exacta de los objetos en las placas, reemplaza 'object' con la interfaz adecuada
export default function VGPopUp({
  userContent,
  plates,
  setUserContent,
}: VGPopUpProps) {
  const [feedback, setFeedback] = useState("");
  const [newPreferences, setNewPreferences] = useState("");
  const [displayedPlates, setDisplayedPlates] = useState<object[]>([]);

  const handleYes = async () => {
    const response = await fetch("/api/yes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userContent, plates }),
    });
    const data = await response.json();
    if (Array.isArray(data)) {
      setDisplayedPlates(data);
    } else if (typeof data === "object") {
      // Convertir el objeto en un array
      const arrayData = Object.values(data) as object[];
      setDisplayedPlates(arrayData);
    } else {
      console.error(
        "La respuesta de la API no es un array ni un objeto:",
        data
      );
    }
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
    const data = await response.json();
    if (Array.isArray(data)) {
      setDisplayedPlates(data);
    } else if (typeof data === "object") {
      // Convertir el objeto en un array
      const arrayData = Object.values(data) as object[];
      setDisplayedPlates(arrayData);
    } else {
      console.error(
        "La respuesta de la API no es un array ni un objeto:",
        data
      );
    }
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
        {displayedPlates.map((plate, index) => (
          <div key={index} className={styles.plate}>
            <Image alt="" src={platess} width={200} height={100} />
            <p>{JSON.stringify(plate)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
