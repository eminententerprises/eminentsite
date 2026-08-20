"use client";

import { MessageCircle } from "lucide-react";
import type { BrandKey } from "@/config/site";
import { buildWhatsAppLink, whatsAppConstructionMessage } from "@/lib/whatsapp";

export function WhatsAppFloat({ brand }: { brand: BrandKey }) {
  const message =
    brand === "buraq"
      ? whatsAppConstructionMessage()
      : "Hi Eminent Enterprises, I'd like to know more about your property services.";

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-overlay transition-transform hover:scale-105 md:bottom-6 md:right-6"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
