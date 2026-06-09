import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight, Briefcase, GraduationCap, LifeBuoy, Megaphone, MessageSquare,
  Mail, ShoppingBag, BarChart3, Sparkles, FileText, CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Tallah One" }] }),
  component: Dashboard,
});

const quickActions = [
  { title: "ERP System", icon: BarChart3, color: "from-rose-400 to-rose-600", href: "/workspace" },
  { title: "Customer Experience", icon: MessageSquare, color: "from-pink-400 to-rose-500", href: "/workspace" },
  { title: "WhatsApp Campaigns", icon: MessageSquare, color: "from-emerald-400 to-emerald-600", href: "/workspace" },
  { title: "SMS Campaigns", icon: MessageSquare, color: "from-amber-400 to-amber-600", href: "/workspace" },
  { title: "Website", icon: ShoppingBag, color: "from-indigo-400 to-indigo-600", href: "/workspace" },
  { title: "Marketing Tools", icon: BarChart3, color: "from-purple-400 to-fuchsia-600", href: "/workspace" },
  { title: "Email", icon: Mail, color: "from-sky-400 to-sky-600", href: "/workspace" },
  { title: "Learning Center", icon: GraduationCap, color: "from-rose-500 to-pink-600", href: "/learning" },
  { title: "Support Center", icon: LifeBuoy, color: "from-orange-400 to-rose-500", href: "/support" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { profile, user, isAdmin } = useAuth();
  const name = profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  const tutorials = useQuery({
    queryKey: ["dash-tutorials"],
    queryFn: async () => {
      const { data } = await supabase.from("tutorials").select("id,title,category,duration_minutes,thumbnail_url").order("created_at", { ascending: false }).limit(4);
      return data ?? [];
    },
  });

  const announcements = useQuery({
    queryKey: ["dash-announcements"],
    queryFn: async () => {
      const { data } = await supabase.from("announcements").select("id,title,priority,published_at,pinned").order("pinned", { ascending: false }).order("published_at", { ascending: false }).limit(4);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-3xl p-8 lg:p-12 text-primary-foreground shadow-[var(--shadow-elegant)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <Sparkles className="h-4 w-4" />
            <span>{greeting()}</span>
          </div>
          <h1 className="font-display mt-3 text-4xl md:text-5xl font-semibold">{name}, welcome to Tallah One</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/85 text-lg">Everything you need for your workday is right here.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary"><Link to="/workspace">Open Workspace</Link></Button>
            <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"><Link to="/learning">Browse Tallah Academy</Link></Button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Quick access</h2>
          <Link to="/workspace" className="text-sm text-primary hover:underline inline-flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.href} className="group">
              <Card className="h-full transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 border-border/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-white shadow-sm shrink-0`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">Open system</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Latest tutorials</CardTitle>
              <CardDescription>From Tallah Academy</CardDescription>
            </div>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {tutorials.data && tutorials.data.length > 0 ? (
              tutorials.data.map((t) => (
                <Link key={t.id} to="/learning" className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/60 transition">
                  <div className="h-10 w-14 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.category} · {t.duration_minutes ?? 0} min</p>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState text="No tutorials yet. Check back soon." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent announcements</CardTitle>
              <CardDescription>Company news & updates</CardDescription>
            </div>
            <Megaphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.data && announcements.data.length > 0 ? (
              announcements.data.map((a) => (
                <Link key={a.id} to="/announcements" className="block p-2 -mx-2 rounded-lg hover:bg-muted/60 transition">
                  <div className="flex items-start gap-2">
                    {a.pinned && <Badge variant="secondary" className="text-[10px]">Pinned</Badge>}
                    <p className="text-sm font-medium flex-1">{a.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.published_at), "MMM d, yyyy")}</p>
                </Link>
              ))
            ) : (
              <EmptyState text="No announcements yet." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Your day</CardTitle>
              <CardDescription>Tickets, requests, meetings</CardDescription>
            </div>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Row icon={LifeBuoy} label="Open support tickets" value="0" href="/support" />
            <Row icon={FileText} label="Open service requests" value="0" href="/service-requests" />
            <Row icon={CalendarDays} label="Upcoming meetings" value="0" href="/meetings" />
            <Row icon={Briefcase} label="Recently added docs" value="0" href="/knowledge" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Row({ icon: Icon, label, value, href }: { icon: typeof Briefcase; label: string; value: string; href: string }) {
  return (
    <Link to={href} className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-muted/60 transition">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <Badge variant="outline">{value}</Badge>
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground py-4 text-center">{text}</p>;
}
