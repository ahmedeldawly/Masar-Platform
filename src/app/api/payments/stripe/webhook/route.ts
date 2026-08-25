import { NextResponse } from "next/server";
import { finalizePayment } from "@/lib/payments";
import { verifyStripeWebhook } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse("Webhook is not configured", { status: 503 });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });
  try {
    const payload = await req.text();
    if (!verifyStripeWebhook(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)) return new NextResponse("Invalid webhook", { status: 400 });
    const event = JSON.parse(payload) as { type: string; data: { object: { id: string; payment_status?: string; metadata?: { paymentId?: string } } } };
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object;
      if (checkoutSession.payment_status === "paid" && checkoutSession.metadata?.paymentId) {
        await finalizePayment(checkoutSession.metadata.paymentId, checkoutSession.id);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new NextResponse("Invalid webhook", { status: 400 });
  }
}