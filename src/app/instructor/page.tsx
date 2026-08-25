import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { InstructorCourseForm } from "@/components/instructor/course-form";

const levelLabels = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
} as const;

export default async function InstructorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    redirect("/403");
  }

  let instructor = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!instructor) {
    instructor = await prisma.instructorProfile.create({
      data: {
        userId: session.user.id,
        title: session.user.role === "ADMIN" ? "مدير محتوى" : "مدرس",
      },
    });
  }

  const instructorId = instructor?.id;

  const courses = instructorId
    ? await prisma.course.findMany({
        where: { instructorId },
        include: {
          category: true,
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
            orderBy: { enrolledAt: "desc" },
          },
          modules: {
            include: {
              lessons: {
                include: {
                  assignments: {
                    include: {
                      submissions: {
                        include: {
                          user: {
                            select: {
                              id: true,
                              fullName: true,
                              email: true,
                            },
                          },
                        },
                        orderBy: { submittedAt: "desc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const completedCourses = courses.reduce(
    (sum, course) => sum + course.enrollments.filter((enrollment) => enrollment.progressPct >= 100).length,
    0
  );

  const stats = [
    {
      label: "إجمالي الكورسات",
      value: courses.length.toString(),
      tone: "blue",
    },
    {
      label: "عدد الطلاب",
      value: courses.reduce((sum, course) => sum + course.enrollments.length, 0).toString(),
      tone: "violet",
    },
    {
      label: "الكورسات المكتملة",
      value: completedCourses.toString(),
      tone: "emerald",
    },
    {
      label: "التقديمات",
      value: courses
        .reduce(
          (sum, course) =>
            sum +
            course.modules.reduce(
              (moduleSum, module) =>
                moduleSum +
                module.lessons.reduce(
                  (lessonSum, lesson) =>
                    lessonSum + lesson.assignments.reduce((assignmentSum, assignment) => assignmentSum + assignment.submissions.length, 0),
                  0
                ),
              0
            ),
          0
        )
        .toString(),
      tone: "amber",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-5 md:p-8" dir="rtl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-violet-300">لوحة المدرس</p>
          <h1 className="text-3xl font-black text-white">إدارة الكورسات</h1>
        </div>

        <InstructorCourseForm />
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.74))] p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  stat.tone === "blue"
                    ? "bg-blue-500/10 text-blue-200"
                    : stat.tone === "violet"
                      ? "bg-violet-500/10 text-violet-200"
                      : stat.tone === "emerald"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-amber-500/10 text-amber-200"
                }`}
              >
                {stat.tone === "blue" ? "📚" : stat.tone === "violet" ? "👥" : stat.tone === "emerald" ? "✅" : "📝"}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400">
            لا توجد كورسات حتى الآن. استخدم زر “إضافة كورس جديد” لإنشاء أول دورة لك.
          </div>
        ) : (
          courses.map((course) => {
            const students = course.enrollments.map((enrollment) => enrollment.user);
            const submissions = course.modules.flatMap((module) =>
              module.lessons.flatMap((lesson) =>
                lesson.assignments.flatMap((assignment) =>
                  assignment.submissions.map((submission) => ({
                    id: submission.id,
                    studentName: submission.user.fullName,
                    email: submission.user.email,
                    submittedAt: submission.submittedAt,
                    assignmentTitle: assignment.title,
                    score: submission.score,
                  }))
                )
              )
            );

            return (
              <article
                key={course.id}
                className="rounded-3xl border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-5"
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-200">
                        {course.category?.nameAr || "عام"}
                      </span>
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-200">
                        {levelLabels[course.level] || course.level}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
                        {course.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{course.titleAr || course.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                      {course.descriptionAr || course.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-left">
                    <p className="text-xs text-slate-400">السعر</p>
                    <p className="mt-1 text-xl font-black text-emerald-300">
                      {Number(course.discountPrice ?? course.price).toLocaleString("ar-EG")} EGP
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">عدد الطلاب</p>
                    <p className="mt-2 text-2xl font-black text-white">{students.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">الواجبات</p>
                    <p className="mt-2 text-2xl font-black text-white">
                      {course.modules.reduce(
                        (sum, module) =>
                          sum +
                          module.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.assignments.length, 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">التقديمات</p>
                    <p className="mt-2 text-2xl font-black text-white">{submissions.length}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">الطلاب المسجلون</h3>
                      <span className="text-xs text-slate-400">{students.length} طالب</span>
                    </div>

                    {students.length === 0 ? (
                      <p className="text-sm text-slate-400">لا يوجد طلاب مسجلون في هذه الدورة بعد.</p>
                    ) : (
                      <div className="space-y-3">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
                          >
                            <div>
                              <p className="font-medium text-white">{student.fullName}</p>
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                            <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-200">طالب</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">متابعة التقديمات</h3>
                      <span className="text-xs text-slate-400">{submissions.length} تقديم</span>
                    </div>

                    {submissions.length === 0 ? (
                      <p className="text-sm text-slate-400">لا توجد تقديمات حتى الآن.</p>
                    ) : (
                      <div className="space-y-3">
                        {submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium text-white">{submission.studentName}</p>
                                <p className="text-xs text-slate-400">{submission.assignmentTitle}</p>
                              </div>
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] ${
                                  submission.score !== null && submission.score !== undefined
                                    ? "bg-emerald-500/10 text-emerald-200"
                                    : "bg-amber-500/10 text-amber-200"
                                }`}
                              >
                                {submission.score !== null && submission.score !== undefined
                                  ? `درجة ${submission.score}`
                                  : "قيد المراجعة"}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                              <span>{submission.email}</span>
                              <span>
                                {submission.submittedAt
                                  ? new Date(submission.submittedAt).toLocaleDateString("ar-EG")
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
