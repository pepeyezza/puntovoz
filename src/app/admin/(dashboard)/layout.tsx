export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }
  const role = (session.user as any).role ?? "EDITOR";

  return (
    <div className="flex min-h-screen bg-secundario text-principal">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-principal/10 px-8 py-4">
          <p className="text-sm text-principal/60">
            Conectado como <span className="font-medium text-principal">{session.user.name}</span>
          </p>
          <span className="rounded-full bg-principal/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-principal/60">
            {role}
          </span>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
