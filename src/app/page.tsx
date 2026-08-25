import Link from "next/link";

const stats = [
  { label: "+12k", value: "طالب نشط" },
  { label: "180+", value: "دورة" },
  { label: "4.9/5", value: "تقييم" },
];

const features = [
  { title: "مسارات تعليمية مرنة", desc: "تعلّم بالوتيرة المناسبة لك عبر دورات منظمة وجاهزة للتطبيق." },
  { title: "مدرسون خبراء", desc: "تواصل مع محترفين في مجالاتهم ومتابعة تقدمك خطوة بخطوة." },
  { title: "شهادة معتمدة", desc: "احصل على شهادات تبرز مهاراتك وتدعم فرصك المهنية." },
];

const learningTracks = [
  "Frontend Development",
  "UI/UX Design",
  "Python & AI",
  "Digital Marketing",
];

const courses = [
  { title: "Next.js للمبتدئين", lessons: "15 درس", rating: "4.9", level: "مبتدئ" },
  { title: "تصميم واجهات احترافية", lessons: "12 درس", rating: "4.8", level: "متوسط" },
  { title: "Python للذكاء الاصطناعي", lessons: "18 درس", rating: "4.9", level: "متقدم" },
];

const steps = [
  { number: "1", title: "اختر مسارك", text: "تصفح المسارات المناسبة لاحتياجاتك وفرصك المستقبلية." },
  { number: "2", title: "تعلّم عمليًا", text: "تابع دروسًا مصممة لتطبيق المهارات مباشرة في المشاريع." },
  { number: "3", title: "ارتقِ بمستواك", text: "حقق الشهادات وانجز المهام لتطوير مهاراتك بثقة." },
];

