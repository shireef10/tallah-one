import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import {
  Users, GraduationCap, Megaphone, Shield, BookOpen, Workflow, HelpCircle,
  CalendarDays, ClipboardList, LifeBuoy, Briefcase, Settings, LayoutDashboard,
  FolderTree, Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Tallah One" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", data.user.id);
    const isAdmin = (roles ?? []).some(
      (r) => r.role === "super_admin" || r.role === "digital_transformation",
    );
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

const sections = [
  { group: "Overview", items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    group: "Content",
    items: [
      { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { to: "/admin/tutorials", label: "Tutorials", icon: GraduationCap },
      { to: "/admin/knowledge", label: "Knowledge Articles", icon: BookOpen },
      { to: "/admin/knowledge-categories", label: "Knowledge Categories", icon: FolderTree },
      { to: "/admin/processes", label: "Processes", icon: Workflow },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  {
    group: "Services",
    items: [
      { to: "/admin/workspace-tools", label: "Workspace Tools", icon: Briefcase },
      { to: "/admin/meetings", label: "Meeting Links", icon: CalendarDays },
      { to: "/admin/service-types", label: "Service Types", icon: Wrench },
      { to: "/admin/service-requests", label: "Service Requests", icon: ClipboardList },
      { to: "/admin/tickets", label: "Support Tickets", icon: LifeBuoy },
    ],
  },
  {
    group: "Organization",
    items: [
      { to: "/admin/team", label: "Team Directory", icon: Users },
      { to: "/admin/users", label: "Users & Roles", icon: Shield },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="grid lg:grid-cols-[240px,1fr] gap-6 -m-6 lg:-m-8 p-6 lg:p-8">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border bg-card p-3 space-y-4">
          {sections.map((s) => (
            <div key={s.group}>
              <p className="px-2 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{s.group}</p>
              <nav className="space-y-0.5">
                {s.items.map((i) => {
                  const active = i.exact ? pathname === i.to : pathname.startsWith(i.to);
                  return (
                    <Link key={i.to} to={i.to}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-foreground/80",
                      )}>
                      <i.icon className="h-4 w-4" />
                      <span className="truncate">{i.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
      <main className="min-w-0"><Outlet /></main>
    </div>
  );
}
