"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { LoaderIcon } from "lucide-react";
import platess from "@/public/bp_plate.png";
import Image from "next/image";
import VgPopUp from "@/components/vg_popup";

export default function VGPage() {
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [numChars, setNumChars] = useState<string>("5");
  const [charType, setCharType] = useState<string>("letters");
  const [charType2, setCharType2] = useState<string>("");
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [allowSpaces, setAllowSpaces] = useState<boolean>(false);
  const [userContent, setUserContent] = useState<string>("");
  const [plates, setPlates] = useState<string[]>([]);

  useEffect(() => {
    setCharType2(charType === "letters" ? "numbers" : "letters");
  }, [charType]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "user",
        content: `must be plates with just ${
          numChars !== "any"
            ? numChars
            : "any number of characters between 3 and 7"
        } characters. ${
          charType !== "mix"
            ? `must be just ${charType}, no ${charType2}`
            : "use numbers and letters"
        }. ${includeSymbols ? "allow symbols" : "don't allow symbols"}. ${
          allowSpaces ? "allow spaces" : "don't allow spaces"
        }`,
      },
    ],
  });

  useEffect(() => {
    const assistantMessage = messages.find(
      (message) => message.role === "assistant"
    );
    if (assistantMessage) {
      const content = JSON.parse(assistantMessage.content);
      setPlates(content.plates);
      const plateRules = messages[0].content;
      const personalPreferences = messages
        .slice(1)
        .filter((message) => message.role === "user")
        .map((message) => message.content);
      setUserContent(
        plateRules + ". my preferences are: " + personalPreferences.join(". ")
      );
      setShowComponent(true);
    }
  }, [messages]);

  const handleSymbolsChange = (checked: boolean | "indeterminate") => {
    setIncludeSymbols(checked as boolean);
  };
  const handleSpacesChange = (checked: boolean | "indeterminate") => {
    setAllowSpaces(checked as boolean);
  };

  const handleNumChange = (value: string) => {
    setNumChars(value);
  };

  const handleTypeChange = (value: string) => {
    setCharType(value);
  };

  const updatePlates = (newPlates: string[]) => {
    setPlates((prevPlates) => [...prevPlates, ...newPlates]);
  };

  return (
    <main className="py-2">
      <div className="mx-auto flex flex-col items-center">
        <div className="w-full py-10 bg-gradient-to-r from-primary to-primary/60 mx-auto flex flex-col items-center">
          <div>
            <p className="text-3xl text-background dark:text-foreground">
              Welcome to our
            </p>
            <h2 className="scroll-m-20 text-5xl font-semibold tracking-tight first:mt-0 text-background dark:text-foreground">
              Variation Generator
            </h2>
          </div>
        </div>
        <div className="max-w-xl space-y-3 my-2 ">
          <p className="font-semibold text-primary">Instructions</p>
          <ul className="list-disc list-inside text-sm">
            <li>
              Be specific as possible about your style, personality and
              interests to create a unique suggestions for your plate.
            </li>
            <li>Maximum XX characters.</li>
            <li>
              We have an estimated time of 1 to 2 minutes to have your results,
              depending on how specific you are.
            </li>
          </ul>
        </div>
        <form
          className="max-w-xl w-full flex flex-col items-center space-y-2"
          onSubmit={handleSubmit}
        >
          <Select value={numChars} onValueChange={handleNumChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select the number of characters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="7">7</SelectItem>
            </SelectContent>
          </Select>
          <Select value={charType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select the type of characters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mix">Mixed</SelectItem>
              <SelectItem value="letters">Just letters</SelectItem>
              <SelectItem value="numbers">Just numbers</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={handleSymbolsChange}
              />
              <label
                htmlFor="symbols"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include symbols
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spaces"
                checked={allowSpaces}
                onCheckedChange={handleSpacesChange}
              />
              <label
                htmlFor="spaces"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include spaces
              </label>
            </div>
          </div>
          <div className="grid grid-cols-4 w-full gap-2">
            <Textarea
              placeholder="Type your message here."
              className="col-span-4"
              value={input}
              onChange={handleInputChange}
            />
            <Button className="col-start-4" type="submit">
              Generate
            </Button>
          </div>
        </form>
        <div className="space-x-2 mt-2 flex flex-col items-center max-w-xl w-full">
          {messages.some(
            (message) =>
              message.role === "assistant" &&
              JSON.parse(message.content).plates.length > 0
          ) && (
            <Card className="max-w-xl w-full">
              <CardHeader>
                <CardTitle>Your inputs</CardTitle>
                <CardDescription>{userContent.split(":")[1]}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 justify-items-center">
                {plates.map((plate: string) => (
                  <div key={plate} className="relative">
                    <Image alt="" src={platess} width={200} height={100} />
                    <p className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                      {plate}
                    </p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size={"sm"}>Go to My Dashboard</Button>
              </CardFooter>
            </Card>
          )}

          {showComponent && (
            <VgPopUp
              userContent={userContent}
              plates={plates}
              setUserContent={setUserContent}
              updatePlates={updatePlates}
              setShowComponent={setShowComponent}
            />
          )}
        </div>
      </div>
    </main>
  );
}
