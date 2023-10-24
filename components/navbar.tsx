"use client";
import React, { useState } from "react";
import styles from "@/styles/navbar.module.css";
import { PiUserCircle } from "react-icons/pi";

export default function Navbar() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  return (
    <header className={styles.header}>
      <h1>BumperPass</h1>
      <nav className={styles.navbar}>
        <ul className={styles.listbuttons}>
          {["Search Now!", "About Us", "Services", "Contact"].map(
            (text, index) => (
              <li key={index}>
                <div
                  className={selectedButton === index ? styles.selected : ""}
                  onClick={() => setSelectedButton(index)}
                >
                  <a href="#">{text}</a>
                </div>
              </li>
            )
          )}
          <li>
            <PiUserCircle size={25} color="#F25922"/>
          </li>
        </ul>
      </nav>
    </header>
  );
}
