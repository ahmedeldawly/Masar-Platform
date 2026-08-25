const metrics = [
  { label: "إجمالي الطلاب", value: "12.4K", delta: "+8.2%", tone: "blue" },
  { label: "عدد الدورات", value: "186", delta: "+14", tone: "violet" },
  { label: "الإيرادات", value: "$24.8K", delta: "+9.4%", tone: "green" },
  { label: "الطلبات قيد المراجعة", value: "31", delta: "7 اليوم", tone: "amber" },
];

const approvals = [
  { name: "دورة UI Mastery", type: "مراجعة محتوى", time: "قبل 2 ساعة" },
  { name: "مادة JavaScript Advanced", type: "إدارة مدرس", time: "قبل 4 ساعات" },
  { name: "تسجيل جديد", type: "إدارة حسابات", time: "قبل 5 ساعات" },
];

const activities = [
  { name: "مستخدم جديد", action: "سجل حساباً جديداً", time: "منذ 8 دقائق" },
  { name: "طالب", action: "اشتراك في دورة تدريبية", time: "منذ 22 دقيقة" },
  { name: "متدرب", action: "أكمل اختباراً نهائياً", time: "منذ ساعة" },
  { name: "عضو", action: "تقدم بطلب استفسار", time: "منذ 3 ساعات" },
];

const revenue = [42, 55, 48, 70, 68, 82, 94];

const courses = [
  { title: "Next.js للمبتدئين", students: "2.4K", status: "نشط" },
  { title: "أساسيات UX Design", students: "1.8K", status: "نشط" },
  { title: "AI Essentials", students: "1.1K", status: "قيد المراجعة" },
  { title: "Python Basics", students: "2.9K", status: "نشط" },
];

const team = [
  { name: "فريق المحتوى", role: "إدارة المحتوى", score: "92%" },
  { name: "فريق التدريب", role: "إدارة البرامج", score: "88%" },
  { name: "فريق الدعم", role: "الدعم والاتصال", score: "95%" },
];

const quickActions = [
  { label: "إضافة دورة جديدة", icon: "＋" },
  { label: "إدارة المدرسين", icon: "👥" },
  { label: "إعدادات المنصة", icon: "⚙️" },
  { label: "إرسال إشعار", icon: "✉️" },
];

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">لوحة تحكم الإدارة</p>
          <h1 className="mt-2 text-3xl font-black text-white">إحصائيات المنصة</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
            تقرير سريع
          </button>
          <button className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-950/40">
            تصدير التقرير
          </button>
        </div>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  item.tone === "blue"
                    ? "bg-blue-500/10 text-blue-200"
                    : item.tone === "violet"
                      ? "bg-violet-500/10 text-violet-200"
                      : item.tone === "green"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-amber-500/10 text-amber-200"
                }`}
              >
                {item.delta}
              </span>
            </div>
            <div className="mt-5 text-3xl font-black text-white">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="soft-glow rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 text-right transition duration-200 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-slate-800/90"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-lg text-white">
              {action.icon}
            </div>
            <span className="text-sm text-slate-200">{action.label}</span>
          </button>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">إيرادات المنصة</h2>
            <span className="text-sm text-emerald-300">+12.4% هذا الشهر</span>
          </div>

          <div className="flex h-52 items-end gap-3">
            {revenue.map((bar, index) => (
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
          <h2 className="mb-5 text-xl font-bold text-white">آخر النشاطات</h2>
          <div className="space-y-4">
            {activities.map((item) => (
              <div key={item.name + item.time} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{item.name}</span>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">طلبات المراجعة</h2>
            <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200">
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            {approvals.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-slate-900/80">
                <div>
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.type}</p>
                </div>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
          <h2 className="mb-5 text-xl font-bold text-white">أفضل الفرق</h2>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-slate-400">{member.role}</p>
                  </div>
                  <span className="text-sm text-emerald-300">{member.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="soft-glow mt-8 rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">إدارة الدورات</h2>
          <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white">إضافة دورة</button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full text-right text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400">
              <tr>
                <th className="px-4 py-3">اسم الدورة</th>
                <th className="px-4 py-3">الطلاب</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.title} className="border-t border-slate-800 transition hover:bg-slate-900/60">
                  <td className="px-4 py-3 text-white">{course.title}</td>
                  <td className="px-4 py-3">{course.students}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        course.status === "نشط"
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-300 hover:text-blue-200">تعديل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
