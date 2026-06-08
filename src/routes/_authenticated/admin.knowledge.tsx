import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/knowledge")({
  component: () => (
    <CrudTable
      table="knowledge_articles"
      queryKey="admin-knowledge"
      title="Knowledge Articles"
      description="Documentation, policies and how-to articles for the company."
      orderBy={{ column: "updated_at", ascending: false }}
      searchableFields={["title", "slug"]}
      columns={[
        { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title as string}</span> },
        { key: "slug", header: "Slug" },
        { key: "published", header: "Status", render: (r) => r.published ? <Pill tone="success">Published</Pill> : <Pill tone="warning">Draft</Pill> },
        { key: "views", header: "Views" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, placeholder: "url-friendly-name" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content (markdown)", type: "richtext", required: true },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "published", label: "Published", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
