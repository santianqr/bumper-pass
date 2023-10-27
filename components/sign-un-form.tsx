import React from "react";
import styles from "@/styles/sign-up.module.css";
import Image from "next/image";
import hands from "@/public/hands.webp";

export default function SignInForm() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <Image src={hands} alt="" height={250} width={250} />
        <p className={styles.p1}>
          To start, you must log in with your username and password
        </p>
        <input type="email" placeholder="Enter your email address" />
        <input type="password" placeholder="Enter your password" />

        <div className={styles.container1}>
          <div>
            <input
              type="checkbox"
              id="rememberpassword"
              name="rememberpassword"
            />
            <label htmlFor="rememberpassword">Remmember me</label>
          </div>

          <a href="#">Forgot your password?</a>
        </div>

        <button className={styles.buttonlogin} type="submit">
          Log in
        </button>
        <div className={styles.p3}>If you don't have an account yet</div>
        <button className={styles.buttonsingup}>Sign up</button>
        <p className={styles.privacy}>Privacy Policy</p>
      </form>
    </div>
  );
}
