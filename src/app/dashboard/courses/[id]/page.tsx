import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

const fallbackDetails = {
  id: "1",
  title: "أساسيات UX Design",
  category: "تصميم",
  level: "مبتدئ",
  lessons: 12,
  duration: "4 أسابيع",
  rating: 4.9,
  students: 2400,
  price: "299",
  description:
    "دورة عملية ومبسطة لتعلم أساسيات تجربة المستخدم وتصميم الواجهات الحديثة، مع تطبيقات عملية على المشاريع الحقيقية.",
  instructor: "أحمد علي",
  lastUpdated: "منذ 3 أسابيع",
  audience: ["المبتدئين", "مصممي الواجهات", "رواد الأعمال"],
  outcomes: [
    "فهم مبادئ UX الأساسية واستخدامها في تصميم التطبيقات",
    "تطبيق أسلوب التفكير التصميمي للفريق والمستخدم",
    "إعداد لوحة معلومات وواجهة مستخدم متقدمة وسهلة الاستخدام",
    "تحويل الفكرة إلى تجربة مستخدم عملية قابلة للتنفيذ",
  ],
  curriculum: [
    { title: "مقدمة إلى UX", duration: "20 دقيقة" },
    { title: "بحث المستخدم واحتياجاته", duration: "35 دقيقة" },
    { title: "تصميم واجهات المستخدم", duration: "45 دقيقة" },
    { title: "تجربة المستخدم واختبارها", duration: "50 دقيقة" },
    { title: "مشروع عملي", duration: "70 دقيقة" },
  ],
  includes: [
    "ملفات تصميم قابلة للتحميل",
    "تحديات عملية في كل درس",
    "شهادة إنجاز عند اكتمال الدورة",
    "دعم من المدرب عبر المنصة",
  ],
};

const levelLabels = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
} as const;

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      instructor: { include: { user: { select: { fullName: true } } } },
      modules: { include: { lessons: true }, orderBy: { order: "asc" } },
      reviews: { select: { rating: true } },
    },
  });

  if (!record) notFound();

  const ratings = record.reviews.map((review) => review.rating);
  const course = {
    ...fallbackDetails,
    title: record.titleAr || record.title,
    category: record.category.nameAr || record.category.name,
    level: levelLabels[record.level],
    lessons: record.modules.reduce((total, module) => total + module.lessons.length, 0),
    duration: `${record.durationHours} ساعة`,
    rating: ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : 0,
    students: await prisma.enrollment.count({ where: { courseId: record.id } }),
    price: (record.discountPrice || record.price).toString(),
    description: record.descriptionAr || record.description,
    instructor: record.instructor.user.fullName,
    lastUpdated: record.updatedAt.toLocaleDateString("ar-EG"),
    outcomes: record.whatYouLearn.length ? record.whatYouLearn : fallbackDetails.outcomes,
    curriculum: record.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        title: lesson.title,
        duration: `${Math.ceil(lesson.durationSec / 60)} دقيقة`,
      }))
    ),
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          ← العودة إلى الكورسات
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/40">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-pink-500/20 p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs text-blue-100">
                  {course.category}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-black text-white md:text-5xl">{course.title}</h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/80">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <span>⭐ {course.rating}</span>
                <span>{course.students.toLocaleString("ar-EG")} طالب</span>
                <span>{course.lessons} دروس</span>
                <span>{course.duration}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 bg-slate-950/50 p-6 md:p-8 lg:border-r lg:border-t-0">
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">سعر الدورة</p>
                <div className="mt-3 text-4xl font-black text-emerald-400">{course.price} EGP</div>

                <Link
                  href={`/checkout?courseId=${record.id}&courseName=${encodeURIComponent(course.title)}&amount=${Number(course.price)}`}
                  className="mt-6 block w-full rounded-xl bg-gradient-brand px-4 py-3 text-center text-sm font-bold text-white transition hover:opacity-95"
                >
                  ابدأ الآن
                </Link>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span>المدرب</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span>آخر تحديث</span>
                    <span>{course.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>المستوى</span>
                    <span>{course.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="mb-4 text-2xl font-black text-white">ما الذي ستتعلمه؟</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {course.outcomes.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-300">
                      ✓
                    </span>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="mb-5 text-2xl font-black text-white">محتوى الدورة</h2>
              <div className="space-y-3">
                {course.curriculum.map((lesson, index) => (
                  <div
                    key={lesson.title}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-xs text-blue-300">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-200">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-slate-400">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="mb-4 text-xl font-black text-white">من هذه الدورة؟</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {course.audience.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="mb-4 text-xl font-black text-white">ماذا يتضمن؟</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {course.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
