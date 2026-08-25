import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function PurchaseDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const payment = await prisma.payment.findFirst({ where: { id: params.id, userId: session.user.id }, include: { course: { select: { title: true, titleAr: true } }, invoice: true, user: { select: { fullName: true, email: true } } } });
  if (!payment) notFound();
  const title = payment.course.titleAr || payment.course.title;
  return <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8" dir="rtl"><div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-sm text-blue-300">تفاصيل العملية</p><h1 className="text-3xl font-black">فاتورة شراء الدورة</h1></div><Link href="/dashboard/purchases" className="text-sm text-blue-300">العودة للمشتريات</Link></div><section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6"><div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-2xl font-black">{title}</h2><p className="mt-2 text-sm text-slate-400">رقم الفاتورة: {payment.invoice?.invoiceNumber || "سيصدر بعد تأكيد الدفع"}</p></div><span className={`rounded-full px-3 py-1 text-sm ${payment.status === "PAID" ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>{payment.status === "PAID" ? "مدفوع" : "قيد التحقق"}</span></div><dl className="mt-6 grid gap-5 sm:grid-cols-2"><div><dt className="text-xs text-slate-400">المشتري</dt><dd className="mt-1">{payment.user.fullName}</dd></div><div><dt className="text-xs text-slate-400">البريد الإلكتروني</dt><dd className="mt-1">{payment.user.email}</dd></div><div><dt className="text-xs text-slate-400">المزود</dt><dd className="mt-1">{payment.provider}</dd></div><div><dt className="text-xs text-slate-400">تاريخ العملية</dt><dd className="mt-1">{payment.createdAt.toLocaleString("ar-EG")}</dd></div></dl><div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5"><span className="text-slate-300">الإجمالي</span><strong className="text-2xl text-emerald-300">{payment.amount.toString()} {payment.currency}</strong></div>{payment.status === "PAID" && <Link href={`/dashboard/courses/${payment.courseId}`} className="mt-6 block rounded-xl bg-gradient-brand px-4 py-3 text-center font-bold">الدخول إلى الدورة</Link>}</section></div></main>;
}