"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InstructorCourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "0",
    durationHours: "4",
    level: "BEGINNER",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price || 0),
          durationHours: Number(form.durationHours || 0),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "فشل في إنشاء الدورة");
      }

      setOpen(false);
      setForm({ title: "", description: "", price: "0", durationHours: "4", level: "BEGINNER" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
      >
        + إضافة كورس جديد
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">إضافة كورس جديد</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
              >
                إغلاق
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-slate-300">عنوان الكورس</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500"
                  placeholder="مثال: مقدمة للتصميم الرقمي"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">الوصف</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500"
                  placeholder="اكتب وصفاً واضحاً للطالب عن محتوى الكورس"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">السعر</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">المدة (ساعة)</label>
                  <input
                    name="durationHours"
                    value={form.durationHours}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">المستوى</label>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0"
                  >
                    <option value="BEGINNER">مبتدئ</option>
                    <option value="INTERMEDIATE">متوسط</option>
                    <option value="ADVANCED">متقدم</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "جاري الإنشاء..." : "إنشاء الكورس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
