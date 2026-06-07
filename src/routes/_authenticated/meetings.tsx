import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

const slots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Book a Meeting — Tallah One" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Schedule time" title="Book a Meeting" description="Pick an available time slot with the Digital Transformation team." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4"><CalendarDays className="h-5 w-5 text-primary" /><h3 className="font-medium">Available slots — this week</h3></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((s) => (<Button key={s} variant="outline" className="justify-start">{s}</Button>))}
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <h3 className="font-medium mb-3">Meeting types</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>· Quick question (15 min)</li>
            <li>· System walkthrough (30 min)</li>
            <li>· Project sync (60 min)</li>
          </ul>
        </CardContent></Card>
      </div>
    </div>
  ),
});
