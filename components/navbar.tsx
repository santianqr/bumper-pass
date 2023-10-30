"use client";
import React, { useState } from "react";
import styles from "@/styles/navbar.module.css";
import { PiUserCircle } from "react-icons/pi";
import Image from "next/image";
import logoBP from "@/public/logoBP.webp";

const NAV_ITEMS = ["Search Now!", "About Us", "Services", "Contact"];

export default function Navbar() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  const renderNavItem = (text: string, index: number) => (
    <li key={index}>
      <div
        className={selectedButton === index ? styles.selected : ""}
        onClick={() => setSelectedButton(index)}
      >
        <a href="#">{text}</a>
      </div>
    </li>
  );

  return (
    <header className={styles.header}>
      <Image alt="logobp" src={logoBP} width={200} height={50} />
      <nav className={styles.navbar}>
        <ul className={styles.listbuttons}>
          {NAV_ITEMS.map(renderNavItem)}
          <li>
            <PiUserCircle size={25} color="#F25922" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
