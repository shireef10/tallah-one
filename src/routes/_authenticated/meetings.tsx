import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Book a Meeting — Tallah One" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["meeting-links"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meeting_links").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const grouped = (data ?? []).reduce<Record<string, typeof data extends (infer T)[] | undefined ? T[] : never>>((acc, m) => {
    const k = m.department ?? "General";
    (acc[k] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader eyebrow="Schedule time" title="Book a Meeting" description="Pick the right team and book directly through their calendar." />
      {isLoading ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : (data ?? []).length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center">
          <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No meeting links configured</p>
          <p className="text-sm text-muted-foreground mt-1">Admins can add booking links in Admin → Meeting Links.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dept, items]) => (
            <div key={dept}>
              <h2 className="font-display text-lg font-semibold mb-3">{dept}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((m) => (
                  <Card key={m.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{m.name}</h3>
                      </div>
                      {m.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{m.description}</p>}
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="capitalize">{m.provider}</Badge>
                        <Button size="sm" asChild>
                          <a href={m.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" />Book</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
