import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const checkoutSchema = z.object({
  courseId: z.string().min(1),
  amount: z.number().min(1),
  cardNumber: z.string().min(13).max(19),
  cardName: z.string().min(2),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/),
  cvv: z.string().regex(/^\d{3,4}$/),
});

export async function POST(req: Request) {
  return NextResponse.json({ error: "استخدم Stripe أو Paymob لإتمام الدفع" }, { status: 410 });
}
