import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Body = {
  plates: string[];
  cookie: string;
};

type SymbolMap = {
  "❤": string;
  "⭐": string;
  "🖐": string;
  "➕": string;
};

const symbolMap: SymbolMap = {
  "❤": "heart",
  "⭐": "star",
  "🖐": "hand",
  "➕": "plus",
};

async function validPlate(
  plate: string,
  cookie: string,
): Promise<{ plate: string; isValid: boolean }> {
  const hasSymbol: boolean = /❤|⭐|🖐|➕/.test(plate);

  const symbolKey = Object.keys(symbolMap).find((symbol) =>
    new RegExp(symbol).test(plate),
  );
  const symbolName =
    symbolKey && symbolMap[symbolKey as keyof SymbolMap]
      ? symbolMap[symbolKey as keyof SymbolMap]
      : "";

  plate = plate.replace(/❤|⭐|🖐|➕/g, "@");
  plate = plate.replace(/ /g, "*").trim().padEnd(7, " ");

  const data = {
    kidsPlate: symbolName ?? "",
    plateType: hasSymbol ? "K" : "R",
    plateNameLow: hasSymbol ? "kids" : "environmental",
    plateChar0: !plate.startsWith(" ") ? plate[0] : "",
    plateChar1: plate[1] !== " " ? plate[1] : "",
    plateChar2: plate[2] !== " " ? plate[2] : "",
    plateChar3: plate[3] !== " " ? plate[3] : "",
    plateChar4: plate[4] !== " " ? plate[4] : "",
    plateChar5: plate[5] !== " " ? plate[5] : "",
    plateChar6: plate[6] !== " " ? plate[6] : "",
  };

  const stringData: Record<string, string> = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ?? ""]),
  );

  const response = await fetch(
    "https://www.dmv.ca.gov/wasapp/ipp2/processConfigPlate.do",
    {
      method: "POST",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Uset-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Sec-Fetch-Site": "same-origin",
        Referer: "https://www.dmv.ca.gov/wasapp/ipp2/processPers.do",
        Origin: "https://www.dmv.ca.gov",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
      },
      body: new URLSearchParams(stringData),
    },
  );

  if (response.ok) {
    const html = await response.text();
    const isValid = html.includes('aria-valuenow="30"');
    return { plate, isValid };
  } else {
    console.log(`HTTP error! status: ${response.status}`);
    return { plate, isValid: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const plates = body.plates;
    const cookie = body.cookie;

    const validPlates = (
      await Promise.all(
        plates.map((plate) =>
          validPlate(plate, cookie).then((result) =>
            result.isValid ? plate : null,
          ),
        ),
      )
    ).filter(Boolean);

    return NextResponse.json({ validPlates });
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
