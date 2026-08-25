import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "مسار | Masar — منصة التعليم الإلكتروني",
  description: "طور مهاراتك، احصل على المعرفة، وابنِ مستقبلك.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-bg text-white antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
