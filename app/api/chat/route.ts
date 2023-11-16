import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `Generate 10 unique license plate suggestions for California, USA. The user preferences are: {input} and you have to follow them. If the user wants only letters, only numbers or mixed or wants a specific number of characters or any number of characters, you must follow their guidelines. You must extract the user's personal preference and use all the data you have in your model related to the topic the user wants. Be creative and don't limit yourself but always follow the following basic rules and user input.

Have a minimum of 3 characters and a maximum of 7 characters.
Do not use special or accented characters.
Follow the DMV rules.

`;
{
  /*const TEMPLATE = `Generate 10 unique license plate suggestions for California, USA. You have take into account the following basic rules and DMV rules. But your responses must to follow the user preferences, if they prefer only numbers, letters or mixed and the number of characters. It is a priority.
Have a minimum of 3 characters and a maximum of 7 characters.
Do not use special or accented characters.
Please be very creative and use all data about that you have related to the information provided by the user to generate the best possible personalized license plate suggestions. If the user mentions a specific topic, use all the data for your suggestions.
Its very important if the user writes he/she wants only numbers, letters or mixed, you have to follow that rule. Same with the number of characters.
You must validate if each suggestion follows the user preferences and the DMV rules. 

Input: {input}`;
*/
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const userInput = `${
      messages[messages.length - 2].content
    }. my preferences are: ${messages[messages.length - 1].content}`;

    const prompt = PromptTemplate.fromTemplate<{ input: string }>(TEMPLATE);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.6,
      //modelName: "gpt-3.5-turbo",
      modelName: "gpt-4",
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.6,
    });

    const schema = z.object({
      plates: z
        .array(z.string().max(7).min(3))
        .min(10)
        .max(10)
        .describe(
          "The array of 10 personalized plates following the guidelines."
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

    const result = await chain.invoke({ input: userInput });
    console.log(result);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
