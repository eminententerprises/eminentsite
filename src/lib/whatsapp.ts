import { CONTACT } from "@/config/site";

/** Builds a wa.me deep link pre-filled with a listing/project reference. */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encoded}`;
}

export function whatsAppEnquiryMessage(params: { ref: string; title: string }): string {
  return `Hi Eminent Enterprises, I'm interested in ${params.title} (Ref: ${params.ref}). Could you share more details?`;
}

export function whatsAppProjectMessage(params: { title: string }): string {
  return `Hi, I'd like more information about ${params.title}.`;
}

export function whatsAppConstructionMessage(): string {
  return `Hi Buraq Eminent Constructors, I'd like to discuss a construction/renovation project.`;
}

export function whatsAppServiceMessage(params: { title: string }): string {
  return `Hi Eminent Enterprises, I'd like to discuss ${params.title}.`;
}
