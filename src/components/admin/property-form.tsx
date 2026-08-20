"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyFormSchema,
  type PropertyFormValues,
  PROPERTY_TYPES,
  APPROVAL_STATUSES,
  POSSESSION_STATUSES,
  PLOT_DOCUMENTATION,
  WATER_SOURCES,
  AREA_UNITS,
} from "@/lib/validation/property-schema";
import { CITIES, CITY_LABELS, getLocationsByCity } from "@/data/locations";
import { AGENTS } from "@/data/agents";
import { slugify } from "@/lib/slugify";
import { createProperty, updateProperty } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/admin/tag-input";
import { ImageArrayField } from "@/components/admin/image-array-field";
import { Wand2 } from "lucide-react";

const FLAG_FIELDS = [
  { name: "cornerPlot", label: "Corner Plot" },
  { name: "boulevardFacing", label: "Boulevard Facing" },
  { name: "parkFacing", label: "Park Facing" },
  { name: "gasAvailable", label: "Gas Available" },
  { name: "electricityAvailable", label: "Electricity Available" },
  { name: "sewerage", label: "Sewerage" },
  { name: "servantQuarter", label: "Servant Quarter" },
  { name: "basement", label: "Basement" },
] as const;

const DEFAULT_VALUES: PropertyFormValues = {
  purpose: "buy",
  type: "House",
  title: "",
  ref: "",
  slug: "",
  description: "",
  price: 0,
  priceUnit: "total",
  pricePerMarla: undefined,
  areaValue: 0,
  areaUnit: "marla",
  beds: undefined,
  baths: undefined,
  city: "islamabad",
  areaSlug: "",
  sector: "",
  features: [],
  amenities: [],
  approval: "Not Applicable",
  possession: "Ready",
  plotFileOrRegistry: "Not Applicable",
  cornerPlot: false,
  boulevardFacing: false,
  parkFacing: false,
  gasAvailable: false,
  electricityAvailable: false,
  waterSource: "Supply Line",
  sewerage: false,
  floors: undefined,
  servantQuarter: false,
  basement: false,
  images: [],
  floorPlans: [],
  agentId: AGENTS[0]?.id ?? "",
  addedAt: new Date().toISOString().slice(0, 10),
  isFeatured: false,
  isVerified: false,
};

export function PropertyForm({
  mode,
  propertyId,
  defaultValues,
}: {
  mode: "create" | "edit";
  propertyId?: string;
  defaultValues?: PropertyFormValues;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  const selectedCity = useWatch({ control: form.control, name: "city" });
  const areaOptions = useMemo(() => getLocationsByCity(selectedCity), [selectedCity]);

  async function onSubmit(values: PropertyFormValues) {
    setSubmitting(true);
    const result = mode === "create" ? await createProperty(values) : await updateProperty(propertyId as string, values);
    setSubmitting(false);

    if (!result.success) {
      toast({ title: "Couldn't save listing", description: result.error, variant: "destructive" });
      return;
    }

    toast({ title: mode === "create" ? "Listing published" : "Listing updated", variant: "success" });
    router.push("/admin/properties");
    router.refresh();
  }

  function generateSlug() {
    const title = form.getValues("title");
    if (title) form.setValue("slug", slugify(title), { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormSection title="Basics">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
                      {(["buy", "rent"] as const).map((p) => (
                        <label key={p} htmlFor={`purpose-${p}`} className={radioLabelClass}>
                          <RadioGroupItem id={`purpose-${p}`} value={p} />
                          {p === "buy" ? "For Sale" : "For Rent"}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="14 Marla House for Sale in DHA Phase I, Islamabad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="ref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Code</FormLabel>
                  <FormControl>
                    <Input placeholder="EE-1042" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="14-marla-house-for-sale-dha-phase-i-islamabad" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={generateSlug} aria-label="Generate slug from title">
                      <Wand2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Describe the property, its condition and what makes it stand out…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Pricing">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (PKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Unit</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
                      {(["total", "month"] as const).map((u) => (
                        <label key={u} htmlFor={`price-unit-${u}`} className={radioLabelClass}>
                          <RadioGroupItem id={`price-unit-${u}`} value={u} />
                          {u === "total" ? "Total" : "Per Month"}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerMarla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price / Marla (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Size & Rooms">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <FormField
              control={form.control}
              name="areaValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="any"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areaUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AREA_UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Location">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("areaSlug", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CITY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areaSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Neighborhood</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a neighborhood" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areaOptions.map((a) => (
                        <SelectItem key={a.slug} value={a.slug}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="F-10/1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Features & Amenities">
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Marble Flooring — press Enter to add" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Gated Community — press Enter to add" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Pakistan-Specific Details">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="approval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approval</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APPROVAL_STATUSES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="possession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Possession</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {POSSESSION_STATUSES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plotFileOrRegistry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentation</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLOT_DOCUMENTATION.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Source</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WATER_SOURCES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="floors"
            render={({ field }) => (
              <FormItem className="sm:w-48">
                <FormLabel>Floors (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FLAG_FIELDS.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <label htmlFor={`flag-${name}`} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-hairline px-3 py-2.5">
                    <Checkbox id={`flag-${name}`} checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    <span className="text-body-sm text-ink-primary">{label}</span>
                  </label>
                )}
              />
            ))}
          </div>
        </FormSection>

        <FormSection title="Photos">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageArrayField items={field.value} onChange={field.onChange} folder="listings" emptyLabel="No photos uploaded yet." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Floor Plans (optional)">
          <FormField
            control={form.control}
            name="floorPlans"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageArrayField
                    items={field.value}
                    onChange={field.onChange}
                    folder="floor-plans"
                    emptyLabel="No floor plans uploaded."
                    extra={{ key: "label", label: "Label", placeholder: "Ground Floor" }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Listing Meta">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Agent</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AGENTS.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Added</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap gap-5">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <label htmlFor="is-featured" className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox id="is-featured" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <Label htmlFor="is-featured" className="cursor-pointer">Featured listing</Label>
                </label>
              )}
            />
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <label htmlFor="is-verified" className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox id="is-verified" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <Label htmlFor="is-verified" className="cursor-pointer">Verified</Label>
                </label>
              )}
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : mode === "create" ? "Publish Listing" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const radioLabelClass =
  "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-3 py-2 text-body-sm text-ink-primary has-[[data-state=checked]]:border-navy-800 has-[[data-state=checked]]:bg-surface-raised";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border-hairline bg-surface-raised p-6">
      <h2 className="mb-5 text-heading-md uppercase text-ink-primary">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
