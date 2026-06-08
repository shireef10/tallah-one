import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/service-types")({
  component: () => (
    <CrudTable
      table="service_request_types"
      queryKey="admin-service-types"
      title="Service Request Types"
      description="Configurable catalog of services employees can request."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "department"]}
      columns={[
        { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "department", header: "Department" },
        { key: "active", header: "Status", render: (r) => r.active ? <Pill tone="success">Active</Pill> : <Pill>Hidden</Pill> },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "department", label: "Department", type: "text" },
        { name: "icon", label: "Icon name", type: "text", placeholder: "ClipboardList" },
        { name: "fields", label: "Form fields (JSON)", type: "json",
          help: 'Array of {name,label,type,required}. e.g. [{"name":"reason","label":"Reason","type":"textarea","required":true}]' },
        { name: "active", label: "Active", type: "boolean", defaultValue: true },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
