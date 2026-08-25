import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createStripeCheckoutSession } from "@/lib/stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    if (session.user.role !== "STUDENT" && session.user.role !== "ADMIN") return NextResponse.json({ error: "فقط الطلاب يمكنهم الدفع" }, { status: 403 });
    const body = await req.json();
    const courseId = String(body?.courseId || "");
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== "PUBLISHED") return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
    const amount = Number(course.discountPrice ?? course.price);
    if (await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } })) {
      return NextResponse.json({ error: "أنت مسجل بالفعل في هذه الدورة" }, { status: 409 });
    }

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          success: false,
          provider: "stripe",
          message: "لم يتم إعداد مفتاح Stripe. أضف STRIPE_SECRET_KEY في ملف .env ثم أعد تشغيل الخادم.",
        },
        { status: 503 }
      );
    }

    const payment = await prisma.payment.create({
      data: { userId: session.user.id, courseId, provider: "STRIPE", providerRef: `pending-${randomUUID()}`, amount, currency: "EGP" },
    });

    const checkoutSession = await createStripeCheckoutSession({ amount, courseName: course.titleAr || course.title, courseId, userId: session.user.id, paymentId: payment.id, successUrl: `${process.env.NEXTAUTH_URL || new URL(req.url).origin}/dashboard/purchases/${payment.id}?success=1`, cancelUrl: `${process.env.NEXTAUTH_URL || new URL(req.url).origin}/checkout/failed` });
    await prisma.payment.update({ where: { id: payment.id }, data: { providerRef: checkoutSession.id } });

    return NextResponse.json({
      success: true,
      provider: "stripe",
      checkoutSessionId: checkoutSession.id,
      paymentId: payment.id,
      checkoutUrl: checkoutSession.url,
      status: "open",
      amount,
      currency: "EGP",
      message: "Stripe payment intent created successfully.",
    });
  } catch (error) {
    console.error("Stripe API error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
