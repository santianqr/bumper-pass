import Image from "next/image";
import Navbar from "./navbar";

export default function Header() {
  return (
    <header className="p-2 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 justify-between max-w-6xl mx-auto">
        <Image alt="logo" src="/logo.png" width={150} height={300} />
        <Navbar />
      </div>
    </header>
  );
}
