"use client";

import { VGForm } from "@/components/vg-form";
import { VGCard } from "./vg-card";
import { VGPopup } from "./vg-popup";
import { useState } from "react";

type ResponseVg = {
  validPlates: string[];
  allPlates: string[];
};

type VGResultsProps = {
  plates: string[];
};

export function VGResults({ plates }: VGResultsProps) {
  const [result, setResult] = useState<ResponseVg | null>(null);
  const [form, setForm] = useState<{
    plateLength: string;
    plateType: string;
    spaces: boolean;
    symbols: boolean;
    description: string;
    allPlates: string[];
  } | null>(null);

  return (
    <section className="flex justify-center ">
      <div className="w-full max-w-screen-sm space-y-4">
        <VGForm plates={plates} setResult={setResult} setForm={setForm} />
        {result && form ? (
          <>
            <VGCard
              result={result.validPlates}
              description={form.description}
            />
            {form.allPlates}
            <VGPopup form={form} allPlates={result.allPlates} />
          </>
        ) : null}
      </div>
    </section>
  );
}
