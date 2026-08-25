"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

const linkClass = (active: boolean) =>
  [
    "group flex items-center justify-between rounded-2xl px-3 py-3 text-right text-sm font-medium transition-all duration-200",
    active
      ? "bg-gradient-to-r from-blue-600/25 to-violet-600/25 text-blue-100 ring-1 ring-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.14)]"
      : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
  ].join(" ");

export function DashboardSidebar({
  role,
  userName,
  children,
}: {
  role?: string;
  userName?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    {
      group: "الأساسية",
      links: [
        { href: "/dashboard", label: "لوحة التحكم", icon: "📊" },
        { href: "/dashboard/courses", label: "الكورسات", icon: "🎓" },
        { href: "/dashboard/purchases", label: "مشترياتي", icon: "🧾" },
        { href: "/dashboard/profile", label: "ملفي", icon: "👤" },
        { href: "/dashboard/achievements", label: "الإنجازات", icon: "🏆" },
        { href: "/instructor", label: "لوحة المدرس", icon: "🎯", instructorOnly: true },
      ],
    },
    {
      group: "التحليلات",
      links: [
        { href: "/dashboard/reports", label: "التقارير", icon: "📈" },
        { href: "/dashboard/notifications", label: "الإشعارات", icon: "🔔" },
      ],
    },
    {
      group: "أخرى",
      links: [
        { href: "/", label: "الرئيسية", icon: "🏠" },
        { href: "/admin", label: "لوحة المسؤول", icon: "⚙️", adminOnly: true },
        { href: "/login", label: "تسجيل الدخول", icon: "🔐" },
        { href: "/register", label: "إنشاء حساب", icon: "✨" },
      ],
    },
  ];

  const AsideContent = () => (
    <aside className="h-screen w-72 shrink-0 border-l border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-5 shadow-[0_0_35px_rgba(15,23,42,0.55)] backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs text-slate-400">منصة مسار</p>
          <h2 className="mt-1 text-xl font-black text-white">Masar</h2>
        </div>
        <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-200">
          {role || "STUDENT"}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-700/80 bg-[linear-gradient(135deg,rgba(30,41,59,0.9),rgba(15,23,42,0.95))] p-4 shadow-inner shadow-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand text-sm font-black text-white shadow-lg shadow-violet-500/20">
            {userName?.charAt(0) || "م"}
          </div>
          <div>
            <p className="text-xs text-slate-400">مرحباً</p>
            <p className="mt-1 text-base font-semibold text-white">{userName || "المستخدم"}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
          <span>المستوى الحالي</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">متقدم</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2">
        <Link href="/dashboard/courses" className="rounded-xl bg-gradient-brand px-3 py-2 text-center text-sm font-medium text-white shadow-lg shadow-violet-500/20">
          جديد
        </Link>
        <Link href="/dashboard/reports" className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-center text-sm text-slate-200 hover:border-slate-600">
          تقارير
        </Link>
      </div>

      <nav className="space-y-5">
        {items.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-2 text-[11px] font-medium tracking-[0.2em] text-slate-500">
              {group.group}
            </p>
            <div className="space-y-2">
              {group.links
                .filter((item) => {
                  if (item.adminOnly && role !== "ADMIN") return false;
                  if (item.instructorOnly && role !== "INSTRUCTOR" && role !== "ADMIN") return false;
                  return true;
                })
                .map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link key={item.href} href={item.href} className={linkClass(active)}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 text-base text-white ring-1 ring-slate-700/70 group-hover:bg-slate-700/80">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs text-slate-400">التقدم هذا الأسبوع</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl font-black text-white">72%</span>
          <span className="text-xs text-emerald-300">+12%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[72%] rounded-full bg-gradient-brand" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-8 flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900/75 px-3 py-3 text-sm text-slate-200 transition hover:border-red-500/40 hover:text-red-300"
      >
        <span>🚪</span>
        <span>تسجيل الخروج</span>
      </button>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white" dir="rtl">
      <div className="hidden md:block">
        <AsideContent />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative ml-auto">
            <AsideContent />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_20%),#020817]">
        <div className="p-3 md:hidden">
          <button
            aria-label="فتح القائمة"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
          >
            ☰ القائمة
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
