import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/knowledge-categories")({
  component: () => (
    <CrudTable
      table="knowledge_categories"
      queryKey="admin-knowledge-cats"
      title="Knowledge Categories"
      description="Group articles into sections shown in the Knowledge Base sidebar."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "slug"]}
      columns={[
        { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "slug", header: "Slug" },
        { key: "sort_order", header: "Order" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icon name", type: "text", placeholder: "BookOpen" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
