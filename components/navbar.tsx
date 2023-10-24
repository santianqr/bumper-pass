import React from "react";
import styles from "@/styles/navbar.module.css";
import {PiUserCircle} from "react-icons/pi"

export default function Navbar() {
  return (
    <header className={styles.header}>
      <h1>BumperPass</h1>
      <nav>
        <ul className={styles.listbuttons}>
          <li >
            <a href="#">Search Now!</a>
          </li>
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <PiUserCircle/>
          </li>
        </ul>
      </nav>
    </header>
  );
}
