import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/partners")({
  component: () => (
    <CrudTable
      table="partners"
      queryKey="admin-partners"
      title="Partner Directory"
      description="Strategic partners, integrators and alliances."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "category", "partnership_tier"]}
      columns={[
        { key: "name", header: "Partner", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "category", header: "Category" },
        { key: "partnership_tier", header: "Tier" },
        { key: "visible", header: "Status", render: (r) => r.visible ? <Pill tone="success">Visible</Pill> : <Pill>Hidden</Pill> },
      ]}
      fields={[
        { name: "name", label: "Partner name", type: "text", required: true },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "logo_url", label: "Logo", type: "image", folder: "partners" },
        { name: "website_url", label: "Website URL", type: "text" },
        { name: "contact_name", label: "Contact name", type: "text" },
        { name: "contact_email", label: "Contact email", type: "text" },
        { name: "contact_phone", label: "Contact phone", type: "text" },
        { name: "partnership_tier", label: "Tier (Gold, Silver…)", type: "text" },
        { name: "visible", label: "Visible to employees", type: "boolean", defaultValue: true },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
