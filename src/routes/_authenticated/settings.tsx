import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Tallah One" }] }),
  component: Settings,
});

function Settings() {
  const { profile, user, refresh } = useAuth();
  const { theme, toggle } = useTheme();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [position, setPosition] = useState(profile?.position ?? "");
  const [department, setDepartment] = useState(profile?.department ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, position, department, phone }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("Profile updated");
  };

  return (
    <div>
      <PageHeader eyebrow="Your account" title="Settings" description="Update your profile and preferences." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle><CardDescription>{user?.email}</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2"><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Position</Label><Input value={position} onChange={(e) => setPosition(e.target.value)} /></div>
              <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <Button type="submit" disabled={busy}>Save changes</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Dark mode</p><p className="text-sm text-muted-foreground">Toggle dark theme</p></div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
