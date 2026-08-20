"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UploadedImage {
  src: string;
  width: number;
  height: number;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

/** Uploads a listing photo/floor-plan to the `property-images` Storage bucket and returns its public URL + dimensions. */
export function useStorageUpload(folder: "listings" | "floor-plans") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<UploadedImage | null> {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const dimensions = await readImageDimensions(file).catch(() => ({ width: 1200, height: 800 }));
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("property-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      return { src: data.publicUrl, ...dimensions };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
