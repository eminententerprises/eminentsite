"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <div className="flex flex-col gap-1">
          <a
            href={buildWhatsAppLink(`${title} — ${typeof window !== "undefined" ? window.location.origin : ""}${path}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-2 text-body-sm text-ink-primary hover:bg-surface-sunken"
          >
            Share via WhatsApp
          </a>
          <button type="button" onClick={handleCopy} className="flex items-center gap-2 px-2 py-2 text-left text-body-sm text-ink-primary hover:bg-surface-sunken">
            {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
