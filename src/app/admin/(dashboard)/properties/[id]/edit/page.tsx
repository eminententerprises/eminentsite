import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToFormValues, type PropertyRow } from "@/lib/admin/property-mapper";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "Edit Listing" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("*").eq("id", id).single<PropertyRow>();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-display-sm">Edit Listing</h1>
      <p className="mt-1 text-body-md text-ink-secondary">{data.title}</p>
      <div className="mt-8">
        <PropertyForm mode="edit" propertyId={data.id} defaultValues={rowToFormValues(data)} />
      </div>
    </div>
  );
}
