import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/announcements")({
  component: () => (
    <CrudTable
      table="announcements"
      queryKey="admin-announcements"
      title="Announcements"
      description="Company news, alerts and updates pushed to every employee."
      orderBy={{ column: "published_at", ascending: false }}
      searchableFields={["title", "category"]}
      columns={[
        { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title as string}</span> },
        { key: "category", header: "Category" },
        { key: "priority", header: "Priority", render: (r) => <Pill tone={r.priority === "critical" ? "destructive" : r.priority === "high" ? "warning" : "default"}>{r.priority as string}</Pill> },
        { key: "pinned", header: "Pinned", render: (r) => r.pinned ? <Pill tone="success">Pinned</Pill> : <span className="text-muted-foreground text-xs">—</span> },
        { key: "published_at", header: "Published", render: (r) => new Date(r.published_at as string).toLocaleDateString() },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "category", label: "Category", type: "text", placeholder: "e.g. HR, IT, Company" },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "banner_image_url", label: "Banner image", type: "image", folder: "announcements" },
        { name: "priority", label: "Priority", type: "select", options: [
          { value: "low", label: "Low" }, { value: "normal", label: "Normal" },
          { value: "high", label: "High" }, { value: "critical", label: "Critical" }],
        },
        { name: "pinned", label: "Pin to top", type: "boolean" },
      ]}
    />
  ),
});
