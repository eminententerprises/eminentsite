import type { ServiceFaq } from "@/data/service-details";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ServiceFaqAccordion({ faqs }: { faqs: ServiceFaq[] }) {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq, i) => (
        <AccordionItem key={faq.question} value={`faq-${i}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
