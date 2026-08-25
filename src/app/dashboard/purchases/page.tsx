import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const payments = await prisma.payment.findMany({ where: { userId: session.user.id }, include: { course: { select: { title: true, titleAr: true } }, invoice: true }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8" dir="rtl"><div className="mx-auto max-w-5xl"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-blue-300">سجل المعاملات</p><h1 className="text-3xl font-black">مشترياتي وفواتيري</h1></div><Link href="/dashboard" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200">لوحة التحكم</Link></div><div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80"><div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-slate-800 px-5 py-4 text-xs text-slate-400"><span>الدورة</span><span>المبلغ</span><span>الحالة</span><span /></div>{payments.length ? payments.map((payment) => <div key={payment.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-slate-800/80 px-5 py-4 last:border-0"><span className="font-medium">{payment.course.titleAr || payment.course.title}</span><span className="text-sm text-slate-300">{payment.amount.toString()} {payment.currency}</span><span className={`text-sm ${payment.status === "PAID" ? "text-emerald-300" : payment.status === "PENDING" ? "text-amber-300" : "text-red-300"}`}>{payment.status === "PAID" ? "مدفوع" : payment.status === "PENDING" ? "قيد التحقق" : "غير مكتمل"}</span><Link href={`/dashboard/purchases/${payment.id}`} className="text-sm text-blue-300">التفاصيل</Link></div>) : <p className="p-8 text-center text-slate-400">لا توجد عمليات شراء بعد.</p>}</div></div></main>;
}