import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createCourseSchema = z.object({
  title: z.string().min(3, "عنوان الكورس مطلوب").max(150),
  description: z.string().min(20, "الوصف قصير جداً").max(2000),
  price: z.number().min(0).default(0),
  durationHours: z.number().min(1).default(4),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ليس لديك صلاحية إنشاء كورس" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, price, durationHours, level } = parsed.data;

    let instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructorProfile) {
      instructorProfile = await prisma.instructorProfile.create({
        data: {
          userId: session.user.id,
          title: session.user.role === "ADMIN" ? "مدير محتوى" : "مدرس",
        },
      });
    }

    const category = await prisma.category.upsert({
      where: { slug: "general" },
      update: {},
      create: {
        name: "عام",
        nameAr: "عام",
        slug: "general",
      },
    });

    const slug = `${title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}-${Date.now()}`;

    const course = await prisma.course.create({
      data: {
        title,
        titleAr: title,
        slug,
        description,
        descriptionAr: description,
        price,
        discountPrice: price > 0 ? Math.round(price * 0.9) : 0,
        durationHours,
        level,
        status: "DRAFT",
        categoryId: category.id,
        instructorId: instructorProfile.id,
        modules: {
          create: [
            {
              title: "الوحدة الأولى",
              order: 1,
              lessons: {
                create: [
                  {
                    title: "مقدمة الكورس",
                    type: "VIDEO",
                    order: 1,
                    durationSec: 300,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Create instructor course error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
