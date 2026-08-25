import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

const filters = ["الكل", "مهمة", "معلومة", "إنجاز"];

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">الإشعارات</p>
          <h1 className="text-3xl font-black text-white">آخر النشاطات</h1>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-sm text-blue-200">{notifications.filter((item) => !item.isRead).length} جديدة</span>
      </div>

      <section className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-2 text-sm transition ${
              index === 0
                ? "bg-gradient-brand text-white shadow-lg shadow-violet-500/20"
                : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="space-y-4">
        {notifications.length ? notifications.map((item) => (
          <div
            key={item.title}
            className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.74))] p-5 transition duration-200 hover:-translate-y-1 hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg ${
                    item.type === "ASSIGNMENT_GRADED" || item.type === "PAYMENT_SUCCESS"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : item.type === "COURSE_EXPIRING" || item.type === "PAYMENT_FAILED"
                        ? "bg-amber-500/10 text-amber-300"
                          : item.type === "GENERAL"
                          ? "bg-violet-500/10 text-violet-300"
                          : "bg-blue-500/10 text-blue-300"
                  }`}
                >
                  {item.type === "PAYMENT_SUCCESS" ? "✅" : item.type === "PAYMENT_FAILED" ? "⚠️" : "✨"}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">{item.title}</h2>
                  <p className="mt-2 text-slate-300">{item.body}</p>
                </div>
              </div>

              <span className="text-xs text-slate-400">{item.createdAt.toLocaleDateString("ar-EG")}</span>
            </div>
          </div>
        )) : <p className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">لا توجد إشعارات حتى الآن.</p>}
      </section>
    </main>
  );
}
