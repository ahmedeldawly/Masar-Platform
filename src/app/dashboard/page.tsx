import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [enrollments, lessonProgress, unreadNotifications] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            titleAr: true,
            modules: { include: { lessons: { select: { id: true } } } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 4,
    }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { isCompleted: true } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  const latestPurchase = await prisma.payment.findFirst({
    where: { userId, status: "PAID" },
    include: { course: { select: { title: true, titleAr: true } } },
    orderBy: { createdAt: "desc" },
  });

  const progress = enrollments.map((enrollment) => ({
    name: enrollment.course.titleAr || enrollment.course.title,
    percent: Math.round(enrollment.progressPct),
    lessons: `${Math.round((enrollment.progressPct / 100) * enrollment.course.modules.reduce((total, module) => total + module.lessons.length, 0))} من ${enrollment.course.modules.reduce((total, module) => total + module.lessons.length, 0)} درس`,
  }));
  const completedLessons = lessonProgress.filter((item) => item.isCompleted).length;
  const stats = [
    { label: "الكورسات الحالية", value: enrollments.length.toString().padStart(2, "0"), note: "مسجل بها", color: "blue" },
    { label: "الدروس المكتملة", value: completedLessons.toString(), note: "إجمالي إنجازك", color: "violet" },
    { label: "الإشعارات الجديدة", value: unreadNotifications.toString(), note: "تحتاج مراجعة", color: "green" },
    { label: "متوسط التقدم", value: enrollments.length ? `${Math.round(enrollments.reduce((sum, item) => sum + item.progressPct, 0) / enrollments.length)}%` : "0%", note: "في الكورسات", color: "pink" },
  ];
  const tasks: { title: string; time: string; tag: string }[] = [];
  const upcoming: { title: string; date: string; instructor: string }[] = [];

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">مرحبا بعودتك</p>
          <h1 className="text-3xl font-black text-white">{session?.user?.name || "المستخدم"}</h1>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          المستوى: متقدم
        </div>
      </div>

      {latestPurchase ? (
        <section className="mb-8 rounded-[28px] border border-emerald-500/30 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(15,23,42,0.95))] p-6 shadow-2xl shadow-emerald-950/20">
          <p className="text-sm text-emerald-300">تم شراء الدورة</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">{latestPurchase.course.titleAr || latestPurchase.course.title}</h2>
              <p className="mt-1 text-sm text-slate-300">المزود: {latestPurchase.provider}</p>
            </div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              {latestPurchase.amount.toString()} {latestPurchase.currency}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.7))] p-5 shadow-[0_18px_30px_rgba(2,6,23,0.28)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${stat.color === "blue" ? "bg-blue-500/10 text-blue-200" : stat.color === "violet" ? "bg-violet-500/10 text-violet-200" : stat.color === "green" ? "bg-emerald-500/10 text-emerald-200" : "bg-pink-500/10 text-pink-200"}`}>
                {stat.note}
              </span>
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.76))] p-6 shadow-[0_18px_30px_rgba(2,6,23,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">تقدمك في المسارات</h2>
            <a href="/dashboard/courses" className="text-sm text-blue-300">عرض الكل</a>
          </div>

          <div className="space-y-5">
            {progress.length ? progress.map((course) => (
              <div key={course.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{course.name}</h3>
                  <span className="text-sm text-slate-400">{course.lessons}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${course.percent}%` }} />
                </div>
                <div className="mt-2 text-left text-sm text-blue-300">{course.percent}%</div>
              </div>
            )) : <p className="text-sm text-slate-400">لم تسجل في أي كورس بعد.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.76))] p-6 shadow-[0_18px_30px_rgba(2,6,23,0.28)]">
          <h2 className="mb-5 text-xl font-bold text-white">مهام اليوم</h2>
          <div className="space-y-4">
            {tasks.length ? tasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">{task.tag}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{task.time}</p>
              </div>
            )) : <p className="text-sm text-slate-400">لا توجد مهام حالية.</p>}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.76))] p-6 shadow-[0_18px_30px_rgba(2,6,23,0.28)]">
          <h2 className="mb-5 text-xl font-bold text-white">الجلسات القادمة</h2>
          <div className="space-y-4">
            {upcoming.length ? upcoming.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.instructor}</p>
                </div>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{item.date}</span>
              </div>
            )) : <p className="text-sm text-slate-400">لا توجد جلسات مجدولة.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-blue-600/10 via-slate-900 to-violet-900/10 p-6 shadow-[0_18px_30px_rgba(2,6,23,0.28)]">
          <p className="text-sm text-blue-300">نصيحة اليوم</p>
          <h2 className="mt-2 text-2xl font-black text-white">استمر في التعلّم بشكل يومي</h2>
          <p className="mt-3 max-w-lg text-slate-300">
            ركّز على درس واحد كل يوم، ثم طبّق ما تعلمته في مشروع صغير لتثبيت المعلومات بسرعة أكبر.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/dashboard/courses" className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white">متابعة الدروس</a>
            <a href="/dashboard/achievements" className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">عرض الإنجازات</a>
          </div>
        </div>
      </section>
    </main>
  );
}
