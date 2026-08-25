import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { finalizePayment } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const { paymentIntentId } = await req.json();
    return NextResponse.json({ error: "استخدم Stripe Checkout وwebhook للتأكيد" }, { status: 410 });
  } catch (error) {
    console.error("Stripe confirmation error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}