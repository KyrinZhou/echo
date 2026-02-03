import { AuthLayout } from "@/modules/auth/ui/layout/auth-layout";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
