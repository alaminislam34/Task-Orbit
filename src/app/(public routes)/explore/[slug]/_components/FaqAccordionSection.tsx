"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqAccordionSectionProps = {
  faqs: Array<{ question: string; answer: string }>;
};

export default function FaqAccordionSection({ faqs }: FaqAccordionSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="border-l-4 border-emerald-500 pl-4 text-2xl font-black">
        Frequently Asked Questions
      </h2>

      <div className="rounded-lg border border-border bg-card p-4 md:p-6">
        <Accordion type="single" collapsible defaultValue={faqs[0]?.question}>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="rounded-lg px-3 transition-colors hover:bg-muted/30"
            >
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}