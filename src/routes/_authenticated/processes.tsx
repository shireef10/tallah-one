import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

const processes = ["Purchase Process", "Inventory Process", "Sales Process", "Returns Process", "Customer Service Process", "Complaint Handling Process"];

export const Route = createFileRoute("/_authenticated/processes")({
  head: () => ({ meta: [{ title: "Process Library — Tallah One" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="How we work" title="Process Library" description="Documented company processes with flowcharts, videos, and PDFs." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {processes.map((p) => (
          <Card key={p} className="border-border/60 hover:shadow-[var(--shadow-soft)] transition">
            <CardContent className="p-5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Workflow className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{p}</h3>
              <p className="text-xs text-muted-foreground mt-1">Owned by Operations · Updated recently</p>
              <Badge variant="secondary" className="mt-3">Coming soon</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
});
