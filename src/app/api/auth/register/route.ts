import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "EMAIL_ALREADY_EXISTS" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role,
        ...(role === "INSTRUCTOR" ? { instructorProfile: { create: {} } } : {}),
      },
    });

    // Generate an email verification token (real record, expires in 24h).
    // Actual email delivery (SMTP / provider) is wired up in Phase 2 —
    // for now the token is created and can be sent manually or logged.
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
