import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export function verifyCustomer(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_session")?.value;

    if (!token || !process.env.CUSTOMER_SESSION_SECRET) {
      return null;
    }

    const [payload, signature] = token.split(".");

    if (!payload || !signature) {
      return null;
    }

    const expectedSignature = createHmac(
      "sha256",
      process.env.CUSTOMER_SESSION_SECRET
    )
      .update(payload)
      .digest("base64url");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    if (
      session.role !== "customer" ||
      session.exp <= Date.now() ||
      !session.userId
    ) {
      return null;
    }

    return {
      userId: session.userId as string,
    };
  } catch {
    return null;
  }
}