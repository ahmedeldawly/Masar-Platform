import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const confirm = process.env.CONFIRM_CLEAR;
  if (confirm !== "yes") {
    console.log("Aborting: set CONFIRM_CLEAR=yes to actually clear data.");
    process.exit(0);
  }

  const keepAdmin = process.env.KEEP_ADMIN === "yes";

  console.log("Starting data clear...");

  // Delete in child-first order to avoid FK issues
  const steps = [
    ["verificationToken", "VerificationToken"],
    ["passwordResetToken", "PasswordResetToken"],
    ["invoice", "Invoice"],
    ["couponCourse", "CouponCourse"],
    ["coupon", "Coupon"],
    ["payment", "Payment"],
    ["grade", "Grade"],
    ["submission", "Submission"],
    ["assignment", "Assignment"],
    ["quizAttempt", "QuizAttempt"],
    ["question", "Question"],
    ["quiz", "Quiz"],
    ["lessonProgress", "LessonProgress"],
    ["enrollment", "Enrollment"],
    ["certificate", "Certificate"],
    ["notification", "Notification"],
    ["review", "Review"],
    ["lesson", "Lesson"],
    ["module", "Module"],
    ["course", "Course"],
    ["instructorProfile", "InstructorProfile"],
    ["category", "Category"],
  ];

  for (const [clientKey, name] of steps) {
    // @ts-ignore
    const result = await (prisma as any)[clientKey].deleteMany();
    console.log(`Cleared ${name}: ${result.count}`);
  }

  if (keepAdmin) {
    const res = await prisma.user.deleteMany({ where: { email: { not: "admin@masar.dev" } } });
    console.log(`Cleared Users (kept admin): ${res.count}`);
  } else {
    const res = await prisma.user.deleteMany();
    console.log(`Cleared Users: ${res.count}`);
  }

  console.log("Data clear complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
