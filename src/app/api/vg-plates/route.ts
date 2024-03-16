import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
//import { env } from "@/env";

type Body = {
  ideas: string;
  num_ideas: number;
  plateLength: string;
  plateType: string;
  spaces: boolean;
  symbols: boolean;
  used_plates: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const ideas = body.ideas;
    const num_ideas = body.num_ideas;
    const plateLength = body.plateLength;
    const plateType = body.plateType;
    const spaces = body.spaces;
    const symbols = body.symbols;
    const used_plates = body.used_plates;

    const TEMPLATE = `The input is ${num_ideas} ideas or short texts. Based on those ideas, generate personalized license plates for the USA following the rules. Be creative and use all related data about the topics. If you need more ideas, you can use the same input and generate more ideas, if you need numbers please search all related to numbers about the ideas.
    
    ${
      plateType === "letters"
        ? "- All characters must be letters"
        : plateType === "numbers"
          ? "- Use just numbers between 1 to 9"
          : "- Use numbers and letters both mixed"
    }.
    ${plateType === "any" || plateType === "numbers" ? "- Do not use the number 0 and do not use letter (A-Z)" : "- Do not use numbers"}.
    ${symbols === true ? "- Use these emojis ❤, ⭐, 🖐, ➕. Each emoji counts as one character, example '12⭐34' has 5 characters." : ""}
    ${plateLength != "any" ? `- The plate must have ${plateLength} characters` : "- The plate shoud have between 2 and 7 characters"}.
    ${symbols === true ? "- Use just one emoji per plate" : "- Do not use emojis"}.
    ${spaces === true ? "- Use spaces. Each space counts as one character, example: 'DO GG' has 5 characters." : ""}
    ${used_plates.length > 0 ? `- Do not use the following plates, because you already reccomend: ${used_plates.join(", ")}.` : ""}
    ${symbols === true && spaces === true ? `- The plate could have including one symbol and spaces, example: 'A1 ❤ B'.` : ""}
    `;
    console.log(TEMPLATE);
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 1,
      modelName: "gpt-4-0125-preview",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const schema = z.object({
      plates: z
        .array(
          z
            .string()
            .min(2, "Min 2 characters.")
            .max(7, "Max 7 characters.")
            .describe(
              "Customized plates following strictly the guidelines and being creative.",
            ),
        )
        .min(num_ideas)
        .max(num_ideas)
        .describe(
          `Array of unique and personalized plates following strictly the guidelines.`,
        ),
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

    const result = await chain.invoke({
      input: ideas,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = e as { message?: string; status?: number };
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 500 },
      );
    }
  }
}
