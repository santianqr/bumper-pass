"use client";

import { useChat } from "ai/react";
import styles from "@/styles/vg.module.css";
import Image from "next/image";
import platess from "@/public/Recurso 68.svg";
import { useState, useEffect } from "react";
import VGPopUp from "@/components/vg_pop";

export default function VGPage() {
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [numChars, setNumChars] = useState<string>("5");
  const [charType, setCharType] = useState<string>("letters");
  const [charType2, setCharType2] = useState<string>("");
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [allowSpaces, setAllowSpaces] = useState<boolean>(false);
  const [userContent, setUserContent] = useState<string>("");
  const [plates, setPlates] = useState<string[]>([]);

  useEffect(() => {
    setCharType2(charType === "letters" ? "numbers" : "letters");
  }, [charType]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "user",
        content: `must be plates with just ${
          numChars !== ""
            ? numChars
            : "any number of characters between 3 and 7"
        } characters. ${
          charType !== ""
            ? `must be just ${charType}, no ${charType2}`
            : "use numbers and letters"
        }. ${includeSymbols ? "allow symbols" : "don't allow symbols"}. ${
          allowSpaces ? "allow spaces" : "don't allow spaces"
        }`,
      },
    ],
  });

  useEffect(() => {
    const assistantMessage = messages.find(
      (message) => message.role === "assistant"
    );
    if (assistantMessage) {
      const content = JSON.parse(assistantMessage.content);
      setPlates(content.plates);
      setUserContent(messages[0].content);
      setShowComponent(true);
    }
  }, [messages]);

  const handleSymbolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeSymbols(e.target.checked);
  };

  const handleSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowSpaces(e.target.checked);
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumChars(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCharType(e.target.value);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <select value={numChars} onChange={handleNumChange}>
          <option value="">Any</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
        <select value={charType} onChange={handleTypeChange}>
          <option value="">Mixed</option>
          <option value="letters">Just Letters</option>
          <option value="numbers">Just Numbers</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={handleSymbolsChange}
          />
          Allow symbols
        </label>
        <label>
          <input
            type="checkbox"
            checked={allowSpaces}
            onChange={handleSpacesChange}
          />
          Allow spaces
        </label>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your personal preferences and show the magic..."
        />
        <button type="submit">Send</button>
      </form>
      {JSON.stringify(messages)}
      <div className={styles.platesContainer}>
        {messages.map((message) => {
          if (message.role === "assistant") {
            const content = JSON.parse(message.content);
            return content.plates.map((plate: string) => (
              <div className={styles.plate} key={plate}>
                <Image alt="" src={platess} width={200} height={100} />
                <p className={styles.plateText}>{plate}</p>
              </div>
            ));
          }
          return null;
        })}
        {showComponent && (
          <VGPopUp
            userContent={userContent}
            plates={plates}
            setUserContent={setUserContent}
          />
        )}
      </div>
    </div>
  );
}
