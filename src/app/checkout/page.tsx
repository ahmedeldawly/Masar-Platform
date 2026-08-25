"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  isValidCvv,
  isValidExpiry,
  isValidVisaCardNumber,
  normalizeCardNumber,
} from "@/lib/payment";
import { CheckoutProviders } from "@/components/payments/checkout-providers";

function LegacyCheckoutPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";
  const courseName = searchParams.get("courseName") || "الدورة";
  const amount = Number(searchParams.get("amount") || 0);

  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "cardNumber") {
      const digits = normalizeCardNumber(value).slice(0, 16);
      setForm((current) => ({ ...current, cardNumber: digits.replace(/(.{4})/g, "$1 ").trim() }));
      return;
    }

    if (name === "expiry") {
      const cleaned = value.replace(/[^\d/]/g, "");
      const formatted = cleaned
        .replace(/^([0-9]{2})/, "$1/")
        .slice(0, 5);
      setForm((current) => ({ ...current, expiry: formatted }));
      return;
    }

    if (name === "cvv") {
      setForm((current) => ({ ...current, cvv: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!form.cardName.trim()) nextErrors.cardName = "اسم حامل البطاقة مطلوب";

    if (!isValidVisaCardNumber(form.cardNumber)) {
      nextErrors.cardNumber = "رقم بطاقة فيزا غير صحيح";
    }

    if (!isValidExpiry(form.expiry)) {
      nextErrors.expiry = "تاريخ انتهاء غير صحيح، مثال: 12/28";
    }

    if (!isValidCvv(form.cvv)) {
      nextErrors.cvv = "CVV غير صحيح، يجب أن يكون 3 أو 4 أرقام";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          amount,
          cardNumber: form.cardNumber,
          cardName: form.cardName,
          expiry: form.expiry,
          cvv: form.cvv,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const errorMessage =
          payload?.error?.formErrors?.[0] ||
          payload?.error ||
          "حدث خطأ أثناء الدفع";
        throw new Error(errorMessage);
      }

      setMessage(`تم الدفع بنجاح. رقم البطاقة: **** ${payload.lastFour}`);
      setForm({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
      window.location.href = "/checkout/success";
    } catch (error) {
      const text = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      setMessage(text);
      window.location.href = "/checkout/failed";
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-300">الدفع</p>
            <h1 className="text-3xl font-black text-white">بطاقة فيزا</h1>
          </div>
          <Link href="/dashboard/courses" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            العودة للكورسات
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.7))] p-6">
            <p className="text-sm text-slate-400">ملخص الطلب</p>
            <h2 className="mt-3 text-2xl font-black text-white">{courseName}</h2>
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>المبلغ</span>
                <span className="text-lg font-black text-emerald-300">{amount} EGP</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.72))] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 px-2 py-1 text-xs text-blue-200">Visa</div>
              <span className="text-sm text-slate-400">الدفع الآمن</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-slate-300">رقم البطاقة</label>
                <input
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-red-300">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">اسم حامل البطاقة</label>
                <input
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
                  placeholder="AHMED SABER"
                />
                {errors.cardName && <p className="mt-1 text-xs text-red-300">{errors.cardName}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">تاريخ الانتهاء</label>
                  <input
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    placeholder="MM/YY"
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-red-300">{errors.expiry}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">CVV</label>
                  <input
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    placeholder="123"
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-red-300">{errors.cvv}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-3 w-full rounded-xl bg-gradient-brand px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
              >
                {loading ? "جاري الدفع..." : `ادفع ${amount} EGP`}
              </button>

              {message && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <CheckoutProviders />
    </Suspense>
  );
}
