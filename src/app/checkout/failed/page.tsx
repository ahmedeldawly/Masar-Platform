import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white" dir="rtl">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-red-500/30 bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(15,23,42,0.95))] p-8 text-center shadow-2xl shadow-red-950/20">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-4xl">⚠️</div>
        <p className="text-sm text-red-300">فشل في الدفع</p>
        <h1 className="mt-3 text-4xl font-black text-white">تعذر إتمام عملية الدفع</h1>
        <p className="mt-4 text-slate-300">يرجى التحقق من بيانات البطاقة أو المحاولة مرة أخرى بعد قليل.</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/courses" className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200">
            العودة إلى الكورسات
          </Link>
          <Link href="/checkout" className="rounded-xl bg-gradient-brand px-5 py-3 text-sm font-bold text-white">
            إعادة المحاولة
          </Link>
        </div>
      </div>
    </main>
  );
}
