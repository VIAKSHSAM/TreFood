import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHmac } from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";

const createSignature = (payload: string) => {
  return createHmac("sha256", process.env.CUSTOMER_SESSION_SECRET!)
    .update(payload)
    .digest("base64url");
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!process.env.CUSTOMER_SESSION_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server configuration missing" },
        { status: 500 }
      );
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload = Buffer.from(
      JSON.stringify({
        userId: user._id.toString(),
        role: "customer",
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    ).toString("base64url");

    const signature = createSignature(payload);
    const token = `${payload}.${signature}`;

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("customer_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}