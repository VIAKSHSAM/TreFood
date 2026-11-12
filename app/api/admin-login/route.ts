import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";



const createSignature = (payload: string) => {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!)
    .update(payload)
    .digest("base64url");
};

const safeCompare = (a: string, b: string) => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return (
    bufferA.length === bufferB.length &&
    timingSafeEqual(bufferA, bufferB)
  );
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.ADMIN_SESSION_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Server configuration missing" },
        { status: 500 }
      );
    }

    if (
      !safeCompare(email || "", process.env.ADMIN_EMAIL) ||
      !safeCompare(password || "", process.env.ADMIN_PASSWORD)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const payload = Buffer.from(
      JSON.stringify({
        role: "admin",
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    ).toString("base64url");

    const signature = createSignature(payload);
    const token = `${payload}.${signature}`;

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}