"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.error) {
        setServerError(
          res.error === "ACCOUNT_SUSPENDED"
            ? "تم إيقاف هذا الحساب. تواصل مع الدعم."
            : "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden overflow-hidden bg-gradient-brand p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_22%)]" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
                منصة Masar التعليمية
              </div>

              <h1 className="max-w-sm text-4xl font-black leading-tight text-white">
                ابدأ رحلتك نحو تعلم أكثر فاعلية.
              </h1>
              <p className="mt-4 max-w-md text-base leading-8 text-blue-50/80">
                تعلم من أفضل الخبراء، تابع تقدمك، واستفد من محتوى مصمم لتناسب أهدافك المهنية والشخصية.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                "تتبع التقدم الأسبوعي",
                "الوصول إلى محتوى مختار بعناية",
                "تجربة تعليمية احترافية وسريعة",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/10 px-4 py-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg">✓</span>
                  <span className="text-sm text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center bg-slate-950/70 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-right">
                <p className="text-sm font-medium text-blue-300">مرحباً بعودتك</p>
                <h2 className="mt-2 text-3xl font-black text-white">تسجيل الدخول</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {justRegistered && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    autoComplete="email"
                    className="input-field"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-pink-300">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm text-slate-300">
                      كلمة المرور
                    </label>
                    <Link href="/login" className="text-sm text-blue-300 transition hover:text-blue-200">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <input
                    id="password"
                    autoComplete="current-password"
                    className="input-field"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-pink-300">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                    تذكرني
                  </label>

                  <span className="text-xs text-slate-400">محمي وآمن</span>
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
                  {submitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-950 px-4 text-xs text-slate-400">أو</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  المتابعة بواسطة Google
                </button>

                <p className="text-center text-sm text-slate-300">
                  ليس لديك حساب؟{" "}
                  <Link href="/register" className="font-medium text-blue-300 transition hover:text-blue-200">
                    إنشاء حساب جديد
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
