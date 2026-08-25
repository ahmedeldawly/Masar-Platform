import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { enrollments: { include: { course: true }, orderBy: { enrolledAt: "desc" } } },
  });
  if (!user) redirect("/login");

  const averageProgress = user.enrollments.length
    ? Math.round(user.enrollments.reduce((total, item) => total + item.progressPct, 0) / user.enrollments.length)
    : 0;
  const profileStats = [
    { label: "الإنجاز الكلي", value: `${averageProgress}%` },
    { label: "المسارات المسجل بها", value: user.enrollments.length.toString().padStart(2, "0") },
    { label: "عضو منذ", value: user.createdAt.toLocaleDateString("ar-EG") },
  ];
  const skills: string[] = [];
  const achievements = averageProgress >= 100
    ? [{ title: "أكملت جميع المسارات", color: "bg-emerald-500/10 text-emerald-200" }]
    : [];
  const courseProgress = user.enrollments.map((enrollment) => ({
    title: enrollment.course.titleAr || enrollment.course.title,
    progress: Math.round(enrollment.progressPct),
    weeks: `${Math.round(enrollment.progressPct)}% مكتمل`,
  }));
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-300">ملفي الشخصي</p>
          <h1 className="text-3xl font-black text-white">معلومات الطالب</h1>
        </div>
        <button className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20">
          تعديل الملف
        </button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-black text-white shadow-lg shadow-violet-500/20">
              م
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
              <p className="text-slate-400">{user.role === "INSTRUCTOR" ? "مدرب" : "طالب"} / عضو المنصة</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {profileStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-400/40 hover:bg-slate-900/80">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-300">مستوى التقدم</p>
              <span className="text-sm text-emerald-300">{averageProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${averageProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <h2 className="text-xl font-bold text-white">نبذة مختصرة</h2>
          <p className="mt-4 text-slate-300 leading-8">
            أعمل على تطوير واجهات مستخدم حديثة، وأهتم بتجربة المستخدم، وتحسين الأداء، وبناء منتجات تعليمية تفاعلية احترافية.
          </p>

          <div className="mt-6">
            <h3 className="mb-3 text-lg font-bold text-white">المهارات</h3>
            <div className="flex flex-wrap gap-2">
              {skills.length ? skills.map((skill) => (
                <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200">
                  {skill}
                </span>
              )) : <p className="text-sm text-slate-400">لم تتم إضافة مهارات بعد.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <h2 className="text-xl font-bold text-white">التقدم في المسارات</h2>
          <div className="mt-5 space-y-5">
            {courseProgress.length ? courseProgress.map((course) => (
              <div key={course.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-slate-900/80">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{course.title}</span>
                  <span className="text-sm text-blue-300">{course.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${course.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{course.weeks}</p>
              </div>
            )) : <p className="text-sm text-slate-400">لم تسجل في أي كورس بعد.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
            <h2 className="text-xl font-bold text-white">الإنجازات</h2>
            <div className="mt-5 space-y-3">
              {achievements.length ? achievements.map((item) => (
                <div key={item.title} className={`rounded-2xl px-4 py-3 text-sm font-medium ${item.color}`}>
                  {item.title}
                </div>
              )) : <p className="text-sm text-slate-400">لا توجد إنجازات مكتسبة بعد.</p>}
            </div>
          </div>

          <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
            <h2 className="text-xl font-bold text-white">معلومات التواصل</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span>البريد</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span>الهاتف</span>
                <span>{user.phone || "غير مضاف"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>المدينة</span>
                <span>المدينة الحالية</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
