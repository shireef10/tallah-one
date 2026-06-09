import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: () => (
    <CrudTable
      table="team_members"
      queryKey="admin-team"
      title="Team Directory"
      description="People shown in the Team Directory. Add the Digital Transformation team and beyond."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "department", "position"]}
      columns={[
        { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "position", header: "Position" },
        { key: "department", header: "Department" },
        { key: "email", header: "Email" },
      ]}
      fields={[
        { name: "name", label: "Full name", type: "text", required: true },
        { name: "position", label: "Position", type: "text" },
        { name: "department", label: "Department", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "photo_url", label: "Photo", type: "image", folder: "team" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
        { name: "whatsapp_group_url", label: "WhatsApp group / contact URL", type: "text" },
        { name: "visible", label: "Visible in directory", type: "boolean", defaultValue: true },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
