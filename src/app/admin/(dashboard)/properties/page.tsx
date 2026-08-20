import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rowToProperty, type PropertyRow } from "@/lib/admin/property-mapper";
import { Button } from "@/components/ui/button";
import { PropertiesTable } from "@/components/admin/properties-table";

export const metadata: Metadata = { title: "Listings" };

export default async function AdminPropertiesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").order("added_at", { ascending: false }).returns<PropertyRow[]>();

  const properties = (data ?? []).map(rowToProperty);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm">Listings</h1>
          <p className="mt-1 text-body-md text-ink-secondary">Every property currently published on the site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Listing
          </Link>
        </Button>
      </div>

      {error && <p className="mt-6 text-body-sm text-danger">Couldn&apos;t load listings: {error.message}</p>}

      <div className="mt-8">
        <PropertiesTable properties={properties} />
      </div>
    </div>
  );
}
