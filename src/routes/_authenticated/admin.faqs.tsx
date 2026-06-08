import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/crud-table";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: () => (
    <CrudTable
      table="faqs"
      queryKey="admin-faqs"
      title="FAQs"
      description="Frequently asked questions with answers."
      orderBy={{ column: "sort_order", ascending: true }}
      searchableFields={["question", "category"]}
      columns={[
        { key: "question", header: "Question", render: (r) => <span className="font-medium">{r.question as string}</span> },
        { key: "category", header: "Category" },
        { key: "sort_order", header: "Order" },
        { key: "helpful_count", header: "👍" },
      ]}
      fields={[
        { name: "category", label: "Category", type: "text", required: true, defaultValue: "General" },
        { name: "question", label: "Question", type: "text", required: true },
        { name: "answer", label: "Answer", type: "richtext", required: true },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "published", label: "Published", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
