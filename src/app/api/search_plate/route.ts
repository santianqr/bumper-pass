import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = await fetch("https://www.dmv.ca.gov/wasapp/ipp2/initPers.do", {
    method: "GET",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Referer:
        "https://www.dmv.ca.gov/portal/vehicle-registration/license-plates-decals-and-placards/california-license-plates/order-special-interest-and-personalized-license-plates/",
      "Sec-Fetch-Site": "same-origin",
      Origin: "https://www.dmv.ca.gov",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "max-age=0",
    },
  });
  const cookies = res.headers.get("Set-Cookie");
  console.log(cookies);

  const details = {
    acknowledged: "true",
    _acknowledged: "on",
  };

  const formBody = Object.keys(details)
    .map(
      (key) =>
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(details[key as keyof typeof details]),
    )
    .join("&");

  const res2 = await fetch("https://www.dmv.ca.gov/wasapp/ipp2/startPers.do", {
    method: "POST",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Referer: "https://www.dmv.ca.gov/wasapp/ipp2/initPers.do",
      "Sec-Fetch-Site": "same-origin",
      Origin: "https://www.dmv.ca.gov",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies || "",
    },
    body: formBody,
    credentials: "include",
  });
  const htmlResponse = await res2.text();
  console.log(htmlResponse);

  return NextResponse.json({ message: "si" });
}
