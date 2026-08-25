import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { finalizePayment } from "@/lib/payments";
import { verifyPaymobHmac } from "@/lib/paymob";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const providerRef = params.order;
  const payment = await prisma.payment.findFirst({ where: { providerRef } });
  const valid = !!payment && params.success === "true" && verifyPaymobHmac(params);
  if (valid) await finalizePayment(payment.id, providerRef);
  return NextResponse.redirect(new URL(valid ? `/dashboard/purchases/${payment.id}` : "/checkout/failed", req.url));
}