import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

const types = ["New User Request","Permission Change","Report Request","New Feature Request","Workflow Change","System Configuration"];
const stages = ["Submitted","Under Review","Approved","In Progress","Completed"];

export const Route = createFileRoute("/_authenticated/service-requests")({
  head: () => ({ meta: [{ title: "Service Requests — Tallah One" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Formal requests" title="Service Request Center" description="Submit and track formal requests to the Digital Transformation team." action={<Button>New request</Button>} />
      <Card className="mb-6"><CardContent className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Status pipeline</p>
        <div className="flex items-center gap-2 overflow-x-auto">
          {stages.map((s, i) => (<div key={s} className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-full bg-muted text-sm">{s}</div>
            {i < stages.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>))}
        </div>
      </CardContent></Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <Card key={t} className="border-border/60"><CardContent className="p-5">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">{t}</h3>
            <Badge variant="secondary" className="mt-3">Request type</Badge>
          </CardContent></Card>
        ))}
      </div>
    </div>
  ),
});
