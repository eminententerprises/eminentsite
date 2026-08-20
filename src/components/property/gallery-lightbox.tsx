"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { PropertyImage as PropertyImageType } from "@/types";
import { PropertyImage } from "@/components/media/property-image";
import { SurveyLine } from "@/components/brand/survey-line";
import { cn } from "@/lib/utils";

export function GalleryLightbox({ images, title }: { images: PropertyImageType[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => setIndex(((i % images.length) + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, goTo]);

  if (images.length === 0) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="relative col-span-4 row-span-2 aspect-[16/10] sm:col-span-2 sm:row-span-2"
        >
          <PropertyImage src={images[0].src} alt={images[0].alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" priority />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setIndex(i + 1);
              setOpen(true);
            }}
            className="relative col-span-2 row-span-1 hidden aspect-[4/3] sm:block"
          >
            <PropertyImage src={img.src} alt={img.alt} fill sizes="25vw" className="object-cover" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-navy-900/60 text-body-sm font-semibold text-white">
                <Expand className="mr-1.5 h-4 w-4" aria-hidden="true" /> +{images.length - 5} more
              </span>
            )}
          </button>
        ))}
      </div>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-navy-950/95" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[70] flex flex-col outline-none"
          aria-label={`${title} — image gallery`}
        >
          <DialogPrimitive.Title className="sr-only">{title} image gallery</DialogPrimitive.Title>
          <div className="flex items-center justify-between p-4">
            <p className="font-tabular-nums text-body-sm text-white/70">
              {index + 1} / {images.length}
            </p>
            <DialogPrimitive.Close className="flex h-11 w-11 items-center justify-center text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong">
              <X className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Close gallery</span>
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </button>
            <div className="relative h-full w-full max-w-4xl">
              <PropertyImage src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>

          <div className="px-4 pb-3">
            <SurveyLine
              inverted
              ticks={images.length}
              className="mb-3"
              label={images[index].alt}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-4">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  i === index ? "border-accent-strong" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <PropertyImage src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
