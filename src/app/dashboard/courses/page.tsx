import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type CourseCard = {
  id: string;
  title: string;
  category: string;
  level: string;
  lessons: number;
  duration: string;
  rating: number;
  students: number;
  price: string;
  description: string;
};

const levelLabels = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
} as const;

const filters = ["الكل", "تصميم", "تطوير", "برمجة", "بيانات", "إدارة"]; 

export default async function CoursesPage() {
  const records = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      modules: { include: { lessons: { select: { id: true } } } },
      enrollments: { select: { id: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const courses: CourseCard[] = records.map((course) => ({
    id: course.id,
    title: course.titleAr || course.title,
    category: course.category.nameAr || course.category.name,
    level: levelLabels[course.level],
    lessons: course.modules.reduce((total, module) => total + module.lessons.length, 0),
    duration: `${course.durationHours} ساعة`,
    rating: course.reviews.length
      ? course.reviews.reduce((total, review) => total + review.rating, 0) / course.reviews.length
      : 0,
    students: course.enrollments.length,
    price: course.discountPrice?.toString() || course.price.toString(),
    description: course.descriptionAr || course.description,
  }));

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 md:px-6 md:py-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-blue-300">مكتبة المحتوى</p>
          <h1 className="text-3xl font-black text-white">إدارة الكورسات</h1>
        </div>
        <Link href="/dashboard" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-white transition hover:border-slate-600 hover:bg-slate-800">
          العودة للرئيسية ↩
        </Link>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-4 md:p-5">
          <p className="text-sm text-slate-400">إجمالي الدورات</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-3xl font-black text-white">{courses.length}</span>
            <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-200">📚</span>
          </div>
        </div>
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-4 md:p-5">
          <p className="text-sm text-slate-400">الطلاب النشطون</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-3xl font-black text-white">{courses.reduce((sum, course) => sum + (course.students || 0), 0).toLocaleString("ar-EG")}</span>
            <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-200">👥</span>
          </div>
        </div>
        <div className="soft-glow rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-4 md:p-5">
          <p className="text-sm text-slate-400">متوسط التقييم</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-3xl font-black text-white">
              {courses.length
                ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
                : "0.0"}
            </span>
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">⭐</span>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  index === 0
                    ? "bg-gradient-brand text-white shadow-lg shadow-violet-500/20"
                    : "border border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="w-full max-w-md">
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none ring-0"
              placeholder="بحث عن دورة..."
            />
          </div>
        </div>
      </section>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          لا توجد كورسات مضافة حالياً في قاعدة البيانات.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <div key={course.id} className="float-soft overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition hover:border-slate-700">
              <div className={`h-28 md:h-32 bg-gradient-to-br ${index % 3 === 0 ? "from-blue-600/45 via-violet-600/30 to-pink-500/20" : index % 3 === 1 ? "from-emerald-600/40 via-cyan-500/30 to-blue-600/20" : "from-fuchsia-600/40 via-violet-500/30 to-indigo-600/20"} p-3 md:p-4`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-900/60 px-2 py-1 text-xs text-blue-100">{course.category || "عام"}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">{course.level || "مبتدئ"}</span>
                </div>
                <div className="mt-7 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/60 text-lg text-white">
                  {index % 3 === 0 ? "💻" : index % 3 === 1 ? "🎨" : "🤖"}
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{course.lessons || 12} دروس</span>
                  <span>{course.duration || "4 أسابيع"}</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white">{course.title}</h3>
                <p className="mt-3 text-sm leading-6 md:leading-7 text-slate-400 max-h-[4.5rem] overflow-hidden">{course.description || "لا يوجد وصف لهذا الكورس"}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>⭐ {course.rating || 4.8}</span>
                  <span>{(course.students || 0).toLocaleString("ar-EG")} طالب</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-lg font-black text-emerald-400">{course.price ? `${course.price} EGP` : "مجاني"}</span>
                  <Link href={`/dashboard/courses/${course.id}`} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500">
                    تفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}