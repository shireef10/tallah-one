import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MediaUpload } from "./media-upload";

export type FieldType =
  | "text" | "textarea" | "number" | "boolean" | "select"
  | "image" | "file" | "tags" | "json" | "richtext";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  folder?: string;
  accept?: string;
  defaultValue?: unknown;
};

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
};

type Props<T extends Record<string, unknown>> = {
  table: string;
  queryKey: string;
  title: string;
  description?: string;
  fields: Field[];
  columns: Column<T>[];
  orderBy?: { column: string; ascending?: boolean };
  searchableFields?: string[];
  defaultValues?: Partial<T>;
  readOnly?: boolean;
  beforeSave?: (values: Record<string, unknown>) => Record<string, unknown>;
};

function emptyFor(fields: Field[]): Record<string, unknown> {
  const v: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) v[f.name] = f.defaultValue;
    else if (f.type === "boolean") v[f.name] = false;
    else if (f.type === "number") v[f.name] = 0;
    else if (f.type === "tags") v[f.name] = [];
    else if (f.type === "json") v[f.name] = "{}";
    else v[f.name] = "";
  }
  return v;
}

export function CrudTable<T extends Record<string, unknown> & { id: string }>({
  table, queryKey, title, description, fields, columns, orderBy, searchableFields = [],
  defaultValues, readOnly, beforeSave,
}: Props<T>) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      let q = supabase.from(table as never).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = beforeSave ? beforeSave(values) : values;
      if (editing) {
        const { error } = await supabase.from(table as never).update(payload as never).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast.success(editing ? "Updated" : "Created");
      setEditing(null);
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Deleted");
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    if (!list.data) return [];
    if (!search.trim()) return list.data;
    const s = search.toLowerCase();
    return list.data.filter((r) =>
      searchableFields.some((f) => String((r as Record<string, unknown>)[f] ?? "").toLowerCase().includes(s)),
    );
  }, [list.data, search, searchableFields]);

  const open = editing !== null || creating;
  const initial = editing ? { ...emptyFor(fields), ...editing, ...defaultValues } : { ...emptyFor(fields), ...defaultValues };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {searchableFields.length > 0 && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 w-56" />
            </div>
          )}
          {!readOnly && (
            <Dialog open={creating} onOpenChange={(o) => { if (!o) setCreating(false); }}>
              <DialogTrigger asChild>
                <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New</Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c.key} style={{ width: c.width }}>{c.header}</TableHead>)}
              {!readOnly && <TableHead className="w-24 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.isLoading && <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">Loading…</TableCell></TableRow>}
            {!list.isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-10">No records</TableCell></TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </TableCell>
                ))}
                {!readOnly && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(row)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? `Edit ${title}` : `New ${title}`}</DialogTitle></DialogHeader>
          <FormBody fields={fields} initial={initial as Record<string, unknown>} onSubmit={(v) => save.mutate(v)} submitting={save.isPending} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FormBody({
  fields, initial, onSubmit, submitting,
}: {
  fields: Field[];
  initial: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const set = (k: string, v: unknown) => setValues((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const out: Record<string, unknown> = { ...values };
    for (const f of fields) {
      if (f.type === "json" && typeof out[f.name] === "string") {
        try { out[f.name] = JSON.parse((out[f.name] as string) || "{}"); }
        catch { toast.error(`${f.label}: invalid JSON`); return; }
      }
      if (f.type === "number") out[f.name] = Number(out[f.name] ?? 0);
      if (f.type === "tags" && typeof out[f.name] === "string") {
        out[f.name] = (out[f.name] as string).split(",").map((s) => s.trim()).filter(Boolean);
      }
      if ((out[f.name] === "" || out[f.name] === undefined) && !f.required) out[f.name] = null;
    }
    onSubmit(out);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => {
        const v = values[f.name];
        return (
          <div key={f.name} className="space-y-1.5">
            <Label htmlFor={f.name}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
            {f.type === "textarea" || f.type === "richtext" ? (
              <Textarea id={f.name} rows={f.type === "richtext" ? 8 : 4} value={(v as string) ?? ""} placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)} required={f.required} />
            ) : f.type === "boolean" ? (
              <div className="flex items-center gap-2"><Switch checked={!!v} onCheckedChange={(c) => set(f.name, c)} /><span className="text-sm text-muted-foreground">{v ? "Enabled" : "Disabled"}</span></div>
            ) : f.type === "select" ? (
              <Select value={(v as string) ?? ""} onValueChange={(val) => set(f.name, val)}>
                <SelectTrigger><SelectValue placeholder={f.placeholder ?? "Select…"} /></SelectTrigger>
                <SelectContent>{(f.options ?? []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            ) : f.type === "image" || f.type === "file" ? (
              <MediaUpload value={v as string | null} onChange={(url) => set(f.name, url)} folder={f.folder ?? f.name} accept={f.accept ?? (f.type === "image" ? "image/*" : "*/*")} />
            ) : f.type === "tags" ? (
              <Input id={f.name} value={Array.isArray(v) ? (v as string[]).join(", ") : (v as string) ?? ""} placeholder="comma, separated, tags" onChange={(e) => set(f.name, e.target.value)} />
            ) : f.type === "json" ? (
              <Textarea id={f.name} rows={5} className="font-mono text-xs" value={typeof v === "string" ? v : JSON.stringify(v ?? {}, null, 2)} onChange={(e) => set(f.name, e.target.value)} />
            ) : f.type === "number" ? (
              <Input id={f.name} type="number" value={(v as number) ?? 0} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <Input id={f.name} value={(v as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
            )}
            {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
          </div>
        );
      })}
      <DialogFooter className="pt-2">
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
      </DialogFooter>
    </form>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "destructive" }) {
  const cls = tone === "success" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : tone === "warning" ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
    : tone === "destructive" ? "bg-destructive/10 text-destructive border-destructive/20"
    : "";
  return <Badge variant="outline" className={cls}>{children}</Badge>;
}
