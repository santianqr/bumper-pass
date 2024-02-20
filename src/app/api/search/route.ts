import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

const symbolMap: { [key: string]: string } = {
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Inicia una nueva instancia del navegador
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = (await browser.pages())[0];

  if (!page) {
    console.log("No hay ninguna página abierta");
    return NextResponse.json({ message: "no" });
  }

  await page.goto("https://www.dmv.ca.gov/wasapp/ipp2/initPers.do", {
    waitUntil: "networkidle0",
  });
  await page.click("input#agree");
  (await page.$$("button"))[1]?.click() ??
    console.log("El segundo botón no existe");

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
    console.log("El segundo botón no existe");

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  let modifiedPlate = replaceSymbols(body.personalizedPlate);
  modifiedPlate = modifiedPlate.padEnd(7, " ");

  for (let i = 0; i < 7; i++) {
    const character = modifiedPlate[i];
    character
      ? await page.type(`input#plateChar${i}`, character)
      : console.log(`El carácter en la posición ${i} no está definido`);
  }

  (await page.$$("button"))[1]?.click() ??
    console.log("El segundo botón no existe");

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  const spanElement = await page.$(".progress__tooltip");

  console.log(spanElement);

  const cookies = await page.cookies();
  const cookiesString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  console.log(cookiesString);

  // await browser.close();

  return NextResponse.json({ message: "si" });
}