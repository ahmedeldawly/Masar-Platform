import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function finalizePayment(paymentId: string, providerRef: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { course: true, invoice: true },
    });

    if (!payment) throw new Error("PAYMENT_NOT_FOUND");
    if (payment.providerRef !== providerRef) throw new Error("PAYMENT_REFERENCE_MISMATCH");

    if (payment.status === PaymentStatus.PAID) return payment;
    if (payment.status !== PaymentStatus.PENDING) throw new Error("PAYMENT_NOT_PENDING");

    const verifiedAt = new Date();
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.PAID, webhookVerifiedAt: verifiedAt },
    });
    if (claimed.count === 0) return tx.payment.findUnique({ where: { id: payment.id }, include: { course: true, invoice: true } });
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      update: {},
      create: { userId: payment.userId, courseId: payment.courseId },
    });
    await tx.invoice.upsert({
      where: { paymentId: payment.id },
      update: {},
      create: {
        paymentId: payment.id,
        invoiceNumber: `MASAR-${payment.id.toUpperCase()}`,
      },
    });
    await tx.notification.create({
      data: {
        userId: payment.userId,
        type: "PAYMENT_SUCCESS",
        title: "تمت عملية الدفع بنجاح",
        body: `تم شراء الدورة ${payment.course.titleAr || payment.course.title} بنجاح.`,
      },
    });

    return tx.payment.findUnique({
      where: { id: payment.id },
      include: { course: true, invoice: true },
    });
  });
}

export function paymentProvider(value: "stripe" | "paymob") {
  return value === "stripe" ? PaymentProvider.STRIPE : PaymentProvider.PAYMOB;
}