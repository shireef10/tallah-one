import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

type Role = "super_admin" | "digital_transformation" | "department_manager" | "employee";
const ROLES: Role[] = ["super_admin", "digital_transformation", "department_manager", "employee"];

function UsersAdmin() {
  const qc = useQueryClient();
  const profiles = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const roles = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const addRole = useMutation({
    mutationFn: async (v: { user_id: string; role: Role }) => {
      const { error } = await supabase.from("user_roles").insert(v);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-all-roles"] }); toast.success("Role added"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-all-roles"] }); toast.success("Role removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rolesByUser = new Map<string, { id: string; role: Role }[]>();
  (roles.data ?? []).forEach((r) => {
    const list = rolesByUser.get(r.user_id) ?? [];
    list.push({ id: r.id, role: r.role as Role });
    rolesByUser.set(r.user_id, list);
  });

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />Admin</span>}
        title="Users & Roles"
        description="Assign roles to control who can access the admin panel and other gated areas."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="w-64">Add role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.data?.map((p) => {
                const userRoles = rolesByUser.get(p.id) ?? [];
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.department ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                        {userRoles.map((r) => (
                          <Badge key={r.id} variant="secondary" className="gap-1">
                            {r.role}
                            <button onClick={() => removeRole.mutate(r.id)} className="hover:text-destructive ml-1">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(v) => addRole.mutate({ user_id: p.id, role: v as Role })}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Add role…" /></SelectTrigger>
                        <SelectContent>
                          {ROLES.filter((r) => !userRoles.some((ur) => ur.role === r)).map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
