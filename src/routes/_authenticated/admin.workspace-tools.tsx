import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/workspace-tools")({
  component: () => (
    <CrudTable
      table="workspace_tools"
      queryKey="admin-workspace-tools"
      title="Workspace Tools"
      description="External systems shown on the Workspace page (ERP, CRM, etc.)."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "category"]}
      columns={[
        { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "category", header: "Category" },
        { key: "sort_order", header: "Order" },
      ]}
      fields={[
        { name: "name", label: "Tool name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true, placeholder: "ERP, CRM, E-Commerce, Marketing, BI, Communication, Other" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "logo_url", label: "Logo", type: "image", folder: "tools" },
        { name: "access_url", label: "Access URL", type: "text", required: true, placeholder: "https://..." },
        { name: "tutorial_url", label: "Tutorial URL", type: "text" },
        { name: "documentation_url", label: "Documentation URL", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
