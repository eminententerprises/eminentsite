import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "New Listing" };

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-display-sm">New Listing</h1>
      <p className="mt-1 text-body-md text-ink-secondary">Fill in every section — this is exactly what shows on the public listing page.</p>
      <div className="mt-8">
        <PropertyForm mode="create" />
      </div>
    </div>
  );
}
