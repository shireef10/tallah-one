import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/vendors")({
  head: () => ({ meta: [{ title: "Vendors — Tallah One" }] }),
  component: VendorsPage,
});

function VendorsPage() {
  const q = useQuery({
    queryKey: ["vendors-public"],
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("*").eq("visible", true).order("sort_order");
      return data ?? [];
    },
  });
  return (
    <div>
      <PageHeader eyebrow="Procurement" title="Vendor Directory" description="Suppliers and vendor contacts for the company." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {q.data?.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                {v.logo_url ? <img src={v.logo_url} alt={v.name} className="h-10 w-10 rounded-lg object-cover bg-muted" /> :
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Building2 className="h-5 w-5" /></div>}
                <div className="min-w-0">
                  <p className="font-medium truncate">{v.name}</p>
                  {v.category && <p className="text-xs text-muted-foreground">{v.category}{v.country ? ` · ${v.country}` : ""}</p>}
                </div>
              </div>
              {v.description && <p className="text-sm text-muted-foreground line-clamp-3">{v.description}</p>}
              <div className="space-y-1 text-xs text-muted-foreground">
                {v.contact_email && <a href={`mailto:${v.contact_email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="h-3 w-3" />{v.contact_email}</a>}
                {v.contact_phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{v.contact_phone}</span>}
                {v.website_url && <a href={v.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline"><ExternalLink className="h-3 w-3" />Visit website</a>}
              </div>
            </CardContent>
          </Card>
        ))}
        {q.data?.length === 0 && <p className="col-span-full text-center text-muted-foreground py-10">No vendors yet.</p>}
      </div>
    </div>
  );
}
