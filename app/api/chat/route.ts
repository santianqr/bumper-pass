import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

function countSymbols(string: string): number {
  const emojiRegex = /[\p{Emoji}]/gu;
  const charRegex = /[\p{L}\p{P}\p{Z}]/gu;
  const emojis = string.match(emojiRegex) || [];
  const chars = string.match(charRegex) || [];
  return emojis.length + chars.length;
}

async function validatePlates(
  userInput: string,
  plates: string[]
): Promise<string[]> {
  const rules = userInput.split(". ");
  let regex: RegExp = /^[\w\d]{3,7}$/;
  let symbolsAllowed = false;
  let spacesAllowed = false;
  let minChars = 3;
  let maxChars = 7;
  let exactLength = false;

  for (const rule of rules) {
    if (rule === "allow symbols") {
      symbolsAllowed = true;
    }
    if (rule === "allow spaces") {
      spacesAllowed = true;
    }
  }

  const symbolRegexPart = symbolsAllowed ? "❤⭐👆➕" : "";
  const spaceRegexPart = spacesAllowed ? " /" : "";

  for (const rule of rules) {
    if (
      rule.startsWith(
        "must be plates with just any number of characters between"
      )
    ) {
      const countMatch = rule.match(/(\d+)/g);
      if (countMatch && countMatch.length === 2) {
        minChars = parseInt(countMatch[0]);
        maxChars = parseInt(countMatch[1]);
        exactLength = false;
        regex = new RegExp(
          `^[a-zA-Z1-9${symbolRegexPart}${spaceRegexPart}]{${minChars},${maxChars}}$`
        );
      }
    } else if (rule.startsWith("must be plates with just")) {
      const countMatch = rule.match(/(\d+)/);
      if (countMatch) {
        minChars = maxChars = parseInt(countMatch[0]);
        exactLength = true;
        regex = new RegExp(
          `^[a-zA-Z1-9${symbolRegexPart}${spaceRegexPart}]{${minChars}}$`
        );
      }
    } else if (rule === "must be just letters, no numbers") {
      regex = new RegExp(
        `^[a-zA-Z${symbolRegexPart}${spaceRegexPart}]{${minChars},${maxChars}}$`
      );
    } else if (rule === "must be just numbers, no letters") {
      regex = new RegExp(
        `^[1-9${symbolRegexPart}${spaceRegexPart}]{${minChars},${maxChars}}$`
      );
    } else if (rule === "use numbers and letters") {
      regex = new RegExp(
        `^[a-zA-Z1-9${symbolRegexPart}${spaceRegexPart}]{${minChars},${maxChars}}$`
      );
    }
  }

  const validPlates: string[] = [];
  for (const plate of plates) {
    const plateLength = countSymbols(plate);
    console.log("Plate:", plate);
    console.log("Plate length:", plateLength);
    if (
      regex.test(plate) &&
      ((exactLength && plateLength === maxChars) ||
        (!exactLength && plateLength >= minChars && plateLength <= maxChars))
    ) {
      validPlates.push(plate);
    }
  }

  const apiValidPlates: string[] = [];
  for (const plate of validPlates) {
    console.log("Validating plate:", plate);
    const response: Response = await fetch("http://localhost:3000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizedPlate: plate,
        vehicleType: "auto",
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message === "OK") {
        apiValidPlates.push(plate);
      }
    }
  }

  return apiValidPlates;
}

type Result = {
  plates: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const userInput = `${
      messages[messages.length - 2].content
    }. my preferences are: ${messages[messages.length - 1].content}`;

    console.log("User input:", userInput);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.5,
      modelName: "gpt-4-1106-preview",
    });

    let validPlates: string[] = [];
    let allGeneratedPlates: string[] = [];
    let numPlates = 10;

    while (validPlates.length < 5) {
      const TEMPLATE = `Generate ${numPlates} unique plates suggestions based strictly on user preferences for California, USA. Exclude the following suggestions: ${allGeneratedPlates.join(
        ", "
      )}. Follow the user guidelines to the letter, but be creative with your suggestions. Use all the data you have related to the preferences that the user writes. Be very creative, write recommendations with related content, not just with the keywords that the user types. Even if the user writes about several topics, you can relate them to generate your recommendations. Relate as much information as possible to generate plate recommendations.
      If the user enables symbols or spaces, at least 30% of your recommendations must come with symbols or spaces. It's crucial that you adhere to all the instructions and guidelines provided. The user input has a specific format separeted for dots:
      1.The exact number of characters or wants recommendations between 3 and 7 characters in length.
      2.If the user wants only letters, only numbers or allows both.
      3.The use of special symbols is allowed.
      4.The use of half spaces or full spaces is allowed or not.
      5.User preferences.
      Follow these basic guidelines:
      -Adhere to DMV rules.
      -The half space is represented as "/" and the space as " ".
      -Symbols, spaces (" ") and half spaces ("/") also count as a one character, for example, ❤LAB ➕ has 6 characters or LARA/P has 6 characters.
      -Use numbers between 1 and 9. Zero is not allowed.
      -Special or accented characters are not accepted.
      -Allowed symbols: ❤, ⭐, 👆, ➕.
      -Inappropriate words or short expressions of bad words, for example, FCK, are prohibited.
      -Inappropriate words or intended words in any language are prohibited.
      Input: 
      {input}`;

      const prompt = PromptTemplate.fromTemplate<{ input: string }>(TEMPLATE);

      const schema = z.object({
        plates: z
          .array(z.string().max(7).min(3))
          .min(numPlates)
          .max(numPlates)
          .describe(`The array of ${numPlates} personalized plates.`),
      });

      const functionCallingModel = model.bind({
        functions: [
          {
            name: "output_formatter",
            description: "Should always be used to properly format output",
            parameters: zodToJsonSchema(schema),
          },
        ],
        function_call: { name: "output_formatter" },
      });

      const chain = prompt
        .pipe(functionCallingModel)
        .pipe(new JsonOutputFunctionsParser());

      const result = (await chain.invoke({ input: userInput })) as Result;
      console.log("Generated plates:", result.plates);

      const newGeneratedPlates = result.plates.filter(
        (plate) => !allGeneratedPlates.includes(plate)
      );
      allGeneratedPlates = [...allGeneratedPlates, ...newGeneratedPlates];
      console.log("All generated plates:", allGeneratedPlates);

      const newValidPlates = await validatePlates(
        userInput,
        newGeneratedPlates
      );
      console.log("New valid plates:", newValidPlates);

      validPlates = [...validPlates, ...newValidPlates];
      console.log("All valid plates:", validPlates);

      numPlates = (5 - validPlates.length) * 2;
      console.log("Number of plates needed:", numPlates);
    }

    return NextResponse.json(
      { plates: validPlates.slice(0, 5) },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
