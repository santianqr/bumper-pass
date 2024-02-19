import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = await fetch("https://www.dmv.ca.gov/wasapp/ipp2/initPers.do", {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    },
  });
  const data = await res.text();
  console.log(data);
  return NextResponse.json({ message: data });
}
