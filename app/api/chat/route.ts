import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `Generate 10 unique license plate suggestions for California, USA. The user input has a defined format. I will give you 5 examples of user input and the expected output. 

User: must be plates with just 6 characters. must be just letters, no numbers. my preferences are: Vikings
Output: must be 10 plates with 6 characters and just letters. You can use names of heroes from Norse mythology, special places like Valhalla or special events like Ragnarok.

User: must be plates with just 6 characters. must be just numbers, no letters. my preferences are: friends the tv show
Output: must be 10 plates with 6 characters and just numbers. So you can use special dates, numbers of apartments, doors, special events or special dates like birthday of the characters, etc.

User: must be plates with just 5 characters. must be just letters, no numbers. my preferences are: I like Starwars
Output: must be 10 plates with 5 characters and just letters. You can use names of characters, events, places that are in Star Wars.

User: must be plates with just 4 characters. must be just numbers, no letters. my preferences are: All apple environment
Output: must be 10 plates with 4 characters and just numbers. You can use special dates, numbers that are related to Apple, etc.

User: must be plates with just any number of characters between 3 and 7 characters. use numbers and letters. my preferences are: I have a dog called Lara, she is a yellow labrador
Output: in this case the user is not giving you any specific information about the number of characters either if he/she wants numbers, letters. So you can any special number about the labrators, the name of the dog. 

The most important thing is that you understand that you can use information related to the user's preference to generate the suggestions. Don't limit yourself

Follow the basic guidelines:
Follow DMV rules.
Do not use special characters or accents.

Input: 
{input}`;

async function validatePlates(
  userInput: string,
  plates: string[]
): Promise<string[]> {
  const rules = userInput.split(". ");
  let regex = /^[\w\d]{3,7}$/;

  for (const rule of rules) {
    if (rule.startsWith("must be plates with just")) {
      const countMatch = rule.match(/(\d+)/);
      if (countMatch) {
        regex = new RegExp(`^[\\w\\d]{${countMatch[0]}}$`);
      }
    } else if (rule === "must be just letters, no numbers") {
      regex = /^[a-zA-Z]{3,7}$/;
    } else if (rule === "must be just numbers, no letters") {
      regex = /^\d{3,7}$/;
    }
  }

  const validPlates: string[] = [];
  for (const plate of plates) {
    if (regex.test(plate)) {
      const response: Response = await fetch(
        "http://localhost:3000/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizedPlate: plate,
            vehicleType: "auto",
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "OK") {
          validPlates.push(plate);
        }
      }
    }
  }

  return validPlates;
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

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.1,
      modelName: "gpt-4-1106-preview",
    });

    let allPlates: string[] = [];
    let numPlates = 10;

    while (allPlates.length < 10) {
      const TEMPLATE = `Generate ${numPlates} unique license plate suggestions for California, USA. Do not take into account recommendations such as  ${allPlates.join(
        ", "
      )}.The user input has a defined format. I will give you 5 examples of user input and the expected output. 

      User: must be plates with just 6 characters. must be just letters, no numbers. my preferences are: Vikings
      Output: must be 10 plates with 6 characters and just letters. You can use names of heroes from Norse mythology, special places like Valhalla or special events like Ragnarok.

      User: must be plates with just 6 characters. must be just numbers, no letters. my preferences are: friends the tv show
      Output: must be 10 plates with 6 characters and just numbers. So you can use special dates, numbers of apartments, doors, special events or special dates like birthday of the characters, etc.

      User: must be plates with just 5 characters. must be just letters, no numbers. my preferences are: I like Starwars
      Output: must be 10 plates with 5 characters and just letters. You can use names of characters, events, places that are in Star Wars.

      User: must be plates with just 4 characters. must be just numbers, no letters. my preferences are: All apple environment
      Output: must be 10 plates with 4 characters and just numbers. You can use special dates, numbers that are related to Apple, etc.

      User: must be plates with just any number of characters between 3 and 7 characters. use numbers and letters. my preferences are: I have a dog called Lara, she is a yellow labrador
      Output: in this case the user is not giving you any specific information about the number of characters either if he/she wants numbers, letters. So you can any special number about the labrators, the name of the dog. 

      The most important thing is that you understand that you can use information related to the user's preference to generate the suggestions. Don't limit yourself

      Follow the basic guidelines:
      Follow DMV rules.
      Do not use special characters or accents.

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
      const validPlates = await validatePlates(
        userInput,
        result.plates as string[]
      );
      allPlates = [...allPlates, ...validPlates];
      numPlates = 10 - allPlates.length;
    }

    return NextResponse.json(
      { plates: allPlates.slice(0, 10) },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
