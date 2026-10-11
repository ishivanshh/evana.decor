import Link from "next/link";
import { ClipboardList, LayoutDashboard, Package, Settings, Users, Tags, TicketPercent, Star } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminLogout } from "@/components/admin-logout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return <div className="min-h-screen bg-[#f7f4ef]">
    {session?.user?.role === "admin" ? <div className="grid min-h-screen md:grid-cols-[230px_1fr]">
      <aside className="border-r border-[#e8e1d8] bg-[#fbf8f3] p-5 md:p-7">
        <Link href="/admin" className="font-display text-3xl tracking-[.15em]">evana</Link><p className="mt-1 text-[9px] uppercase tracking-[.2em] text-[#82776d]">Owner studio</p>
        <nav className="mt-10 space-y-1">{[[LayoutDashboard, "Overview", "/admin"], [ClipboardList, "Orders", "/admin/orders"], [Package, "Products", "/admin/products"], [Tags, "Collections", "/admin/categories"], [TicketPercent, "Coupons", "/admin/coupons"], [Star, "Reviews", "/admin/reviews"], [Users, "Customers", "/admin/customers"], [Settings, "Messages", "/admin/messages"], [Settings, "Settings", "/admin/settings"]].map(([Icon, label, href]) => {
          const Glyph = Icon as typeof LayoutDashboard;
          return <Link key={label as string} href={href as string} className="flex items-center gap-3 px-3 py-3 text-xs text-[#62564d] hover:bg-[#f1ebe3]"><Glyph size={15} />{label as string}</Link>;
        })}</nav>
        <AdminLogout />
      </aside>
      <div className="min-w-0"><header className="flex h-[70px] items-center justify-between border-b border-[#e8e1d8] bg-[#fbf8f3] px-6 md:px-10"><p className="text-xs text-[#82776d]">Good things are growing.</p><span className="text-xs">{session.user?.name ?? "Owner"}</span></header><main className="p-5 md:p-10">{children}</main></div>
    </div> : children}
  </div>;
}
