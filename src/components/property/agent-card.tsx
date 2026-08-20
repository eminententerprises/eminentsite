"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, Clock } from "lucide-react";
import type { Agent } from "@/types";
import { PropertyImage } from "@/components/media/property-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { buildWhatsAppLink, whatsAppEnquiryMessage } from "@/lib/whatsapp";

export function AgentCard({ agent, propertyRef, propertyTitle }: { agent: Agent; propertyRef: string; propertyTitle: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const whatsappHref = buildWhatsAppLink(whatsAppEnquiryMessage({ ref: propertyRef, title: propertyTitle }));

  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-raised p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <PropertyImage src={agent.photo} alt={agent.name} fill sizes="56px" className="object-cover" />
        </div>
        <div>
          <p className="font-semibold text-ink-primary">{agent.name}</p>
          <p className="text-body-sm text-ink-secondary">{agent.role}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-body-sm text-ink-muted">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {/* PLACEHOLDER: mock response-time metric from agents.ts mock data */}
        Typically responds within {agent.responseTimeHours}h
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <Button asChild variant="whatsapp" size="lg">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> WhatsApp Now
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={`tel:${agent.phone.replace(/[^0-9+]/g, "")}`}>
            <Phone className="h-4 w-4" /> Call {agent.phone}
          </a>
        </Button>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="lg">
              <Mail className="h-4 w-4" /> Send Enquiry by Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enquire About This Property</DialogTitle>
            </DialogHeader>
            <EnquiryForm propertyRef={propertyRef} onSuccess={() => undefined} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
