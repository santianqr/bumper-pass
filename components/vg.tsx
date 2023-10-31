"use client";

import { useChat } from "ai/react";
import { type FormEvent } from "react";
import styles from "@/styles/vg.module.css";
import Image from "next/image";
import plates from "@/public/Recurso 68.svg";

export default function VGPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your personal preferences and show the magic..."
        />
        <button type="submit">Send</button>
      </form>
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
