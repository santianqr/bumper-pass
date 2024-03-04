import { NextResponse } from "next/server";
import * as puppeteer from "puppeteer";

let page: puppeteer.Page | undefined;
let browser: puppeteer.Browser | undefined;

export async function GET() {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        //headless: true,
        //executablePath: "/usr/bin/chromium",
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
    await page.select("select#vehicleType", "AUTO");
    await page.type("input#licPlateReplaced", "06405k2");
    await page.type("input#last3Vin", "802");
    await page.click("label[for=isRegExpire60N]");
    await page.click("label[for=isVehLeasedN]");
    await page.click(`label[for=plate_type_R]`);
    (await page.$$("button"))[1]?.click() ??
      console.log("The button does not exist");

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const modifiedPlate = "DONPERR";

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
      return NextResponse.json({
        message: "Error, spanELement is null.",
        status: 200,
      });
    } else {
      const cookies = await page.cookies();
      const cookiesString = cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
      console.log(cookiesString);
      return NextResponse.json({ message: cookiesString });
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
