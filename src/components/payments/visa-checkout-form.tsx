"use client";

import { useState } from "react";

export function VisaCheckoutForm({
  courseId,
  amount,
}: {
  courseId: string;
  amount: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCheckout = async () => {
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
        throw new Error(payload?.error?.formErrors?.[0] || payload?.error || "فشل في الدفع");
      }

      setMessage(`تم الدفع بنجاح. رقم البطاقة: **** ${payload.lastFour}`);
      setForm({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ أثناء الدفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 w-full rounded-xl bg-gradient-brand px-4 py-3 text-sm font-bold text-white transition hover:opacity-95"
      >
        ابدأ الآن
      </button>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {open && (
        <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 className="mb-4 text-lg font-black text-white">الدفع ببطاقة فيزا</h3>
          <div className="space-y-3">
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="رقم البطاقة"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
            />
            <input
              name="cardName"
              value={form.cardName}
              onChange={handleChange}
              placeholder="اسم حامل البطاقة"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
              />
              <input
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="CVV"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-brand px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
            >
              {loading ? "جاري الدفع..." : `ادفع ${amount} EGP`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
