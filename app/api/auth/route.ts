import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, MAX_COOKIE_AGE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (typeof password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    console.error("SITE_PASSWORD environment variable is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const isCorrect =
    password.trim().toLowerCase() === sitePassword.toLowerCase();

  if (!isCorrect) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_COOKIE_AGE,
    path: "/",
  });

  return response;
}
