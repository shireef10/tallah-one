import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, GraduationCap, Megaphone, BookOpen, Workflow, HelpCircle,
  ClipboardList, LifeBuoy, Briefcase, CalendarDays, Shield,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminIndex,
});

const cards = [
  { table: "announcements", label: "Announcements", icon: Megaphone },
  { table: "tutorials", label: "Tutorials", icon: GraduationCap },
  { table: "knowledge_articles", label: "Knowledge articles", icon: BookOpen },
  { table: "processes", label: "Processes", icon: Workflow },
  { table: "faqs", label: "FAQs", icon: HelpCircle },
  { table: "workspace_tools", label: "Workspace tools", icon: Briefcase },
  { table: "meeting_links", label: "Meeting links", icon: CalendarDays },
  { table: "team_members", label: "Team members", icon: Users },
  { table: "support_tickets", label: "Support tickets", icon: LifeBuoy },
  { table: "service_requests", label: "Service requests", icon: ClipboardList },
] as const;

function AdminIndex() {
  const stats = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const counts = await Promise.all(
        cards.map((c) => supabase.from(c.table as never).select("*", { count: "exact", head: true })),
      );
      return Object.fromEntries(cards.map((c, i) => [c.table, counts[i].count ?? 0]));
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />Admin</span>}
        title="Content Management"
        description="Manage every piece of content on the platform. Use the sidebar to jump to a section."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {cards.map((c) => (
          <Card key={c.table}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-display font-semibold">{stats.data?.[c.table] ?? 0}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
