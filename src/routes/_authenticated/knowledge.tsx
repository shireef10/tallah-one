import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Tallah One" }] }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["knowledge-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_articles").select("*").eq("published", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((a) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return a.title.toLowerCase().includes(s) || (a.excerpt ?? "").toLowerCase().includes(s);
  });

  return (
    <div>
      <PageHeader eyebrow="Wiki" title="Knowledge Base" description="Solutions, workarounds, business rules, vendor info, and best practices." />
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      {isLoading ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No articles found</p>
          <p className="text-sm text-muted-foreground mt-1">Articles published by the Digital Transformation team will appear here.</p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <Link key={a.id} to="/knowledge" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug mb-1">{a.title}</h3>
                  {a.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(a.tags ?? []).slice(0, 3).map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
