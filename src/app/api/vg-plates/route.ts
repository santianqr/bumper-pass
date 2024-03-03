import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

type Body = {
  ideas: string;
  num_ideas: string;
  plateLength: string;
  plateType: string;
  spaces: string;
  symbols: string;
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

    const TEMPLATE = `Generate ${num_ideas} personalized plates based on user input. The user input is an array of strings where each string representing a text with a curious fact or an idea, use these texts as inspiration or support to generate the plates, but you have to follow the following guidelines:

    ${
      plateType === "letters"
        ? "* All characters must be letters"
        : plateType === "numbers"
          ? "* All characters must be numbers"
          : "* You could use numbers and letters both and mixed"
    }.
    ${plateType === "any" || plateType === "numbers" ? "Do not use the number 0" : "Do not use numbers"}
    ${plateLength != "any" ? `* The plate must have ${plateLength} characters` : "* The plate shoud have between 2 and 7 characters"}.
    ${symbols === "true" ? "* Use these emojis ❤, ⭐, 🖐, ➕. Each emoji counts as one character" : ""}.
    ${symbols === "true" ? "* Use just one emoji per plate" : ""}.
    ${spaces === "true" ? "* Use spaces inside the word, not on the sides, ex: 'DO GG'. Space counts as a character" : ""}.
    Input:
    
    {input}`;
    console.log(TEMPLATE);
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.2,
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
              "Customized plates following the guidelines and being creative.",
            ),
        )
        .min(parseInt(num_ideas))
        .max(parseInt(num_ideas))
        .describe(
          `Array of unique and personalized plates following the guidelines.`,
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
