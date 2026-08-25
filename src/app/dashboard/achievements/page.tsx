const achievements = [
  { title: "مبدئ ناجح", detail: "أكملت أول 3 دورات بنجاح", icon: "🏅", color: "bg-blue-500/10 text-blue-200" },
  { title: "سريع التعلّم", detail: "أنهيت 5 دروس خلال أسبوع واحد", icon: "⚡", color: "bg-violet-500/10 text-violet-200" },
  { title: "محترف واجهات", detail: "حصلت على تقييم أعلى من 4.8", icon: "🎨", color: "bg-pink-500/10 text-pink-200" },
  { title: "مستمر", detail: "استمرت في التعلم 30 يومًا متتاليًا", icon: "🔥", color: "bg-amber-500/10 text-amber-200" },
];

const streaks = [
  { label: "الخبرات المكتسبة", value: "124" },
  { label: "المشاريع المكتملة", value: "09" },
  { label: "الاختبارات المتقدمة", value: "17" },
  { label: "الإنجازات المفتوحة", value: "06" },
];

const milestones = [
  { name: "المرحلة 1", percent: 100, badge: "مكتمل" },
  { name: "المرحلة 2", percent: 80, badge: "قريب" },
  { name: "المرحلة 3", percent: 50, badge: "قيد التقدم" },
  { name: "المرحلة 4", percent: 30, badge: "مفتوح" },
];

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">الإنجازات</p>
          <h1 className="text-3xl font-black text-white">أهم إنجازاتك</h1>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200">مستوى ممتاز</span>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {achievements.map((achievement) => (
          <div key={achievement.title} className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6 text-center transition duration-200 hover:-translate-y-2 hover:border-violet-400/40">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${achievement.color}`}>
              {achievement.icon}
            </div>
            <h2 className="text-xl font-bold text-white">{achievement.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{achievement.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {streaks.map((item) => (
          <div key={item.label} className="soft-glow rounded-2xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-5 transition hover:-translate-y-1 hover:border-violet-400/40">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="soft-glow mt-8 rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-6">
        <h2 className="mb-5 text-xl font-bold text-white">مراحل التقدم</h2>
        <div className="space-y-5">
          {milestones.map((item) => (
            <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-violet-500/40">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-white">{item.name}</span>
                <span className="text-xs text-slate-400">{item.badge}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
