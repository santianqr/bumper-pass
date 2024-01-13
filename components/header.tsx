import Image from "next/image";
import Navbar from "./navbar";

export default function Header() {
  return (
    <header className="p-2 flex flex-1 justify-between max-w-6xl mx-auto">
      <Image alt="logo" src="/logo.png" width={150} height={300} />
      <Navbar />
    </header>
  );
}
