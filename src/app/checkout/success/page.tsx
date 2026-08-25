import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white" dir="rtl">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-emerald-500/30 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),rgba(15,23,42,0.95))] p-8 text-center shadow-2xl shadow-emerald-950/20">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-4xl">✅</div>
        <p className="text-sm text-emerald-300">تم الدفع بنجاح</p>
        <h1 className="mt-3 text-4xl font-black text-white">تم شراء الدورة بنجاح</h1>
        <p className="mt-4 text-slate-300">يمكنك الآن الدخول إلى الدورة من مكتبة الكورسات ومتابعة تقدمك.</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/courses" className="rounded-xl bg-gradient-brand px-5 py-3 text-sm font-bold text-white">
            الذهاب إلى الكورسات
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </main>
  );
}
