import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/admin/media-upload";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

type Branding = {
  platform_name?: string;
  tagline?: string;
  hero_greeting?: string;
  logo_url?: string | null;
  primary_contact_email?: string;
  support_phone?: string;
};

function SettingsAdmin() {
  const qc = useQueryClient();
  const settings = useQuery({
    queryKey: ["site-settings", "branding"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "branding").maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as Branding;
    },
  });

  const [form, setForm] = useState<Branding>({});
  useEffect(() => { if (settings.data) setForm(settings.data); }, [settings.data]);

  const save = useMutation({
    mutationFn: async (v: Branding) => {
      const { error } = await supabase.from("site_settings").upsert({ key: "branding", value: v });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-settings"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><Settings className="h-3 w-3" />Admin</span>}
        title="Site Settings"
        description="Branding, contact information and platform-wide configuration."
      />
      <Card>
        <CardContent className="p-6 space-y-5 max-w-2xl">
          <Field label="Platform name"><Input value={form.platform_name ?? ""} onChange={(e) => setForm({ ...form, platform_name: e.target.value })} /></Field>
          <Field label="Tagline"><Input value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
          <Field label="Dashboard greeting"><Textarea rows={2} value={form.hero_greeting ?? ""} onChange={(e) => setForm({ ...form, hero_greeting: e.target.value })} /></Field>
          <Field label="Logo"><MediaUpload value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} folder="branding" /></Field>
          <Field label="Primary contact email"><Input value={form.primary_contact_email ?? ""} onChange={(e) => setForm({ ...form, primary_contact_email: e.target.value })} /></Field>
          <Field label="Support phone"><Input value={form.support_phone ?? ""} onChange={(e) => setForm({ ...form, support_phone: e.target.value })} /></Field>
          <div className="pt-2">
            <Button onClick={() => save.mutate(form)} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save settings"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
