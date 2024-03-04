import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const plateLength = body.plateLength;
    const plateType = body.plateType;
    const spaces = body.spaces;
    const symbols = body.symbols;
    const description = body.description;

    // sacar la cookie
    const response_cookie: Response = await fetch(
      "http://localhost:3000/api/vg-cookie",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      },
    );
    const data_cookies = (await response_cookie.json()) as ResponseCookie;
    const cookies = data_cookies.message;

    //let validPlates: string[] = [];
    //let allPlates: string[] = [];
    let numIdeas = 4;

    while (numIdeas != 0) {

      // sacar las ideas
      const response_ideas: Response = await fetch(
        "http://localhost:3000/api/vg-ideas",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
          body: JSON.stringify({ description: description, num_ideas: numIdeas }),
        },
      );
      const data_ideas = (await response_ideas.json()) as ResponseIdeas;
      const ideas = data_ideas.ideas;
      console.log(ideas);

      //sacar las placas
      const response_plates: Response = await fetch(
        "http://localhost:3000/api/vg-plates",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
          body: JSON.stringify({ ideas: ideas, num_ideas: numIdeas, plateLength: plateLength, plateType: plateType, spaces: spaces, symbols: symbols}),
        },
      );
      const data_plates = (await response_plates.json()) as ResponsePlates;
      const plates = data_plates.plates;
      console.log(plates);

            

      numIdeas = numIdeas - 1;
    }




    return NextResponse.json({
      plateLength,
      plateType,
      spaces,
      symbols,
      description,
      cookies,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: "An error occurred while processing the request.",
    });
  }
}

// crear lista de user agents para las solicitudes ( todas los request)
{
  /* 
  para placas con simbolos
  hand
  star
  plus 
  heart
  
  tipo K
  
  poner @ en el simbolo
  
  para placas sin simbolos
  kidsPlate ""
  plate_type_R
  plateNameLow environmental
  */
}
