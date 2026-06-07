import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, GraduationCap, PlayCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/learning")({
  head: () => ({ meta: [{ title: "Tallah Academy — Tallah One" }] }),
  component: Learning,
});

const categories = ["All", "ERP Academy", "CX Academy", "E-Commerce Academy", "Marketing Academy", "Partners Academy", "Onboarding Academy"];

function Learning() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const { data: tutorials } = useQuery({
    queryKey: ["tutorials"],
    queryFn: async () => {
      const { data } = await supabase.from("tutorials").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = (tutorials ?? []).filter((t) =>
    (cat === "All" || t.category === cat) &&
    (q === "" || t.title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Tallah Academy"
        title="Learning Center"
        description="Master every system with bite-sized tutorials, guides, and walkthroughs."
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tutorials…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No tutorials yet</p>
            <p className="text-sm text-muted-foreground mt-1">An administrator can upload videos and PDFs from the admin panel.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <Card key={t.id} className="overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition border-border/60">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent relative flex items-center justify-center">
                {t.thumbnail_url ? (
                  <img src={t.thumbnail_url} alt={t.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <GraduationCap className="h-10 w-10 text-primary/60" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{t.category}</Badge>
                <h3 className="font-medium line-clamp-2">{t.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{t.duration_minutes ?? 0} min</span>
                  <span className="mx-1.5">·</span>
                  <span>{t.views ?? 0} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
