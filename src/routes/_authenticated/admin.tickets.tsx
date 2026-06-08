import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  component: () => (
    <CrudTable
      table="support_tickets"
      queryKey="admin-tickets"
      title="Support Tickets"
      description="All employee support tickets. Update status, priority and resolution."
      orderBy={{ column: "created_at", ascending: false }}
      searchableFields={["subject", "category", "status"]}
      columns={[
        { key: "subject", header: "Subject", render: (r) => <span className="font-medium">{r.subject as string}</span> },
        { key: "category", header: "Category" },
        { key: "priority", header: "Priority", render: (r) => <Pill tone={r.priority === "urgent" ? "destructive" : r.priority === "high" ? "warning" : "default"}>{r.priority as string}</Pill> },
        { key: "status", header: "Status", render: (r) => <Pill tone={r.status === "resolved" || r.status === "closed" ? "success" : r.status === "open" ? "warning" : "default"}>{r.status as string}</Pill> },
        { key: "created_at", header: "Opened", render: (r) => new Date(r.created_at as string).toLocaleDateString() },
      ]}
      fields={[
        { name: "subject", label: "Subject", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "priority", label: "Priority", type: "select", options: [
          { value: "low", label: "Low" }, { value: "normal", label: "Normal" },
          { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }] },
        { name: "status", label: "Status", type: "select", options: [
          { value: "open", label: "Open" }, { value: "in_progress", label: "In progress" },
          { value: "waiting", label: "Waiting" }, { value: "resolved", label: "Resolved" }, { value: "closed", label: "Closed" }] },
        { name: "resolution", label: "Resolution notes", type: "textarea" },
      ]}
    />
  ),
});
