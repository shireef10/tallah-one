import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shield, Trash2, Plus, KeyRound, Lock, Unlock, Power, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ROLES, type AppRole } from "@/lib/permissions";
import {
  listUsers, createUser, deleteUser, sendPasswordReset, setUserBan,
  setUserActive, setForcePasswordChange,
} from "@/lib/api/admin-users.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const qc = useQueryClient();
  const fnList = useServerFn(listUsers);
  const fnCreate = useServerFn(createUser);
  const fnDelete = useServerFn(deleteUser);
  const fnReset = useServerFn(sendPasswordReset);
  const fnBan = useServerFn(setUserBan);
  const fnActive = useServerFn(setUserActive);
  const fnForce = useServerFn(setForcePasswordChange);

  const profiles = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const rolesQ = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
  const authUsersQ = useQuery({
    queryKey: ["admin-auth-users"],
    queryFn: () => fnList(),
  });

  const addRole = useMutation({
    mutationFn: async (v: { user_id: string; role: AppRole }) => {
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

  const refreshUsers = () => {
    qc.invalidateQueries({ queryKey: ["admin-auth-users"] });
    qc.invalidateQueries({ queryKey: ["admin-profiles"] });
  };

  const createMut = useMutation({
    mutationFn: (data: { email: string; password?: string; full_name?: string; send_invite?: boolean }) => fnCreate({ data }),
    onSuccess: () => { refreshUsers(); toast.success("User created"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: (user_id: string) => fnDelete({ data: { user_id } }),
    onSuccess: () => { refreshUsers(); toast.success("User deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const resetMut = useMutation({
    mutationFn: (email: string) => fnReset({ data: { email } }),
    onSuccess: () => toast.success("Password reset email sent"),
    onError: (e: Error) => toast.error(e.message),
  });
  const banMut = useMutation({
    mutationFn: (v: { user_id: string; ban: boolean }) => fnBan({ data: v }),
    onSuccess: (_d, v) => { refreshUsers(); toast.success(v.ban ? "Account locked" : "Account unlocked"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const activeMut = useMutation({
    mutationFn: (v: { user_id: string; active: boolean }) => fnActive({ data: v }),
    onSuccess: (_d, v) => { refreshUsers(); toast.success(v.active ? "Activated" : "Deactivated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const forceMut = useMutation({
    mutationFn: (v: { user_id: string; force: boolean }) => fnForce({ data: v }),
    onSuccess: () => { refreshUsers(); toast.success("Updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rolesByUser = new Map<string, { id: string; role: AppRole }[]>();
  (rolesQ.data ?? []).forEach((r) => {
    const list = rolesByUser.get(r.user_id) ?? [];
    list.push({ id: r.id, role: r.role as AppRole });
    rolesByUser.set(r.user_id, list);
  });
  const authById = new Map((authUsersQ.data ?? []).map((u) => [u.id, u]));

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />Admin</span>}
        title="Users"
        description="Create, edit, deactivate, lock and reset passwords. Assign roles."
        action={<NewUserDialog onCreate={(d) => createMut.mutate(d)} submitting={createMut.isPending} />}
      />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead className="w-72">Add role</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.data?.map((p) => {
                const userRoles = rolesByUser.get(p.id) ?? [];
                const a = authById.get(p.id);
                const locked = a?.banned_until && new Date(a.banned_until) > new Date();
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell className="text-sm">{a?.email ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
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
                      <div className="flex gap-1 flex-wrap">
                        {p.active === false && <Badge variant="outline" className="text-amber-600 border-amber-500/30">Deactivated</Badge>}
                        {locked && <Badge variant="outline" className="text-destructive border-destructive/30">Locked</Badge>}
                        {p.force_password_change && <Badge variant="outline">Force reset</Badge>}
                        {p.active !== false && !locked && !p.force_password_change && <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">Active</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a?.last_sign_in_at ? format(new Date(a.last_sign_in_at), "MMM d, yyyy HH:mm") : "Never"}
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(v) => addRole.mutate({ user_id: p.id, role: v as AppRole })}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Add role…" /></SelectTrigger>
                        <SelectContent>
                          {ROLES.filter((r) => !userRoles.some((ur) => ur.role === r)).map((r) => (
                            <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => a?.email && resetMut.mutate(a.email)} disabled={!a?.email}>
                            <KeyRound className="h-4 w-4 mr-2" />Send password reset
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => forceMut.mutate({ user_id: p.id, force: !p.force_password_change })}>
                            <KeyRound className="h-4 w-4 mr-2" />{p.force_password_change ? "Clear" : "Force"} password change
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => activeMut.mutate({ user_id: p.id, active: !(p.active ?? true) })}>
                            <Power className="h-4 w-4 mr-2" />{p.active === false ? "Reactivate" : "Deactivate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => banMut.mutate({ user_id: p.id, ban: !locked })}>
                            {locked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                            {locked ? "Unlock account" : "Lock account"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { if (confirm("Permanently delete this user?")) deleteMut.mutate(p.id); }} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

function NewUserDialog({ onCreate, submitting }: { onCreate: (d: { email: string; password?: string; full_name?: string; send_invite?: boolean }) => void; submitting: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" />New user</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create new user</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="invite" checked={invite} onChange={(e) => setInvite(e.target.checked)} />
            <Label htmlFor="invite" className="text-sm">Send invitation email (user sets their own password)</Label>
          </div>
          {!invite && (
            <div><Label>Initial password *</Label><Input type="text" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => {
            if (!email) { toast.error("Email required"); return; }
            if (!invite && password.length < 6) { toast.error("Password too short"); return; }
            onCreate({ email, full_name: name || undefined, password: invite ? undefined : password, send_invite: invite });
            setOpen(false); setEmail(""); setName(""); setPassword("");
          }} disabled={submitting}>{submitting ? "Creating…" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
