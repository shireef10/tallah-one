import { useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BUCKET = "tallah-media";

export function MediaUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  label = "Upload file",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handle = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).createSignedUrl
        ? await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365)
        : { data: null };
      // Prefer storing the path for re-signing later; we store the signed URL here for simplicity.
      const url = data?.signedUrl ?? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3 rounded-md border p-2">
          {accept.startsWith("image") ? (
            <img src={value} alt="" className="h-14 w-14 rounded object-cover" />
          ) : (
            <div className="h-14 w-14 rounded bg-muted flex items-center justify-center text-xs">FILE</div>
          )}
          <a href={value} target="_blank" rel="noreferrer" className="text-xs truncate flex-1 underline">
            {value}
          </a>
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <label className="inline-flex">
        <input
          type="file"
          className="sr-only"
          accept={accept}
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = "";
          }}
        />
        <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 h-9 text-sm cursor-pointer hover:bg-accent">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : label}
        </span>
      </label>
    </div>
  );
}
