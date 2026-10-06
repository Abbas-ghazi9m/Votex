import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySiweSignature } from "@/lib/auth/siwe";

const VerifyBodySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, "Invalid ECDSA signature format"),
  message: z.string().min(10, "Message cannot be empty"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VerifyBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { address, signature, message } = parsed.data;
    const result = await verifySiweSignature({
      address,
      signature: signature as `0x${string}`,
      message,
    });

    if (!result.success || !result.sessionToken) {
      return NextResponse.json(
        { error: result.error || "Authentication signature check failed" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      address,
      sessionToken: result.sessionToken,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("votex_session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
