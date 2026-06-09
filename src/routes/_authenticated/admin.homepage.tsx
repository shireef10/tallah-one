import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Home, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

type Hero = { eyebrow?: string; title_template?: string; subtitle?: string; cta_primary_label?: string; cta_primary_href?: string; cta_secondary_label?: string; cta_secondary_href?: string };
type QuickAction = { title: string; href: string; icon?: string; color?: string };
type Banner = { title: string; body?: string; image_url?: string; href?: string; enabled?: boolean };
type Sections = Record<string, boolean>;

function useSetting<T>(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as T | null;
    },
  });
}

function useSaveSetting(key: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: unknown) => {
      const { error } = await supabase.from("site_settings").upsert({ key, value: value as never });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-settings", key] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

function HomepageAdmin() {
  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Home className="h-3 w-3" />Admin</span>}
        title="Homepage Builder"
        description="Edit the hero, quick actions, banners and section visibility shown on the employee dashboard."
      />
      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="quick">Quick actions</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="hero"><HeroEditor /></TabsContent>
        <TabsContent value="quick"><QuickActionsEditor /></TabsContent>
        <TabsContent value="banners"><BannersEditor /></TabsContent>
        <TabsContent value="sections"><SectionsEditor /></TabsContent>
      </Tabs>
    </div>
  );
}

function HeroEditor() {
  const q = useSetting<Hero>("homepage_hero");
  const save = useSaveSetting("homepage_hero");
  const [v, setV] = useState<Hero>({});
  useEffect(() => { if (q.data) setV(q.data); }, [q.data]);
  return (
    <Card><CardContent className="p-6 space-y-4 max-w-2xl">
      <F label="Eyebrow text"><Input value={v.eyebrow ?? ""} onChange={(e) => setV({ ...v, eyebrow: e.target.value })} /></F>
      <F label="Title template (use {name} for user first name)"><Input value={v.title_template ?? ""} onChange={(e) => setV({ ...v, title_template: e.target.value })} /></F>
      <F label="Subtitle"><Textarea rows={2} value={v.subtitle ?? ""} onChange={(e) => setV({ ...v, subtitle: e.target.value })} /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Primary CTA label"><Input value={v.cta_primary_label ?? ""} onChange={(e) => setV({ ...v, cta_primary_label: e.target.value })} /></F>
        <F label="Primary CTA link"><Input value={v.cta_primary_href ?? ""} onChange={(e) => setV({ ...v, cta_primary_href: e.target.value })} /></F>
        <F label="Secondary CTA label"><Input value={v.cta_secondary_label ?? ""} onChange={(e) => setV({ ...v, cta_secondary_label: e.target.value })} /></F>
        <F label="Secondary CTA link"><Input value={v.cta_secondary_href ?? ""} onChange={(e) => setV({ ...v, cta_secondary_href: e.target.value })} /></F>
      </div>
      <Button onClick={() => save.mutate(v)} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save hero"}</Button>
    </CardContent></Card>
  );
}

function QuickActionsEditor() {
  const q = useSetting<QuickAction[]>("homepage_quick_actions");
  const save = useSaveSetting("homepage_quick_actions");
  const [items, setItems] = useState<QuickAction[]>([]);
  useEffect(() => { if (q.data) setItems(q.data); }, [q.data]);
  const update = (i: number, p: Partial<QuickAction>) => setItems(items.map((it, idx) => idx === i ? { ...it, ...p } : it));
  return (
    <Card><CardContent className="p-6 space-y-3">
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-end border rounded-lg p-3">
          <div className="col-span-4"><Label className="text-xs">Title</Label><Input value={it.title} onChange={(e) => update(i, { title: e.target.value })} /></div>
          <div className="col-span-4"><Label className="text-xs">Link</Label><Input value={it.href} onChange={(e) => update(i, { href: e.target.value })} placeholder="/workspace or https://" /></div>
          <div className="col-span-3"><Label className="text-xs">Color (Tailwind gradient suffix)</Label><Input value={it.color ?? ""} onChange={(e) => update(i, { color: e.target.value })} placeholder="from-rose-400 to-rose-600" /></div>
          <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setItems([...items, { title: "New action", href: "/workspace", color: "from-primary to-primary-glow" }])}><Plus className="h-4 w-4" />Add</Button>
        <Button onClick={() => save.mutate(items)} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save quick actions"}</Button>
      </div>
      <p className="text-xs text-muted-foreground">If left empty, the dashboard uses its built-in defaults.</p>
    </CardContent></Card>
  );
}

function BannersEditor() {
  const q = useSetting<Banner[]>("homepage_banners");
  const save = useSaveSetting("homepage_banners");
  const [items, setItems] = useState<Banner[]>([]);
  useEffect(() => { if (q.data) setItems(q.data); }, [q.data]);
  const update = (i: number, p: Partial<Banner>) => setItems(items.map((it, idx) => idx === i ? { ...it, ...p } : it));
  return (
    <Card><CardContent className="p-6 space-y-3">
      {items.map((b, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 border rounded-lg p-3">
          <div className="col-span-5 space-y-2">
            <div><Label className="text-xs">Title</Label><Input value={b.title} onChange={(e) => update(i, { title: e.target.value })} /></div>
            <div><Label className="text-xs">Body</Label><Textarea rows={2} value={b.body ?? ""} onChange={(e) => update(i, { body: e.target.value })} /></div>
          </div>
          <div className="col-span-5 space-y-2">
            <div><Label className="text-xs">Image URL</Label><Input value={b.image_url ?? ""} onChange={(e) => update(i, { image_url: e.target.value })} /></div>
            <div><Label className="text-xs">Click link</Label><Input value={b.href ?? ""} onChange={(e) => update(i, { href: e.target.value })} /></div>
          </div>
          <div className="col-span-2 flex flex-col items-end justify-between">
            <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            <div className="flex items-center gap-2 text-xs"><Switch checked={b.enabled !== false} onCheckedChange={(c) => update(i, { enabled: c })} />On</div>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setItems([...items, { title: "New banner", enabled: true }])}><Plus className="h-4 w-4" />Add</Button>
        <Button onClick={() => save.mutate(items)} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save banners"}</Button>
      </div>
    </CardContent></Card>
  );
}

function SectionsEditor() {
  const q = useSetting<Sections>("homepage_sections");
  const save = useSaveSetting("homepage_sections");
  const [v, setV] = useState<Sections>({});
  useEffect(() => { if (q.data) setV(q.data); }, [q.data]);
  const keys: { key: string; label: string }[] = [
    { key: "hero", label: "Hero section" },
    { key: "admin_shortcut", label: "Admin shortcut card" },
    { key: "quick_access", label: "Quick access grid" },
    { key: "tutorials", label: "Latest tutorials" },
    { key: "announcements", label: "Recent announcements" },
    { key: "your_day", label: "Your day widget" },
  ];
  return (
    <Card><CardContent className="p-6 space-y-3 max-w-lg">
      {keys.map((k) => (
        <div key={k.key} className="flex items-center justify-between py-2 border-b last:border-b-0">
          <span className="text-sm">{k.label}</span>
          <Switch checked={v[k.key] !== false} onCheckedChange={(c) => setV({ ...v, [k.key]: c })} />
        </div>
      ))}
      <Button onClick={() => save.mutate(v)} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save visibility"}</Button>
    </CardContent></Card>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
