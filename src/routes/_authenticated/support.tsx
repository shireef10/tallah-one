import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support Center — Tallah One" }] }),
  component: Support,
});

function Support() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ subject: "", category: "General", priority: "normal", description: "" });

  const myTickets = useQuery({
    queryKey: ["my-tickets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id, subject: form.subject, category: form.category,
        priority: form.priority as "low" | "normal" | "high" | "urgent",
        description: form.description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ticket submitted");
      setForm({ subject: "", category: "General", priority: "normal", description: "" });
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader eyebrow="We're here to help" title="Support Center" description="Open a ticket for ERP, CRM, marketing, website, email, hardware, or anything else." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>New support ticket</CardTitle><CardDescription>Describe the issue and we'll get back to you.</CardDescription></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}>
              <div className="space-y-2"><Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Short summary" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["ERP","CRM","Marketing","Website","Email","Hardware","General"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["low","normal","high","urgent"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label>
                <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What happened? What did you expect?" required />
              </div>
              <Button type="submit" disabled={submit.isPending}>{submit.isPending ? "Submitting…" : "Submit ticket"}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your tickets</CardTitle></CardHeader>
          <CardContent>
            {(myTickets.data ?? []).length === 0 ? (
              <div className="text-center py-10">
                <LifeBuoy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No tickets yet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {myTickets.data?.map((t) => (
                  <li key={t.id} className="rounded-lg border p-3">
                    <p className="font-medium text-sm truncate">{t.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{t.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
