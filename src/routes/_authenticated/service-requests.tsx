import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/service-requests")({
  head: () => ({ meta: [{ title: "Service Requests — Tallah One" }] }),
  component: ServiceRequestsPage,
});

type ReqField = { name: string; label: string; type: "text" | "textarea"; required?: boolean };

function ServiceRequestsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [typeId, setTypeId] = useState<string | null>(null);
  const [payload, setPayload] = useState<Record<string, string>>({});

  const types = useQuery({
    queryKey: ["service-types"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_request_types").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const my = useQuery({
    queryKey: ["my-requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!user || !typeId) throw new Error("Missing data");
      const { error } = await supabase.from("service_requests").insert({
        user_id: user.id, type_id: typeId, payload,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request submitted");
      setTypeId(null); setPayload({});
      qc.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeType = (types.data ?? []).find((t) => t.id === typeId);
  const fields: ReqField[] = (activeType?.fields as ReqField[] | null) ?? [];

  return (
    <div>
      <PageHeader eyebrow="Formal requests" title="Service Request Center" description="Submit and track formal requests to the Digital Transformation team." />

      {(types.data ?? []).length === 0 ? (
        <Card className="border-dashed mb-8"><CardContent className="py-10 text-center">
          <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No request types configured</p>
          <p className="text-sm text-muted-foreground mt-1">Admins can add request types from Admin → Service Types.</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {types.data?.map((t) => (
            <Card key={t.id} className="border-border/60 hover:shadow-[var(--shadow-soft)] transition">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{t.name}</h3>
                {t.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  {t.department && <Badge variant="secondary">{t.department}</Badge>}
                  <Button size="sm" onClick={() => { setTypeId(t.id); setPayload({}); }}>Request</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="font-display text-lg font-semibold mb-3">My requests</h2>
      {(my.data ?? []).length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No requests yet.</CardContent></Card>
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {my.data?.map((r) => {
            const t = (types.data ?? []).find((x) => x.id === r.type_id);
            return (
              <div key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{t?.name ?? "Request"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <Badge variant="outline">{r.status}</Badge>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!typeId} onOpenChange={(o) => !o && setTypeId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{activeType?.name}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} className="space-y-4">
            {fields.length === 0 && <p className="text-sm text-muted-foreground">No additional details required. Click submit to send.</p>}
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                {f.type === "textarea" ? (
                  <Textarea rows={4} value={payload[f.name] ?? ""} required={f.required} onChange={(e) => setPayload({ ...payload, [f.name]: e.target.value })} />
                ) : (
                  <Input value={payload[f.name] ?? ""} required={f.required} onChange={(e) => setPayload({ ...payload, [f.name]: e.target.value })} />
                )}
              </div>
            ))}
            <DialogFooter><Button type="submit" disabled={submit.isPending}>{submit.isPending ? "Submitting…" : "Submit request"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
