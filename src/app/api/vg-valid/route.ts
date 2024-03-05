import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const emojis = ["❤", "⭐", "🖐", "➕"];

function validatePlate(
  plate: string,
  allPlates: string[],
  plateLength: string,
  plateType: string,
  spaces: boolean,
  symbols: boolean,
): boolean {
  const existsCondition = !allPlates.includes(plate);
  const upperCasePlate = plate.toUpperCase();
  const plateWithoutEmojis = upperCasePlate.replace(
    new RegExp(emojis.join("|"), "g"),
    "E",
  );
  const trimmedPlate = plateWithoutEmojis.trim();
  const lengthCondition =
    plateLength === "any"
      ? trimmedPlate.length >= 2 && trimmedPlate.length <= 7
      : trimmedPlate.length === Number(plateLength);
  const typeCondition =
    plateType === "any" ||
    (plateType === "letters" && /^[A-Z\s]*$/.test(trimmedPlate)) ||
    (plateType === "numbers" && /^[1-9\s]*$/.test(trimmedPlate));
  const spacesCondition = spaces
    ? !/^[\s]|[\s]$/.test(trimmedPlate)
    : !/\s/.test(trimmedPlate);
  const symbolsCondition = symbols
    ? emojis.filter((emoji) => upperCasePlate.includes(emoji)).length <= 1
    : !emojis.some((emoji) => upperCasePlate.includes(emoji));
  return (
    lengthCondition &&
    typeCondition &&
    spacesCondition &&
    symbolsCondition &&
    existsCondition
  );
}

type Body = {
  plates: string[];
  allPlates: string[];
  plateLength: string;
  plateType: string;
  spaces: boolean;
  symbols: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const plates: string[] = body.plates;
    const allPlates: string[] = body.allPlates;
    const plateLength = body.plateLength;
    const plateType = body.plateType;
    const spaces = body.spaces;
    const symbols = body.symbols;

    const validPlates = plates.filter((plate) =>
      validatePlate(plate, allPlates, plateLength, plateType, spaces, symbols),
    );

    return NextResponse.json({ validPlates: validPlates });
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
