import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  const q = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><ScrollText className="h-3 w-3" />Admin</span>}
        title="Audit Log"
        description="Recent administrative activity across the platform."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.isLoading && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
              {q.data?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No activity yet</TableCell></TableRow>}
              {q.data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs whitespace-nowrap">{format(new Date(r.created_at), "MMM d, HH:mm:ss")}</TableCell>
                  <TableCell className="text-xs">{r.actor_email ?? r.actor_id?.slice(0,8) ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{r.action}</Badge></TableCell>
                  <TableCell className="text-xs">{r.resource_type ?? "—"}{r.resource_id ? ` · ${r.resource_id.slice(0,8)}` : ""}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground max-w-md truncate">
                    {r.metadata ? JSON.stringify(r.metadata) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
