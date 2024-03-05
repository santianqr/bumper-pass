"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import VGCard from "./vg-card";

type VGPopupProps = {
  form: {
    plateLength: string;
    plateType: string;
    spaces: boolean;
    symbols: boolean;
    description: string;
    allPlates: string[];
  } | null;
  allPlates: string[];
};

type ResponseVg = {
  validPlates: string[];
  allPlates: string[];
};

export default function VGPopup({ form, allPlates }: VGPopupProps) {
  const [showTextarea, setShowTextarea] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseYes, setResponseYes] = useState<ResponseVg | null>(null);
  const [responseSend, setResponseSend] = useState<ResponseVg | null>(null);

  const handleYesClick = async () => {
    setLoading(true);
    const response = await fetch("/api/vg-main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plateLength: form?.plateLength,
        plateType: form?.plateType,
        spaces: form?.spaces,
        symbols: form?.symbols,
        description: form?.description,
        allPlates: allPlates,
      }),
    });
    const responseData = (await response.json()) as ResponseVg;
    setResponseYes(responseData);
    setLoading(false);
  };

  const handleNoClick = () => {
    setShowTextarea(true);
  };

  const handleSendClick = async () => {
    setLoading(true);
    const response = await fetch("/api/vg-main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plateLength: form?.plateLength,
        plateType: form?.plateType,
        spaces: form?.spaces,
        symbols: form?.symbols,
        description: textareaValue,
        allPlates: allPlates,
      }),
    });
    const responseData = (await response.json()) as ResponseVg;
    setResponseSend(responseData);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 rounded-xl border bg-card p-6 text-card-foreground shadow">
        <p className="text-sm font-medium leading-none">
          Are you liking current suggestions?
        </p>
        <div className="space-x-4">
          <Button
            type="submit"
            onClick={handleYesClick}
            className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
          >
            {loading ? <Loader className="animate-spin" /> : "Yes"}
          </Button>
          <Button
            type="submit"
            onClick={handleNoClick}
            className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
          >
            {loading ? <Loader className="animate-spin" /> : "No"}
          </Button>
        </div>
        {showTextarea && (
          <>
            <Textarea
              placeholder="Insert your type"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
            <Button
              type="submit"
              onClick={handleSendClick}
              className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
            >
              {loading ? <Loader className="animate-spin" /> : "Send"}
            </Button>
          </>
        )}
      </div>
      {responseYes && form ? (
        <VGCard result={responseYes.validPlates} description={form.description} />
      ) : null}
      {responseSend && form ? (
        <VGCard result={responseSend.validPlates} description={textareaValue} />
      ) : null}
    </>
  );
}
