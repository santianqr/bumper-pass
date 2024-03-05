"use client";

import VGForm from "@/components/vg-form";
import { useState } from "react";
import VGCard from "./vg-card";

export default function VGResults() {
  const [result, setResult] = useState<string[] | null>(null);
  return (
    <section>
      <VGForm setResult={setResult} />
      {result && <VGCard result={result} />}
    </section>
  );
}
