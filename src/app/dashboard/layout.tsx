import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user?.id || role !== "admin") {
    redirect("/");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
