import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as puppeteer from "puppeteer";
import { api } from "@/trpc/server";

const symbolMap: Record<string, string> = {
  "❤": "heart",
  "⭐": "star",
  "🖐": "hand",
  "➕": "plus",
};

const replaceSymbols = (text: string) => {
  let newText = text;
  for (const symbol in symbolMap) {
    newText = newText.replace(new RegExp(symbol, "g"), "@");
  }
  return newText;
};

interface Body {
  vehicleType: string;
  personalizedPlate: string;
  state: string;
}

let page: puppeteer.Page | undefined;
let browser: puppeteer.Browser | undefined;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    if (!("vehicleType" in body) || !("personalizedPlate" in body)) {
      return NextResponse.json(
        { error: "Fields 'vehicleType' and 'personalizedPlate' are required" },
        { status: 400 },
      );
    }
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        //slowMo: 5,
        //headless: true,
        executablePath: "/usr/bin/chromium",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }

    page = (await browser.pages())[0] ?? (await browser.newPage());

    if (!page) {
      console.log("There are no open pages");
      return NextResponse.json(
        { error: "The requested service is currently unavailable" },
        { status: 503 },
      );
    }

    await page.goto("https://www.dmv.ca.gov/wasapp/ipp2/initPers.do", {
      waitUntil: "networkidle0",
    });
    await page.click("input#agree");
    (await page.$$("button"))[1]?.click() ??
      console.log("The button does not exist");

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.select("select#vehicleType", body.vehicleType.toUpperCase());
    await page.type("input#licPlateReplaced", "06405k2");
    await page.type("input#last3Vin", "802");
    await page.click("label[for=isRegExpire60N]");
    await page.click("label[for=isVehLeasedN]");
    const symbols = ["❤", "⭐", "🖐", "➕"];
    let hasSymbol = false;
    for (const symbol of symbols) {
      if (body.personalizedPlate.includes(symbol)) {
        hasSymbol = true;
        await page.click(`label[for=plate_type_K]`);
        const symbolValue = symbolMap[symbol];
        symbolValue
          ? await page.select("select#kidsPlate", symbolValue)
          : console.log(`El símbolo ${symbol} no está en symbolMap`);
        break;
      }
    }

    if (!hasSymbol) {
      await page.click(`label[for=plate_type_R]`);
    }

    (await page.$$("button"))[1]?.click() ??
      console.log("The button does not exist");

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    let modifiedPlate = replaceSymbols(body.personalizedPlate);
    modifiedPlate = modifiedPlate.padEnd(7, " ");

    for (let i = 0; i < 7; i++) {
      const character = modifiedPlate[i];
      character
        ? await page.type(`input#plateChar${i}`, character)
        : console.log(`The char in ${i} position is not defined`);
    }

    (await page.$$("button"))[1]?.click() ??
      console.log("The button does not exist");

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const spanElement = await page.$(".progress__tooltip");

    if (spanElement === null) {
      const newPlate = await api.func.savePlate.mutate({
        plate: body.personalizedPlate,
        available: false,
        vehicleType: body.vehicleType,
        state: body.state,
      });
      return NextResponse.json({ message: "NO", status: 200, newPlate });
    } else {
      const spanText = await spanElement.getProperty("textContent");
      const text = await spanText.jsonValue();
      if (text === "Progress: 30%") {
        const newPlate = await api.func.savePlate.mutate({
          plate: body.personalizedPlate,
          available: true,
          vehicleType: body.vehicleType,
          state: body.state,
        });
        return NextResponse.json({ message: "OK", status: 200, newPlate });
      } else {
        const newPlate = await api.func.savePlate.mutate({
          plate: body.personalizedPlate,
          available: false,
          vehicleType: body.vehicleType,
          state: body.state,
        });
        return NextResponse.json({ message: "NO", status: 200, newPlate });
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred. Please try again later" },
        { status: 500 },
      );
    }
  }
}
