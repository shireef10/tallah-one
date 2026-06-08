import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/processes")({
  head: () => ({ meta: [{ title: "Process Library — Tallah One" }] }),
  component: ProcessesPage,
});

function ProcessesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["processes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("processes").select("*").eq("published", true).order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader eyebrow="How we work" title="Process Library" description="Documented company processes with flowcharts, videos, and PDFs." />
      {isLoading ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : (data ?? []).length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center">
          <Workflow className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No processes published yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add processes from Admin Panel → Processes.</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((p) => (
            <Card key={p.id} className="border-border/60 hover:shadow-[var(--shadow-soft)] transition">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Workflow className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{p.title}</h3>
                {p.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.summary}</p>}
                <div className="flex items-center gap-2 mt-3">
                  {p.department && <Badge variant="secondary">{p.department}</Badge>}
                  {p.version && <Badge variant="outline">v{p.version}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
