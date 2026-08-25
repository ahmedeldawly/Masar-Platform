import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Passw0rd!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@masar.dev" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@masar.dev",
      passwordHash: password,
      role: "ADMIN",
      emailVerifiedAt: new Date(),
    },
  });

  const instructorUser = await prisma.user.upsert({
    where: { email: "instructor@masar.dev" },
    update: {},
    create: {
      fullName: "أحمد إبراهيم",
      email: "instructor@masar.dev",
      passwordHash: password,
      role: "INSTRUCTOR",
      emailVerifiedAt: new Date(),
      instructorProfile: {
        create: {
          title: "Senior Full-Stack Instructor",
          expertise: "Web Development, React, Node.js",
        },
      },
    },
    include: { instructorProfile: true },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@masar.dev" },
    update: {},
    create: {
      fullName: "Ahmed",
      email: "student@masar.dev",
      passwordHash: password,
      role: "STUDENT",
      emailVerifiedAt: new Date(),
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      name: "Web Development",
      nameAr: "تطوير الويب",
      slug: "web-development",
    },
  });

  const instructorProfile = await prisma.instructorProfile.findUniqueOrThrow({
    where: { userId: instructorUser.id },
  });

  const course = await prisma.course.upsert({
    where: { slug: "full-stack-development" },
    update: {},
    create: {
      title: "Full Stack Development",
      titleAr: "تطوير الويب الشامل",
      slug: "full-stack-development",
      description:
        "Learn to build production-ready web applications from front to back.",
      descriptionAr: "تعلم بناء تطبيقات ويب جاهزة للإنتاج من الصفر للاحتراف.",
      level: "INTERMEDIATE",
      status: "PUBLISHED",
      price: 3000,
      discountPrice: 2500,
      durationHours: 40,
      language: "ar",
      whatYouLearn: ["HTML/CSS/JS", "React", "Node.js & APIs", "PostgreSQL"],
      requirements: ["أساسيات البرمجة", "جهاز كمبيوتر ونت"],
      categoryId: category.id,
      instructorId: instructorProfile.id,
      modules: {
        create: [
          {
            title: "Module 1: Foundations",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Introduction",
                  type: "VIDEO",
                  order: 1,
                  isFreePreview: true,
                  durationSec: 600,
                },
                {
                  title: "HTML Basics",
                  type: "VIDEO",
                  order: 2,
                  durationSec: 1200,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      progressPct: 0,
    },
  });

  console.log("Seed complete:");
  console.log(" Admin      -> admin@masar.dev / Passw0rd!");
  console.log(" Instructor -> instructor@masar.dev / Passw0rd!");
  console.log(" Student    -> student@masar.dev / Passw0rd!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
