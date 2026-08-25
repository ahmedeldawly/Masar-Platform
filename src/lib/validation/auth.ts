import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "الاسم الكامل مطلوب (3 أحرف على الأقل)"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري غير صالح")
      .optional()
      .or(z.literal("")),
    role: z.enum(["STUDENT", "INSTRUCTOR"], {
      errorMap: () => ({ message: "اختر نوع الحساب: طالب أو مدرب" }),
    }),
    password: z
      .string()
      .min(8, "كلمة المرور 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
      .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
