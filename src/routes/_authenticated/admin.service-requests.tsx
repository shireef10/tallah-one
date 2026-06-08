import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, Pill } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/service-requests")({
  component: () => (
    <CrudTable
      table="service_requests"
      queryKey="admin-service-requests"
      title="Service Requests"
      description="Employee-submitted service requests. Update status and assignee here."
      orderBy={{ column: "created_at", ascending: false }}
      searchableFields={["status", "notes"]}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs">{(r.id as string).slice(0, 8)}</span> },
        { key: "status", header: "Status", render: (r) => <Pill tone={r.status === "completed" ? "success" : r.status === "rejected" ? "destructive" : r.status === "pending" ? "warning" : "default"}>{r.status as string}</Pill> },
        { key: "created_at", header: "Submitted", render: (r) => new Date(r.created_at as string).toLocaleDateString() },
        { key: "notes", header: "Notes", render: (r) => <span className="text-sm text-muted-foreground">{(r.notes as string) ?? "—"}</span> },
      ]}
      fields={[
        { name: "status", label: "Status", type: "select", required: true, options: [
          { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" },
          { value: "in_progress", label: "In progress" }, { value: "completed", label: "Completed" }, { value: "rejected", label: "Rejected" }] },
        { name: "notes", label: "Admin notes", type: "textarea" },
        { name: "payload", label: "Submitted data (JSON)", type: "json" },
      ]}
    />
  ),
});
