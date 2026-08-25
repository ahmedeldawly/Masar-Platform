import crypto from "crypto";

const stripeApiUrl = "https://api.stripe.com/v1";

function authorizationHeader() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return `Bearer ${key}`;
}

export async function createStripeCheckoutSession(input: {
  amount: number;
  courseName: string;
  courseId: string;
  userId: string;
  paymentId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const form = new URLSearchParams({
    mode: "payment",
    "payment_method_types[0]": "card",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "egp",
    "line_items[0][price_data][unit_amount]": String(Math.round(input.amount * 100)),
    "line_items[0][price_data][product_data][name]": input.courseName,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    "metadata[courseId]": input.courseId,
    "metadata[userId]": input.userId,
    "metadata[paymentId]": input.paymentId,
  });
  const response = await fetch(`${stripeApiUrl}/checkout/sessions`, {
    method: "POST",
    headers: { Authorization: authorizationHeader(), "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!response.ok) throw new Error(`Stripe checkout failed: ${await response.text()}`);
  return response.json() as Promise<{ id: string; url: string | null }>;
}

export function verifyStripeWebhook(payload: string, signature: string, secret: string) {
  const values = Object.fromEntries(signature.split(",").map((part) => part.split("=", 2))) as Record<string, string>;
  if (!values.t || !values.v1) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${values.t}.${payload}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(values.v1));
}
