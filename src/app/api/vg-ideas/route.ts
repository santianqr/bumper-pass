import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
//import { env } from "@/env";

type Body = {
  description: string;
  num_ideas: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const user_input = body.description;
    const num_ideas = body.num_ideas;

    const TEMPLATE = `Generate ${num_ideas} ideas/short texts based on a user input, linking all the topics if applicable, and mentioning interesting/curious facts about them, use dates and related topics.

    Input: a user input (a word, a phrase, a sentence, etc.)
    Output: ${num_ideas} ideas (short texts) related to the input, separated by new lines

    Steps:
    1. Analyze the input and determinate the links and the keywords.
    2. Generate ${num_ideas} texts based on the input, using related data and keywords.
    3. Link the topics in the input, if applicable, and generate ideas that integrate them smoothly and naturally.
    4. All outputs must be written in English.

    Example input: I like Roblox, I am from Colombia, Tolima and I like the football.
    Example output:

    Tolima's name staduium is Manuel Murillo Toro
    The typical tree of Tolima is called Ocobo
    The favorite food is the Tamal and Lechona
    Rolombia is a Roblox server dedicated to the Roleplay Colombian community
    One of the best players on the Tolima team is Marco Perez

    Input:
    
    {input}`;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-4-0125-preview",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const schema = z.object({
      ideas: z
        .array(
          z
            .string()
            .min(20, "Each idea must be at least 20 characters long.")
            .max(60, "Each idea must be no more than 60 characters long.")
            .describe(
              "Unique and creative short text based on user's input, linking topics, ideas, and related data with curious facts",
            ),
        )
        .min(num_ideas)
        .max(num_ideas)
        .describe(
          `Array of ${num_ideas} Unique and creative short text based on user's input, linking topics, ideas, and related data with curious facts`,
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
      input: user_input,
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
