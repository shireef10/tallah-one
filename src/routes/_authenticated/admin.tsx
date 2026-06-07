import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, Megaphone, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Tallah One" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const isAdmin = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "digital_transformation");
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: Admin,
});

function Admin() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [t, tm, a] = await Promise.all([
        supabase.from("tutorials").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }),
      ]);
      return { tutorials: t.count ?? 0, team: tm.count ?? 0, announcements: a.count ?? 0 };
    },
  });

  const cards = [
    { label: "Tutorials", value: stats.data?.tutorials ?? 0, icon: GraduationCap },
    { label: "Team members", value: stats.data?.team ?? 0, icon: Users },
    { label: "Announcements", value: stats.data?.announcements ?? 0, icon: Megaphone },
  ];

  return (
    <div>
      <PageHeader eyebrow={<span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />Admin</span>} title="Admin Panel" description="Manage content, users, and platform settings." />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><c.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-display font-semibold">{c.value}</p><p className="text-sm text-muted-foreground">{c.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Content management</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
          <p>· Tutorials & Tallah Academy uploads</p>
          <p>· Announcements & banners</p>
          <p>· Knowledge Base articles</p>
          <p>· Process Library entries</p>
          <p className="pt-2 text-xs">Full CRUD interfaces coming next iteration.</p>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>People & access</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
          <p>· Users & roles</p>
          <p>· Team directory editor</p>
          <p>· Activity logs</p>
          <p>· Engagement analytics</p>
        </CardContent></Card>
      </div>
    </div>
  );
}
