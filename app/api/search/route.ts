import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const replaceSymbols = (text: string) => {
  //const symbols = ["♥️", "⭐️", "👆", "➕"];
  const symbols = ["❤", "⭐", "👆", "➕"];
  let newText = text;
  for (const symbol of symbols) {
    newText = newText.replace(new RegExp(symbol, "g"), "@");
  }
  return newText;
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    //const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.dmv.ca.gov/wasapp/ipp2/initPers.do");
    await page.click("input#agree");
    const buttons = await page.$$("button");
    await buttons[1].click();

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.select("select#vehicleType", body.vehicleType.toUpperCase());
    await page.type("input#licPlateReplaced", "06405k2");
    await page.type("input#last3Vin", "802");
    await page.click("label[for=isRegExpire60N]");
    await page.click("label[for=isVehLeasedN]");
    const symbols = ["❤", "⭐", "👆", "➕"];
    const symbolMap: { [key: string]: string } = {
      "❤": "heart",
      "⭐": "star",
      "👆": "hand",
      "➕": "plus",
    };
    console.log(body.personalizedPlate);
    let hasSymbol = false;
    for (const symbol of symbols) {
      if (body.personalizedPlate.includes(symbol)) {
        hasSymbol = true;
        await page.click(`label[for=plate_type_K]`);
        await page.select("select#kidsPlate", symbolMap[symbol]);
        break;
      }
    }

    if (!hasSymbol) {
      await page.click(`label[for=plate_type_R]`);
    }

    const buttons_new = await page.$$("button");
    await buttons_new[1].click();

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    let modifiedPlate = replaceSymbols(body.personalizedPlate);
    modifiedPlate = modifiedPlate.padEnd(7, " ");

    await page.type("input#plateChar0", modifiedPlate[0]);
    await page.type("input#plateChar1", modifiedPlate[1]);
    await page.type("input#plateChar2", modifiedPlate[2]);
    await page.type("input#plateChar3", modifiedPlate[3]);
    await page.type("input#plateChar4", modifiedPlate[4]);
    await page.type("input#plateChar5", modifiedPlate[5]);
    await page.type("input#plateChar6", modifiedPlate[6]);

    const buttons_new2 = await page.$$("button");
    await buttons_new2[1].click();

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const spanElement = await page.$(".progress__tooltip");
    if (spanElement === null) {
      await browser.close();
      return NextResponse.json({ message: "NO", status: 200 });
    } else {
      const spanText = await spanElement.getProperty("textContent");
      const text = await spanText.jsonValue();
      await browser.close();
      if (text === "Progress: 30%") {
        return NextResponse.json({ message: "OK", status: 200 });
      } else {
        return NextResponse.json({ message: "NO", status: 200 });
      }
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
