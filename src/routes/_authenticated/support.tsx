import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support Center — Tallah One" }] }),
  component: Support,
});

function Support() {
  const [submitting, setSubmitting] = useState(false);
  return (
    <div>
      <PageHeader eyebrow="We're here to help" title="Support Center" description="Open a ticket for ERP, CRM, marketing, website, email, hardware, or anything else." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>New support ticket</CardTitle><CardDescription>Describe the issue and we'll get back to you.</CardDescription></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitting(true); setTimeout(() => { setSubmitting(false); toast.success("Ticket submitted (demo)"); }, 600); }}>
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Short summary" required /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                    <SelectContent>{["ERP","CRM","Marketing","Website","Email","Hardware","General"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Priority</Label>
                  <Select defaultValue="normal"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["low","normal","high","critical"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={5} placeholder="What happened? What did you expect?" /></div>
              <Button type="submit" disabled={submitting}>Submit ticket</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your tickets</CardTitle></CardHeader>
          <CardContent className="text-center py-10">
            <LifeBuoy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No open tickets.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
