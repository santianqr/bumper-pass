"use client";

import { useChat } from "ai/react";
import styles from "@/styles/vg.module.css";
import Image from "next/image";
import plates from "@/public/Recurso 68.svg";
import { useState, useEffect } from "react";

export default function VGPage() {
  const [numChars, setNumChars] = useState<string>("5");
  const [charType, setCharType] = useState<string>("letters");
  const [charType2, setCharType2] = useState<string>("");

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
        }`,
      },
    ],
  });

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
                <Image alt="" src={plates} width={200} height={100} />
                <p className={styles.plateText}>{plate}</p>
              </div>
            ));
          }
          return null;
        })}
      </div>
    </div>
  );
}
