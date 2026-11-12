import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyCustomer } from "@/lib/customerAuth";

export async function GET(request: NextRequest) {
  try {
    const session = verifyCustomer(request);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId).select(
      "_id name email"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to verify session" },
      { status: 500 }
    );
  }
}