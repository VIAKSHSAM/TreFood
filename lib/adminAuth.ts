import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_session")?.value;

    if (!token || !process.env.ADMIN_SESSION_SECRET) {
      return false;
    }

    const [payload, signature] = token.split(".");

    if (!payload || !signature) {
      return false;
    }

    const expectedSignature = createHmac(
      "sha256",
      process.env.ADMIN_SESSION_SECRET
    )
      .update(payload)
      .digest("base64url");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return false;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    return session.role === "admin" && session.exp > Date.now();
  } catch {
    return false;
  }
}