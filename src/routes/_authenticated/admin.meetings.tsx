import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/meetings")({
  component: () => (
    <CrudTable
      table="meeting_links"
      queryKey="admin-meeting-links"
      title="Meeting Links"
      description="Calendly or other booking links per department."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["name", "department"]}
      columns={[
        { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        { key: "department", header: "Department" },
        { key: "provider", header: "Provider" },
        { key: "active", header: "Status", render: (r) => r.active ? <Pill tone="success">Active</Pill> : <Pill>Hidden</Pill> },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "department", label: "Department", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "url", label: "Booking URL", type: "text", required: true },
        { name: "provider", label: "Provider", type: "select", defaultValue: "calendly", options: [
          { value: "calendly", label: "Calendly" }, { value: "google", label: "Google Calendar" },
          { value: "outlook", label: "Outlook" }, { value: "zoom", label: "Zoom" }, { value: "other", label: "Other" }] },
        { name: "active", label: "Active", type: "boolean", defaultValue: true },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
