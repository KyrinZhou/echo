import { AuthLayout } from "@/modules/auth/ui/layout/auth-layout";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
