import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Tallah One" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Wiki" title="Knowledge Base" description="Solutions, workarounds, business rules, vendor info, and best practices." />
      <Card className="border-dashed"><CardContent className="py-16 text-center">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">Knowledge Base is being curated</p>
        <p className="text-sm text-muted-foreground mt-1">Articles will appear here as the Digital Transformation team publishes them.</p>
      </CardContent></Card>
    </div>
  ),
});
