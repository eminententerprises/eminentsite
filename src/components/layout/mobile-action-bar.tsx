"use client";

import Link from "next/link";
import { Search, Heart, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-hairline bg-surface-raised md:hidden"
    >
      <Link href="/properties" className="flex flex-1 flex-col items-center gap-1 py-2.5 text-ink-secondary">
        <Search className="h-5 w-5" aria-hidden="true" />
        <span className="text-[0.625rem] uppercase tracking-wider">Search</span>
      </Link>
      <Link href="/shortlist" className="flex flex-1 flex-col items-center gap-1 py-2.5 text-ink-secondary">
        <Heart className="h-5 w-5" aria-hidden="true" />
        <span className="text-[0.625rem] uppercase tracking-wider">Shortlist</span>
      </Link>
      <a
        href={buildWhatsAppLink("Hi, I'm interested in this property. Could you share more details?")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-1 bg-[#25D366] py-2.5 text-white"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="text-[0.625rem] uppercase tracking-wider">WhatsApp</span>
      </a>
    </nav>
  );
}
