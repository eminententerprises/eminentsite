"use client";

import { useRef } from "react";
import { GripVertical, Trash2, Upload, Loader2 } from "lucide-react";
import { useStorageUpload } from "@/lib/supabase/use-storage-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BaseImage {
  src: string;
  alt: string;
}

/**
 * Shared list editor for `images` (PropertyImage[]) and `floorPlans`
 * (FloorPlan[]) — both are ordered arrays of uploaded photos with per-item
 * text fields, differing only in which extra field they carry.
 */
export function ImageArrayField<T extends BaseImage>({
  items,
  onChange,
  folder,
  extra,
  emptyLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  folder: "listings" | "floor-plans";
  /** Extra per-item field beyond src/alt (e.g. floor plan label). */
  extra?: { key: keyof T; label: string; placeholder: string };
  emptyLabel: string;
}) {
  const { upload, uploading, error } = useStorageUpload(folder);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const uploaded: T[] = [];
    for (const file of Array.from(fileList)) {
      const result = await upload(file);
      if (result) {
        uploaded.push({
          src: result.src,
          alt: "",
          // Floor plans (extra.key = "label") don't carry width/height in
          // their type; property photos do and need them for the zod schema.
          ...(extra ? { [extra.key]: "" } : { width: result.width, height: result.height }),
        } as T);
      }
    }
    if (uploaded.length > 0) onChange([...items, ...uploaded]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updateItem(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {uploading ? "Uploading…" : "Upload Photos"}
        </Button>
        {error && <p className="mt-2 text-body-sm text-danger">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-body-sm text-ink-muted">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={`${item.src}-${index}`} className="flex gap-3 rounded-xl border border-border-hairline bg-surface-raised p-3">
              <div className="flex shrink-0 flex-col items-center justify-center gap-1 text-ink-muted">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="font-tabular-nums text-body-sm">{index + 1}</span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />

              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <Input
                  value={item.alt}
                  onChange={(e) => updateItem(index, { alt: e.target.value } as Partial<T>)}
                  placeholder="Alt text, e.g. Front elevation with lawn"
                  className="flex-1"
                />
                {extra && (
                  <Input
                    value={(item[extra.key] as string) ?? ""}
                    onChange={(e) => updateItem(index, { [extra.key]: e.target.value } as Partial<T>)}
                    placeholder={extra.placeholder}
                    className="sm:w-40"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label="Remove photo"
                className="shrink-0 self-start text-ink-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
