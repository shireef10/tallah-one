import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/faqs")({
  head: () => ({ meta: [{ title: "FAQs — Tallah One" }] }),
  component: FAQsPage,
});

function FAQsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs").select("*").eq("published", true)
        .order("category").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const grouped = (data ?? []).reduce<Record<string, typeof data extends (infer T)[] | undefined ? T[] : never>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader eyebrow="Quick answers" title="Frequently Asked Questions" description="Common questions across ERP, CRM, marketing, support and operations." />
      {isLoading ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : (data ?? []).length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No FAQs published yet.</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <Card key={cat}>
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold mb-3">{cat}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((f) => (
                    <AccordionItem key={f.id} value={f.id}>
                      <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-wrap">{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
