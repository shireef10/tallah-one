import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Trash2, Upload, Copy, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaPage,
});

const BUCKET = "tallah-media";

function MediaPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const list = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (asset: { id: string; bucket: string; path: string }) => {
      await supabase.storage.from(asset.bucket).remove([asset.path]);
      const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const path = `library/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
        if (up.error) { toast.error(up.error.message); continue; }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const { error } = await supabase.from("media_assets").insert({
          bucket: BUCKET, path, url: pub.publicUrl, name: file.name,
          mime_type: file.type, size_bytes: file.size, folder: "library",
          uploaded_by: user.id,
        });
        if (error) toast.error(error.message);
      }
      qc.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("Uploaded");
    } finally { setUploading(false); }
  };

  const rows = (list.data ?? []).filter((a) =>
    !search.trim() || a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" />Admin</span>}
        title="Media Library"
        description="Centralized images, PDFs, videos and documents. Reusable across pages."
      />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search media…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <label className="inline-flex">
          <input type="file" multiple className="hidden"
            onChange={(e) => { onFiles(e.target.files); e.currentTarget.value = ""; }} />
          <Button asChild disabled={uploading}>
            <span className="cursor-pointer"><Upload className="h-4 w-4 mr-1" />{uploading ? "Uploading…" : "Upload"}</span>
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rows.map((a) => {
          const isImage = a.mime_type?.startsWith("image/");
          return (
            <Card key={a.id} className="overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {isImage ? (
                  <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-muted-foreground p-3 text-center break-all">{a.mime_type ?? "file"}</div>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-xs font-medium truncate" title={a.name}>{a.name}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px]">{((a.size_bytes ?? 0)/1024).toFixed(0)} KB</Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs"
                    onClick={() => { navigator.clipboard.writeText(a.url); toast.success("URL copied"); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs"
                    onClick={() => remove.mutate({ id: a.id, bucket: a.bucket, path: a.path })}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!list.isLoading && rows.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-10 text-sm">No media yet. Upload your first file.</p>
        )}
      </div>
    </div>
  );
}
