"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        setServerError("البريد الإلكتروني مستخدم بالفعل.");
        return;
      }
      if (!res.ok) {
        setServerError("حدث خطأ، حاول مرة أخرى.");
        return;
      }

      router.push("/login?registered=1");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden overflow-hidden bg-gradient-brand p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_22%)]" />
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
                انضم إلى Masar
              </div>
              <h1 className="max-w-xs text-4xl font-black leading-tight text-white">
                ابدأ رحلتك التعليمية بثقة.
              </h1>
              <p className="mt-4 max-w-md text-base leading-8 text-blue-50/80">
                اكتشف كورسات عملية، تابع تقدمك، وطور مهاراتك مع تجربة تعليمية قوية ومصممة لنجاحك.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                "تخصيص مسار تعليمي مناسب لك",
                "تتبع تقدمك في كل درس",
                "الوصول إلى محتوى احترافي ومتجدد",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/10 px-4 py-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg">✓</span>
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center bg-slate-950/70 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-lg">
              <div className="mb-8 text-center lg:text-right">
                <p className="text-sm font-medium text-blue-300">أنشئ حسابك</p>
                <h1 className="mt-2 text-3xl font-black text-white">إنشاء حساب جديد</h1>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    className="input-field"
                    placeholder="الاسم الكامل"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    className="input-field"
                    placeholder="رقم الهاتف (اختياري)"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">أنا:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-500/40">
                      <input type="radio" value="STUDENT" {...register("role")} defaultChecked />
                      <span>طالب</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-500/40">
                      <input type="radio" value="INSTRUCTOR" {...register("role")} />
                      <span>مدرب</span>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-pink-300">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="كلمة المرور"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 text-sm text-pink-200">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand w-full disabled:opacity-60"
                >
                  {submitting ? "جارٍ الإنشاء..." : "إنشاء حساب"}
                </button>

                <p className="text-center text-sm text-slate-300">
                  لديك حساب بالفعل؟{" "}
                  <a href="/login" className="font-medium text-blue-300 transition hover:text-blue-200">
                    تسجيل الدخول
                  </a>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
