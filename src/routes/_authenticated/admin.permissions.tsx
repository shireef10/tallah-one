import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSIONS, PERMISSION_LABELS, ROLES, type Permission, type AppRole } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/admin/permissions")({
  component: PermissionsPage,
});

function PermissionsPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["role-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("role_permissions").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const has = (role: AppRole, perm: Permission) =>
    (q.data ?? []).some((r) => r.role === role && r.permission === perm);

  const toggle = useMutation({
    mutationFn: async ({ role, permission, on }: { role: AppRole; permission: Permission; on: boolean }) => {
      if (on) {
        const { error } = await supabase.from("role_permissions").insert({ role, permission });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("role_permissions")
          .delete().eq("role", role).eq("permission", permission);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["role-permissions"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  // super_admin & digital_transformation always pass (via is_admin) — show as locked
  const isAlwaysOn = (role: AppRole) => role === "super_admin" || role === "digital_transformation";

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />Admin</span>}
        title="Roles & Permissions Matrix"
        description="Toggle which capabilities each role has. Super Admin and Digital Transformation always have full access."
      />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left p-3 sticky left-0 bg-muted/40 z-10 min-w-[220px]">Permission</th>
                {ROLES.map((r) => (
                  <th key={r} className="p-3 text-xs font-medium whitespace-nowrap">{r.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p} className="border-b hover:bg-muted/20">
                  <td className="p-3 font-medium sticky left-0 bg-card">{PERMISSION_LABELS[p]}</td>
                  {ROLES.map((r) => {
                    const on = isAlwaysOn(r) || has(r, p);
                    return (
                      <td key={r} className="p-3 text-center">
                        <Checkbox
                          checked={on}
                          disabled={isAlwaysOn(r) || toggle.isPending}
                          onCheckedChange={(c) => toggle.mutate({ role: r, permission: p, on: !!c })}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
