"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { propertyFormSchema, type PropertyFormValues } from "@/lib/validation/property-schema";
import { formValuesToRow } from "@/lib/admin/property-mapper";

export interface ActionResult {
  success: boolean;
  error?: string;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");
  return supabase;
}

export async function createProperty(values: PropertyFormValues): Promise<ActionResult> {
  const parsed = propertyFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid listing data." };
  }

  try {
    const supabase = await requireAdmin();
    const row = formValuesToRow(parsed.data);
    const { error } = await supabase.from("properties").insert(row);
    if (error) return { success: false, error: error.message };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateProperty(id: string, values: PropertyFormValues): Promise<ActionResult> {
  const parsed = propertyFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid listing data." };
  }

  try {
    const supabase = await requireAdmin();
    const row = formValuesToRow(parsed.data);
    const { error } = await supabase.from("properties").update(row).eq("id", id);
    if (error) return { success: false, error: error.message };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  return { success: true };
}
