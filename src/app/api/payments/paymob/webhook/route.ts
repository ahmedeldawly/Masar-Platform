import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import { finalizePayment } from "@/lib/payments";
import { verifyPaymobHmac } from "@/lib/paymob";

export async function POST(req: Request) {
  try {
    const transaction = await req.json();
    const params = { ...transaction, order: String(transaction.order?.id ?? transaction.order ?? ""), "source_data.pan": transaction.source_data?.pan ?? "", "source_data.sub_type": transaction.source_data?.sub_type ?? "", "source_data.type": transaction.source_data?.type ?? "" } as Record<string, string>;
    if (!verifyPaymobHmac(params) || transaction.success !== true) return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    const payment = await prisma.payment.findFirst({ where: { providerRef: params.order } });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    await finalizePayment(payment.id, params.order);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paymob webhook error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 400 });
  }
}