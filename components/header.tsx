import Image from "next/image";
import Navbar from "./navbar";

export default function Header() {
  return (
    <header className="p-2 border-b-2 border-primary">
      <div className="flex flex-1 justify-between max-w-6xl mx-auto">
        <Image alt="logo" src="/logo.png" width={150} height={300} />
        <Navbar />
      </div>
    </header>
  );
}
