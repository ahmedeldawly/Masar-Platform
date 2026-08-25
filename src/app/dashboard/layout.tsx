import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <DashboardSidebar role={session?.user?.role as string | undefined} userName={session?.user?.name as string | undefined}>
      {children}
    </DashboardSidebar>
  );
}