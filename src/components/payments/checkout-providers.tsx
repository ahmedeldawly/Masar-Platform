"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function CheckoutProviders() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";
  const courseName = searchParams.get("courseName") || "الدورة";
  const [provider, setProvider] = useState<"stripe" | "paymob">("stripe");
  const [amount, setAmount] = useState(Number(searchParams.get("amount") || 0));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider !== "stripe" || !courseId) return;
    setLoading(true);
    fetch("/api/payments/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId }) })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.message || payload.error || "تعذر تجهيز الدفع"); setAmount(payload.amount); if (payload.checkoutUrl) window.location.href = payload.checkoutUrl; })
      .catch((error) => setMessage(error instanceof Error ? error.message : "تعذر تجهيز الدفع"))
      .finally(() => setLoading(false));
  }, [courseId, provider]);

  async function startPaymob() {
    setLoading(true); setMessage("");
    try { const response = await fetch("/api/payments/paymob", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.message || payload.error || "تعذر تجهيز الدفع"); window.location.href = payload.iframeUrl; } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر تجهيز الدفع"); setLoading(false); }
  }

  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white" dir="rtl"><div className="mx-auto max-w-3xl"><Link href="/dashboard/courses" className="text-sm text-blue-300">العودة للكورسات</Link><div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6"><p className="text-sm text-slate-400">ملخص الطلب</p><h1 className="mt-2 text-3xl font-black">{courseName}</h1><p className="mt-3 text-2xl font-black text-emerald-300">{amount} EGP</p><div className="mt-6 flex gap-2"><button onClick={() => setProvider("stripe")} className={`rounded-xl px-4 py-2 text-sm ${provider === "stripe" ? "bg-blue-600" : "border border-slate-700"}`}>بطاقة Stripe</button><button onClick={() => setProvider("paymob")} className={`rounded-xl px-4 py-2 text-sm ${provider === "paymob" ? "bg-blue-600" : "border border-slate-700"}`}>Paymob</button></div><div className="mt-6">{provider === "stripe" ? <p className="text-sm text-slate-300">جاري فتح صفحة الدفع الآمنة من Stripe...</p> : <button onClick={startPaymob} disabled={loading} className="w-full rounded-xl bg-gradient-brand px-4 py-3 font-bold disabled:opacity-60">{loading ? "جاري التحويل..." : "المتابعة إلى Paymob"}</button>}</div>{message && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{message}</p>}</div></div></main>;
}