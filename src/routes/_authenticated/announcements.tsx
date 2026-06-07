import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Pin } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/announcements")({
  head: () => ({ meta: [{ title: "Announcements — Tallah One" }] }),
  component: Announcements,
});

const priorityColor: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-primary/10 text-primary",
  high: "bg-warning/15 text-warning-foreground",
  critical: "bg-destructive/15 text-destructive",
};

function Announcements() {
  const { data } = useQuery({
    queryKey: ["announcements-all"],
    queryFn: async () => {
      const { data } = await supabase.from("announcements").select("*").order("pinned", { ascending: false }).order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader eyebrow="Stay informed" title="Announcements" description="Company news, releases, training, and maintenance notices." />
      {!data || data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Megaphone className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm text-muted-foreground mt-1">You'll see updates here when they're published.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((a) => (
            <Card key={a.id} className={`border-border/60 ${a.pinned ? "border-primary/30 bg-primary/5" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && <Badge className="bg-primary/15 text-primary border-0"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
                    {a.category && <Badge variant="outline">{a.category}</Badge>}
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider ${priorityColor[a.priority] ?? priorityColor.normal}`}>{a.priority}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{format(new Date(a.published_at), "MMM d, yyyy")}</span>
                </div>
                {a.banner_image_url && <img src={a.banner_image_url} alt={a.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
                <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
