"use client";

import VGForm from "@/components/vg-form";
import VGCard from "./vg-card";
import VGPopup from "./vg-popup";
import { useState } from "react";

type ResponseVg = {
  validPlates: string[];
  allPlates: string[];
};

export default function VGResults() {
  const [result, setResult] = useState<ResponseVg | null>(null);
  const [form, setForm] = useState<{
    plateLength: string;
    plateType: string;
    spaces: boolean;
    symbols: boolean;
    description: string;
  } | null>(null);

  return (
    <section className="flex justify-center ">
      <div className="w-full max-w-screen-sm space-y-4">
        <VGForm setResult={setResult} setForm={setForm} />
        {result && form ? (
          <>
            <VGCard
              result={result.validPlates}
              description={form.description}
            />
            <VGPopup />
          </>
        ) : null}
      </div>
    </section>
  );
}
