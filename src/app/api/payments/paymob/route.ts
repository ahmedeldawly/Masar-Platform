import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const baseUrl = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    if (session.user.role !== "STUDENT" && session.user.role !== "ADMIN") return NextResponse.json({ error: "فقط الطلاب يمكنهم الدفع" }, { status: 403 });

    const { courseId } = await req.json();
    const course = await prisma.course.findUnique({ where: { id: String(courseId || "") } });
    if (!course || course.status !== "PUBLISHED") return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
    if (!process.env.PAYMOB_API_KEY || !process.env.PAYMOB_INTEGRATION_ID || !process.env.PAYMOB_IFRAME_ID) return NextResponse.json({ error: "Paymob غير مهيأ بالكامل", message: "أضف PAYMOB_API_KEY وPAYMOB_INTEGRATION_ID وPAYMOB_IFRAME_ID في ملف .env ثم أعد تشغيل الخادم." }, { status: 503 });
    if (await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } } })) return NextResponse.json({ error: "أنت مسجل بالفعل في هذه الدورة" }, { status: 409 });

    const amount = Number(course.discountPrice ?? course.price);
    const payment = await prisma.payment.create({
      data: { userId: session.user.id, courseId: course.id, provider: "PAYMOB", providerRef: `pending-${randomUUID()}`, amount, currency: "EGP" },
    });
    const authResponse = await fetch(`${baseUrl}/auth/tokens`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }) });
    if (!authResponse.ok) throw new Error("Paymob auth failed");
    const authPayload = await authResponse.json();
    const orderResponse = await fetch(`${baseUrl}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Token ${authPayload.token}` },
      body: JSON.stringify({ amount_cents: Math.round(amount * 100), currency: "EGP", merchant_order_id: `masar-${payment.id}`, items: [{ name: course.title, amount_cents: Math.round(amount * 100), quantity: 1 }] }),
    });
    if (!orderResponse.ok) throw new Error("Paymob order failed");
    const order = await orderResponse.json();
    await prisma.payment.update({ where: { id: payment.id }, data: { providerRef: String(order.id) } });

    const paymentKeyResponse = await fetch(`${baseUrl}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_token: authPayload.token, amount_cents: Math.round(amount * 100), expiration: 3600, order_id: order.id, billing_data: { apartment: "NA", email: session.user.email || "no-email@masar.dev", floor: "NA", first_name: session.user.name || "Masar", street: "NA", building: "NA", phone_number: "NA", shipping_method: "NA", postal_code: "NA", city: "NA", country: "EG", last_name: "Student", state: "NA" }, currency: "EGP", integration_id: Number(process.env.PAYMOB_INTEGRATION_ID) }),
    });
    if (!paymentKeyResponse.ok) throw new Error("Paymob payment key failed");
    const paymentKey = await paymentKeyResponse.json();
    return NextResponse.json({ success: true, paymentId: payment.id, amount, iframeUrl: `${baseUrl.replace(/\/api$/, "")}/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey.token}` });
  } catch (error) {
    console.error("Paymob API error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
