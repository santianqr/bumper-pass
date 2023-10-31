import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `Given the user interests and preferences, generate 10 unique and personalized license plate suggestions for California, USA. The license plate should reflect the user input and adhere to the following guidelines:

Include a combination of numbers (1-9), letters, or both, and spaces.
Do not use special or accented characters.
Have a minimum of 2 characters and a maximum of 7 characters.
Should not carry connotations offensive to good taste and decency, or be misleading.
Avoid configurations that could be confused with existing license plates.
The goal is to create license plates that are unique, meaningful, and adhere to the regulations set by the California Department of Motor Vehicles. Remember, these are just suggestions. The user is free to create their own personalized license plate that best represents them."

Please provide the user interests and preferences as input to the model. Based on this input, the model should generate 10 recommendations for license plates with 7, 6, and 5 characters. The generated license plates should be creative, unique, and reflect the user input. Remember to ensure that the generated suggestions adhere to the guidelines provided.

Input:

{input}`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? "hola";
    const currenMessageContent = messages[messages.length - 1]?.content;

    const prompt = PromptTemplate.fromTemplate<{ input: string }>(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatOpenAI models.
     */
    const model = new ChatOpenAI({
      openAIApiKey: "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",
      temperature: 0.2,
      //modelName: "gpt-3.5-turbo",
      modelName: "gpt-4",
      topP: 0.5,
      frequencyPenalty: 0.2,
      presencePenalty: 1,
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON Schema directly if desired.
     */
    const schema = z.object({
      plates: z
        .array(z.string().max(7))
        .min(10)
        .max(10)
        .describe(
          "The array of 10 personalized plates following strictly DMV rules."
        ),
    });

    /**
     * Bind the function and schema to the OpenAI model.
     * Future invocations of the returned model will always use these arguments.
     *
     * Specifying "function_call" ensures that the provided function will always
     * be called by the model.
     */

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

    /**
     * Returns a chain with the function calling model.
     */

    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser());

    const result = await chain.invoke({ input: currenMessageContent });
    console.log(currenMessageContent);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
