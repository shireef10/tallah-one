import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/processes")({
  component: () => (
    <CrudTable
      table="processes"
      queryKey="admin-processes"
      title="Process Library"
      description="Step-by-step procedures and SOPs for every department."
      orderBy={{ column: "updated_at", ascending: false }}
      searchableFields={["title", "department"]}
      columns={[
        { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title as string}</span> },
        { key: "department", header: "Department" },
        { key: "version", header: "Version" },
        { key: "published", header: "Status", render: (r) => r.published ? <Pill tone="success">Published</Pill> : <Pill tone="warning">Draft</Pill> },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "department", label: "Department", type: "text" },
        { name: "owner", label: "Process owner", type: "text" },
        { name: "version", label: "Version", type: "text", defaultValue: "1.0" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "content", label: "Steps (markdown)", type: "richtext", required: true },
        { name: "flowchart_url", label: "Flowchart image", type: "image", folder: "processes" },
        { name: "published", label: "Published", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
