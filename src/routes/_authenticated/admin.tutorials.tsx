import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/tutorials")({
  component: () => (
    <CrudTable
      table="tutorials"
      queryKey="admin-tutorials"
      title="Tutorials & Tallah Academy"
      description="Video lessons and PDFs available to all employees."
      orderBy={{ column: "created_at", ascending: false }}
      searchableFields={["title", "category"]}
      columns={[
        { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title as string}</span> },
        { key: "category", header: "Category" },
        { key: "duration_minutes", header: "Duration", render: (r) => r.duration_minutes ? `${r.duration_minutes} min` : "—" },
        { key: "views", header: "Views" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. ERP, CRM, Onboarding" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "thumbnail_url", label: "Thumbnail", type: "image", folder: "tutorials/thumbs" },
        { name: "video_url", label: "Video URL", type: "text", placeholder: "https:// or upload below" },
        { name: "pdf_url", label: "PDF / file", type: "file", folder: "tutorials/files", accept: "application/pdf" },
        { name: "duration_minutes", label: "Duration (minutes)", type: "number" },
      ]}
    />
  ),
});
