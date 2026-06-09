import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Handshake, ExternalLink, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/partners")({
  head: () => ({ meta: [{ title: "Partners — Tallah One" }] }),
  component: PartnersPage,
});

function PartnersPage() {
  const q = useQuery({
    queryKey: ["partners-public"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").eq("visible", true).order("sort_order");
      return data ?? [];
    },
  });
  return (
    <div>
      <PageHeader eyebrow="Alliances" title="Partner Directory" description="Strategic partners and integrators." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {q.data?.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-muted" /> :
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Handshake className="h-5 w-5" /></div>}
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{p.name}</p>
                  {p.category && <p className="text-xs text-muted-foreground">{p.category}</p>}
                </div>
                {p.partnership_tier && <Badge variant="secondary">{p.partnership_tier}</Badge>}
              </div>
              {p.description && <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>}
              <div className="space-y-1 text-xs text-muted-foreground">
                {p.contact_email && <a href={`mailto:${p.contact_email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="h-3 w-3" />{p.contact_email}</a>}
                {p.website_url && <a href={p.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline"><ExternalLink className="h-3 w-3" />Visit website</a>}
              </div>
            </CardContent>
          </Card>
        ))}
        {q.data?.length === 0 && <p className="col-span-full text-center text-muted-foreground py-10">No partners yet.</p>}
      </div>
    </div>
  );
}
