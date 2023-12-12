import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

function countSymbols(string: string): number {
  const emojiRegex = /[\p{Emoji}]/gu;
  const charRegex = /\p{L}/gu;
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
  let minChars = 3;
  let maxChars = 7;
  let exactLength = false;

  for (const rule of rules) {
    if (rule === "allow symbols") {
      symbolsAllowed = true;
    }
  }

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
        if (symbolsAllowed) {
          regex = new RegExp(`^[a-zA-Z1-9❤⭐👆➕]{${minChars},${maxChars}}$`);
        } else {
          regex = new RegExp(`^[a-zA-Z1-9]{${minChars},${maxChars}}$`);
        }
      }
    } else if (rule.startsWith("must be plates with just")) {
      const countMatch = rule.match(/(\d+)/);
      if (countMatch) {
        minChars = maxChars = parseInt(countMatch[0]);
        exactLength = true;
        if (symbolsAllowed) {
          regex = new RegExp(`^[a-zA-Z1-9❤⭐👆➕]{${minChars}}$`);
        } else {
          regex = new RegExp(`^[a-zA-Z1-9]{${minChars}}$`);
        }
      }
    } else if (rule === "must be just letters, no numbers") {
      if (symbolsAllowed) {
        regex = new RegExp(`^[a-zA-Z❤⭐👆➕]{${minChars},${maxChars}}$`);
      } else {
        regex = new RegExp(`^[a-zA-Z]{${minChars},${maxChars}}$`);
      }
    } else if (rule === "must be just numbers, no letters") {
      if (symbolsAllowed) {
        regex = new RegExp(`^[1-9❤⭐👆➕]{${minChars},${maxChars}}$`);
      } else {
        regex = new RegExp(`^[1-9]{${minChars},${maxChars}}$`);
      }
    } else if (rule === "use numbers and letters") {
      if (symbolsAllowed) {
        regex = new RegExp(`^[a-zA-Z1-9❤⭐👆➕]{${minChars},${maxChars}}$`);
      } else {
        regex = new RegExp(`^[a-zA-Z1-9]{${minChars},${maxChars}}$`);
      }
    }
  }

  const validPlates: string[] = [];
  for (const plate of plates) {
    const plateLength = countSymbols(plate);
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
    let numPlates = 20;

    while (validPlates.length < 10) {
      const TEMPLATE = `Generate ${numPlates} UNIQUE license plate suggestions for California, USA. Exclude the following suggestions: ${allGeneratedPlates.join(
        ", "
      )}. It's crucial that you adhere to all the instructions and guidelines provided. The user input has a specific format, and I will provide 5 examples of user input and the expected output.

      User: must be plates with just 6 characters. must be just letters, no numbers. allow symbols. my preferences are: Vikings
      Output: must be ${numPlates} plates with just 6 characters and just letters. You can use names of heroes from Norse mythology, special places like Valhalla or special events like Ragnarok. includes symbols allowed in recommendations. include the symbols in the context of the plate.
      User: must be plates with just 5 characters. must be just numbers, no letters. don't allow symbols. my preferences are: friends the tv show
      Output: must be ${numPlates} plates with just 5 characters and just numbers. So you can use special dates, numbers of apartments, doors, special events or special dates like birthday of the characters, etc. do not include symbols.
      User: must be plates with just 5 characters. must be just letters, no numbers. don't allow symbols. my preferences are: I like Starwars, I am Canadian and I like hockey
      Output: Generate ${numPlates} plates with exactly 5 characters, using only letters. You can use names of characters, events, or places from Star Wars. You can also incorporate elements related to Canada and hockey, such as abbreviations of famous Canadian hockey players or teams. Do not include symbols.
      User: must be plates with just 4 characters. must be just numbers, no letters. don't allow symbols. my preferences are: All apple environment
      numbers. You can use special dates or numbers related to Apple, such as the release dates of iconic Apple products (e.g., '0701' for July 2001, the release date of the first iPod). Do not include symbols.
      User: must be plates with just any number of characters between 3 and 7 characters. use numbers and letters. allow symbols. my preferences are: I have a dog called Lara, she is a yellow labrador
      Output: in this case the user is not giving you any specific information about the number of characters either if the user wants numbers, letters. So you can any special number about the labrators, the name of the dog. includes symbols allowed in recommendations. include the symbols in the context of the plate.

      The most important thing is to understand that you can use all information related to the user's preferences to generate the suggestions. Don't limit yourself. If the user mentions they're from a certain place, look for relevant information about that place. If they mention stadiums, suggest stadium names. If they mention a sport, look for information about that sport. You can also combine the information they provide to generate suggestions.

      You must generate at least 3 suggestions with symbols if the user wants them. If the user indicates they do not want symbols, do not include symbols. Symbols have their context, for example, replacing words or giving a certain style. Symbols count as one character, so if the user asks for 5 characters, keep this in mind.
      
      Follow these basic guidelines:
      - Adhere to DMV rules.
      - Use numbers between 1 and 9. Zero is not allowed.
      - Special or accented characters are not accepted.
      - Allowed symbols: ❤, ⭐, 👆, ➕.
      - Inappropriate words or short expressions of bad words, for example, FCK, are prohibited.
      - Inappropriate words or intended words in any language are prohibited.
      
      Input: 
      {input}`;

      //console.log("Template:", TEMPLATE);

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

      numPlates = (10 - validPlates.length) * 2;
      console.log("Number of plates needed:", numPlates);
    }

    return NextResponse.json(
      { plates: validPlates.slice(0, 10) },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
