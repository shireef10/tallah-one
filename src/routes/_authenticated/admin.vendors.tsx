import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/vendors")({
  component: () => (
    <CrudTable
      table="vendors"
      queryKey="admin-vendors"
      title="Vendor Directory"
      description="Suppliers, providers and procurement contacts."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "category", "country"]}
      columns={[
        { key: "name", header: "Vendor", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "category", header: "Category" },
        { key: "country", header: "Country" },
        { key: "visible", header: "Status", render: (r) => r.visible ? <Pill tone="success">Visible</Pill> : <Pill>Hidden</Pill> },
      ]}
      fields={[
        { name: "name", label: "Vendor name", type: "text", required: true },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "logo_url", label: "Logo", type: "image", folder: "vendors" },
        { name: "website_url", label: "Website URL", type: "text" },
        { name: "contact_name", label: "Contact name", type: "text" },
        { name: "contact_email", label: "Contact email", type: "text" },
        { name: "contact_phone", label: "Contact phone", type: "text" },
        { name: "country", label: "Country", type: "text" },
        { name: "visible", label: "Visible to employees", type: "boolean", defaultValue: true },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
