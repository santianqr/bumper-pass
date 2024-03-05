import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRandomUserAgent } from "@/lib/userAgents";

const userAgent =
  getRandomUserAgent() ??
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

type Body = {
  plateLength: string;
  plateType: string;
  spaces: boolean;
  symbols: boolean;
  description: string;
};

type ResponseCookie = {
  message: string;
};

type ResponseIdeas = {
  ideas: string[];
};

type ResponsePlates = {
  plates: string[];
};

type ResponseValid = {
  validPlates: string[];
};

type ResponseSearch = {
  validPlates: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const plateLength = body.plateLength;
    const plateType = body.plateType;
    const spaces = body.spaces;
    const symbols = body.symbols;
    const description = body.description;

    // get the cookie
    const response_cookie: Response = await fetch(
      "http://localhost:3000/api/vg-cookie",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": userAgent,
        },
      },
    );
    const data_cookies = (await response_cookie.json()) as ResponseCookie;
    const cookies = data_cookies.message;

    let validPlates: string[] = [];
    let allPlates: string[] = [];

    console.log("validPlates.length: ", validPlates.length);
    while (validPlates.length < 5) {
      const num_ideas = 5 - validPlates.length;
      // get the ideas
      const response_ideas: Response = await fetch(
        "http://localhost:3000/api/vg-ideas",
        {
          method: "POST",
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
          },
          body: JSON.stringify({
            description: description,
            num_ideas: num_ideas,
          }),
        },
      );
      const data_ideas = (await response_ideas.json()) as ResponseIdeas;
      const ideas = data_ideas.ideas;
      console.log("ideas: ", ideas);

      // get the plates
      const response_plates: Response = await fetch(
        "http://localhost:3000/api/vg-plates",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
          body: JSON.stringify({
            ideas: ideas,
            num_ideas: num_ideas,
            plateLength: plateLength,
            plateType: plateType,
            spaces: spaces,
            symbols: symbols,
            used_plates: allPlates,
          }),
        },
      );
      const data_plates = (await response_plates.json()) as ResponsePlates;
      const plates = data_plates.plates;
      console.log("plates:", plates);

      // validate each plate by algorithm
      const response_valid: Response = await fetch(
        "http://localhost:3000/api/vg-valid",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
          body: JSON.stringify({
            plateLength: plateLength,
            plateType: plateType,
            spaces: spaces,
            symbols: symbols,
            plates: plates,
            allPlates: allPlates,
          }),
        },
      );
      const data_valid = (await response_valid.json()) as ResponseValid;
      const valid_plates = data_valid.validPlates;
      console.log("valid plates: ", valid_plates);

      allPlates = allPlates.concat(plates);
      console.log("allPlates:", allPlates);
      // second validation with search vg
      const response_search: Response = await fetch(
        "http://localhost:3000/api/vg-search",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
          body: JSON.stringify({
            plates: valid_plates,
            cookie: cookies,
          }),
        },
      );
      const data_search = (await response_search.json()) as ResponseSearch;
      const search_plates = data_search.validPlates;
      console.log("search plates: ", search_plates);
      validPlates = validPlates.concat(search_plates);
    }

    return NextResponse.json({
      validPlates, allPlates
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: "An error occurred while processing the request.",
    });
  }
}