const testimonials = [
  { name: "مستخدم جديد", role: "طالب", quote: "المنصة سهلة الاستخدام ومناسبة جدًا للتعلم المنظم في وقتي." },
  { name: "عضو من المنصة", role: "مدرب", quote: "أحببت طريقة تنظيم الدروس ومتابعة التقدم بشكل واضح واحترافي." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-violet-500/50" dir="rtl">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.30),transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.28),transparent_38%)]" />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-10 top-32 h-24 w-24 rounded-full border border-blue-400/30 bg-blue-500/5 float-soft" />
        <div className="absolute left-16 bottom-20 h-20 w-20 rounded-full border border-violet-400/30 bg-violet-500/5 float-soft" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10">
          <header className="sticky top-4 z-50 mb-14 flex items-center justify-between rounded-full border border-white/10 bg-slate-900/70 px-5 py-3 shadow-[0_0_30px_rgba(15,23,42,0.7)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-lg font-black shadow-lg shadow-violet-500/25">م</div>
              <div>
                <p className="text-lg font-bold">منصة مسار</p>
              </div>
            </div>
            <nav className="hidden items-center gap-2 text-sm text-slate-200 md:flex">
              <Link href="/dashboard" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">لوحة التحكم</Link>
              <Link href="/dashboard/courses" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">الكورسات</Link>
              <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">تسجيل الدخول</Link>
            </nav>
            <Link href="/register" className="btn-brand transition hover:-translate-y-0.5">ابدأ الآن</Link>
          </header>

          <div className="grid items-center gap-10 pb-6 md:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                منصة تعليمية حديثة
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                تعلّم <span className="bg-gradient-brand bg-clip-text text-transparent">بذكاء</span>
                <br />
                وابنِ مستقبلك.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                اكتشف دورات عملية، متابعة متقدمة، ومنصة تدعم رحلتك التعليمية من البداية إلى الاحتراف.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dashboard/courses" className="btn-brand">
                  استكشف الكورسات
                </Link>
                <Link href="/login" className="glass-card px-6 py-3 text-white transition hover:border-violet-400/40 hover:bg-white/10">
                  تسجيل الدخول
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {learningTracks.map((track) => (
                  <span key={track} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 shadow-sm shadow-slate-950/40">
                    {track}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {stats.map((item) => (
                  <div key={item.label} className="soft-glow rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/10 hover:shadow-[0_18px_35px_rgba(139,92,246,0.18)]">
                    <div className="text-xl font-bold text-white">{item.label}</div>
                    <div className="mt-1 text-xs text-slate-300">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-card pulse-glow relative overflow-hidden p-6 shadow-[0_30px_80px_rgba(76,29,149,0.28)]">
                <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-pink-500/20 blur-2xl" />
                <div className="relative space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm text-slate-400">مسارك الحالي</p>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">Live</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-bold text-white">تطوير الواجهة الأمامية</h3>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[78%] rounded-full bg-gradient-brand" />
                    </div>
                    <div className="mt-3 flex justify-between text-xs text-slate-300">
                      <span>78% مكتمل</span>
                      <span>12 من 15 درس</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">الأسبوع الحالي</p>
                      <p className="mt-2 text-3xl font-black text-white">4</p>
                      <p className="mt-1 text-xs text-emerald-300">مبادرات جديدة</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">الإنجاز</p>
                      <p className="mt-2 text-3xl font-black text-white">12</p>
                      <p className="mt-1 text-xs text-violet-300">مهام مكتملة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-300">ماذا يميزنا؟</p>
          <h2 className="mt-2 text-3xl font-bold text-white">رحلة تعلم مصممة لتطورك</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={feature.title} className="soft-glow glass-card p-6 text-right transition duration-200 hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-[0_20px_45px_rgba(79,70,229,0.25)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-lg font-bold">
                {index === 0 ? "⚡" : index === 1 ? "👩‍🏫" : "🏅"}
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-3 text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-300">الدورات الشائعة</p>
            <h2 className="mt-2 text-3xl font-bold text-white">اختر ما يناسبك</h2>
          </div>
          <Link href="/dashboard/courses" className="text-sm text-blue-300">عرض الكل</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course, index) => (
            <div key={course.title} className="float-soft overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-[0_25px_55px_rgba(139,92,246,0.22)]">
              <div className={`h-36 bg-gradient-to-br ${index === 0 ? "from-blue-600/50 via-violet-600/30 to-pink-500/20" : index === 1 ? "from-emerald-600/40 via-cyan-500/30 to-blue-600/20" : "from-fuchsia-600/40 via-violet-500/30 to-indigo-600/20"} p-3 md:p-4`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-900/60 px-2 py-1 text-xs text-blue-100">{course.level}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white">⭐ {course.rating}</span>
                </div>
                <div className="mt-9 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/60 text-lg text-white">
                  {index === 0 ? "💻" : index === 1 ? "🎨" : "🤖"}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                  <span>{course.level}</span>
                  <span>⭐ {course.rating}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{course.lessons}</p>
                <div className="mt-5 flex items-center justify-between">
                  <button className="rounded-xl bg-gradient-brand px-3 py-2 text-sm font-medium text-white">ابدأ الآن</button>
                  <span className="text-sm text-blue-200">مميز</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-300">كيف تبدأ؟</p>
          <h2 className="mt-2 text-3xl font-bold text-white">ثلاث خطوات فقط</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="soft-glow rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-lg font-black text-white">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-300">آراء الطلاب</p>
          <h2 className="mt-2 text-3xl font-bold text-white">ماذا يقول المتعلمون؟</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.name} className="soft-glow rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg leading-8 text-slate-200">“{item.quote}”</p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <h4 className="font-bold text-white">{item.name}</h4>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
        <div className="rounded-[32px] border border-blue-500/20 bg-gradient-to-r from-blue-600/15 via-violet-600/10 to-pink-600/15 p-8 text-center backdrop-blur-md">
          <p className="text-sm text-blue-200">ابدأ رحلتك الآن</p>
          <h2 className="mt-3 text-3xl font-black text-white">أنشئ حسابك وابدأ التعلم اليوم</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-brand">إنشاء حساب</Link>
            <Link href="/login" className="glass-card px-6 py-3 text-white hover:bg-white/10">تسجيل الدخول</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 منصة مسار</p>
          <div className="flex gap-5">
            <Link href="/dashboard" className="hover:text-white">لوحة التحكم</Link>
            <Link href="/dashboard/courses" className="hover:text-white">الكورسات</Link>
            <Link href="/login" className="hover:text-white">الدخول</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
