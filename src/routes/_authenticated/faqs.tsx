import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const faqs = [
  { q: "How do I reset my ERP password?", a: "Open a support ticket under category ERP — the team will reset it within 1 business hour." },
  { q: "Where do I request a new system user?", a: "Use Service Requests → New User Request and fill in the role and department." },
  { q: "Can I download tutorial PDFs?", a: "Yes. Open a tutorial in the Learning Center and use the Download PDF button when attached." },
  { q: "How do I report a website bug?", a: "Open a support ticket under category Website with steps to reproduce and a screenshot." },
];

export const Route = createFileRoute("/_authenticated/faqs")({
  head: () => ({ meta: [{ title: "FAQs — Tallah One" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Quick answers" title="Frequently Asked Questions" description="The most common questions across ERP, CRM, marketing, WhatsApp, SMS, website, and general operations." />
      <Card><CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent></Card>
    </div>
  ),
});
