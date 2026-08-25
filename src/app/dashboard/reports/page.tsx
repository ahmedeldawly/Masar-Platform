import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [enrollments, completedLessons, submissions, attempts] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId: session.user.id }, select: { progressPct: true } }),
    prisma.lessonProgress.count({ where: { userId: session.user.id, isCompleted: true } }),
    prisma.submission.count({ where: { userId: session.user.id } }),
    prisma.quizAttempt.count({ where: { userId: session.user.id } }),
  ]);
  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((total, item) => total + item.progressPct, 0) / enrollments.length)
    : 0;
  const reportCards = [
    { label: "معدل الإنجاز", value: `${averageProgress}%`, tone: "blue" },
    { label: "الدروس المكتملة", value: completedLessons.toString(), tone: "violet" },
    { label: "الواجبات المسلمة", value: submissions.toString(), tone: "green" },
    { label: "الاختبارات", value: attempts.toString(), tone: "pink" },
  ];
  const summary = [
    { title: "التقدم العام", percent: averageProgress },
    { title: "الدروس المكتملة", percent: completedLessons ? 100 : 0 },
    { title: "التفاعل مع المحتوى", percent: enrollments.length ? averageProgress : 0 },
  ];
  const weeklyData = enrollments.length ? enrollments.map((item) => item.progressPct) : [0];
  const insights = [
    { label: "الكورسات المسجل بها", value: enrollments.length.toString() },
    { label: "الدروس المكتملة", value: completedLessons.toString() },
    { label: "الواجبات المسلمة", value: submissions.toString() },
  ];
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">التقارير</p>
          <h1 className="text-3xl font-black text-white">ملخص الأداء</h1>
        </div>
        <button className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition hover:translate-y-[-1px]">
          تصدير التقرير
        </button>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((item) => (
          <div key={item.label} className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-5 transition duration-200 hover:-translate-y-1 hover:border-slate-700">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">{item.label}</p>
              <span className={`rounded-full px-2 py-1 text-[10px] ${item.tone === "blue" ? "bg-blue-500/10 text-blue-200" : item.tone === "violet" ? "bg-violet-500/10 text-violet-200" : item.tone === "green" ? "bg-emerald-500/10 text-emerald-200" : "bg-pink-500/10 text-pink-200"}`}>
                {item.tone === "blue" ? "📈" : item.tone === "violet" ? "📚" : item.tone === "green" ? "✅" : "🎯"}
              </span>
            </div>
            <div className="text-3xl font-black text-white">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">النتائج الأسبوعية</h2>
            <span className="text-sm text-emerald-300">+12.4% مقارنة بالأسبوع السابق</span>
          </div>

          <div className="flex h-52 items-end gap-3">
            {weeklyData.map((bar, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-blue-500 via-violet-500 to-pink-400 transition-all duration-300 hover:brightness-110"
                  style={{ height: `${bar}%` }}
                />
                <span className="text-[10px] text-slate-400">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <h2 className="mb-5 text-xl font-bold text-white">رؤى مهمة</h2>
          <div className="space-y-4">
            {insights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-slate-900/80">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {summary.map((item) => (
          <div key={item.title} className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6 transition hover:-translate-y-1 hover:border-slate-700">
            <p className="text-sm text-slate-400">{item.title}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-3xl font-black text-white">{item.percent}%</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">مستوى جيد</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
