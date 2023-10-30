import styles from "@/styles/vg.module.css";

export default function VGPage() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input placeholder="Type your personal preferences and show the magic..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
