import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { FloatingWidget } from "@/modules/widget/ui/components/floating-widget";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  console.log(cookieStore);
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <AuthGuard>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col flex-1">{children}</main>
        <FloatingWidget />
      </SidebarProvider>
    </AuthGuard>
  );
};
