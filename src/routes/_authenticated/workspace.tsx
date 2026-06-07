import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/workspace")({
  head: () => ({ meta: [{ title: "Workspace — Tallah One" }] }),
  component: Workspace,
});

const fallback = [
  { category: "ERP", name: "Tallah ERP", description: "Operations, inventory, and finance hub.", access_url: "https://example.com", tutorial_url: "/learning", documentation_url: "/knowledge" },
  { category: "Customer Experience", name: "CX Platform", description: "Customer profiles, tickets, loyalty.", access_url: "https://example.com" },
  { category: "WhatsApp Campaigns", name: "WhatsApp Manager", description: "Bulk campaigns and templates.", access_url: "https://example.com" },
  { category: "SMS Campaigns", name: "SMS Gateway", description: "Schedule and send SMS blasts.", access_url: "https://example.com" },
  { category: "Website & E-Commerce", name: "Storefront Admin", description: "Manage products and orders.", access_url: "https://example.com" },
  { category: "Marketing Tools", name: "Google Analytics", description: "Web traffic & conversions.", access_url: "https://analytics.google.com" },
  { category: "Marketing Tools", name: "Google Tag Manager", description: "Tag deployment & tracking.", access_url: "https://tagmanager.google.com" },
  { category: "Marketing Tools", name: "Search Console", description: "Search performance & indexing.", access_url: "https://search.google.com/search-console" },
  { category: "Communication", name: "Company Email", description: "Webmail and calendar.", access_url: "https://mail.google.com" },
  { category: "Communication", name: "Meeting Booking", description: "Book a meeting with the team.", access_url: "/meetings" },
];

function Workspace() {
  const { data } = useQuery({
    queryKey: ["workspace-tools"],
    queryFn: async () => {
      const { data } = await supabase.from("workspace_tools").select("*").order("sort_order");
      return data && data.length > 0 ? data : fallback;
    },
  });

  const tools = data ?? fallback;
  const grouped = tools.reduce<Record<string, typeof tools>>((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        eyebrow="Your toolbox"
        title="Workspace"
        description="One launchpad for every system you use. Open, learn, or read the docs."
      />
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, list]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-xl font-semibold">{category}</h2>
              <Badge variant="secondary">{list.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((t: any) => (
                <Card key={t.name} className="border-border/60 hover:shadow-[var(--shadow-soft)] transition">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-display font-bold">
                        {t.name.slice(0, 1)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{t.name}</CardTitle>
                        <CardDescription className="text-xs">{t.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">{t.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {t.access_url && (
                        <Button asChild size="sm">
                          <a href={t.access_url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Open</a>
                        </Button>
                      )}
                      {t.tutorial_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={t.tutorial_url}><PlayCircle className="h-3.5 w-3.5 mr-1.5" />Tutorial</a>
                        </Button>
                      )}
                      {t.documentation_url && (
                        <Button asChild size="sm" variant="ghost">
                          <a href={t.documentation_url}><FileText className="h-3.5 w-3.5 mr-1.5" />Docs</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
