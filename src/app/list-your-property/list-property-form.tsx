"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { leadSchema } from "@/lib/validation/lead-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyLine } from "@/components/brand/survey-line";
import { CITY_LABELS, CITIES } from "@/data/locations";
import type { CityKey, PropertyType } from "@/types";

const PROPERTY_TYPES: PropertyType[] = [
  "House",
  "Upper Portion",
  "Lower Portion",
  "Flat/Apartment",
  "Penthouse",
  "Farm House",
  "Residential Plot",
  "Commercial Plot",
  "Plot File",
  "Agricultural Land",
  "Shop",
  "Office",
  "Warehouse",
  "Building",
  "Factory",
];

const listingSchema = leadSchema.extend({
  intent: z.enum(["sell", "rent"]),
  propertyType: z.string().trim().min(1, "Select a property type"),
  city: z.string().trim().min(1, "Select a city"),
  area: z.string().trim().min(2, "Enter the area / society"),
  expectedPrice: z.string().trim().min(1, "Enter your expected price"),
  details: z.string().trim().max(1000, "Keep this under 1000 characters").optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const STEPS = ["Property Details", "Your Contact Information"] as const;

export function ListPropertyForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      intent: "sell",
      propertyType: "",
      city: "",
      area: "",
      expectedPrice: "",
      details: "",
      name: "",
      phone: "",
      email: "",
      reason: "Buy/Sell",
    },
    mode: "onBlur",
  });

  async function goToStepTwo() {
    const valid = await form.trigger(["intent", "propertyType", "city", "area", "expectedPrice"]);
    if (valid) setStep(1);
  }

  async function onSubmit(values: ListingFormValues) {
    setStatus("submitting");
    setServerMessage(null);

    const composedMessage = [
      `Listing request: ${values.intent === "sell" ? "Sell" : "Rent out"} a ${values.propertyType} in ${values.area}, ${CITY_LABELS[values.city as CityKey] ?? values.city}.`,
      `Expected price: ${values.expectedPrice}.`,
      values.details ? `Additional details: ${values.details}` : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          reason: "Buy/Sell",
          message: composedMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setServerMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setServerMessage(data.message);
    } catch {
      setStatus("error");
      setServerMessage("We couldn't send that — check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-success bg-surface-sunken px-6 py-12 text-center">
        <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        <p className="text-heading-md text-ink-primary">{serverMessage}</p>
        <p className="text-body-sm text-ink-secondary">Our team will review your submission and reach out to arrange next steps.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-accent-strong">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
        <SurveyLine className="mt-2" ticks={8} label={step === 0 ? "Property" : "Contact"} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="intent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I want to</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-flow-col justify-start gap-6">
                        <Label className="flex cursor-pointer items-center gap-2 font-normal">
                          <RadioGroupItem value="sell" id="intent-sell" /> Sell
                        </Label>
                        <Label className="flex cursor-pointer items-center gap-2 font-normal">
                          <RadioGroupItem value="rent" id="intent-rent" /> Rent Out
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
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

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
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
              </div>

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area / Society</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. DHA Phase II, Bahria Town" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Price (PKR)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2.5 Crore or 85,000/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Beds, baths, condition, possession status…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" size="lg" className="self-start" onClick={goToStepTwo}>
                Next: Contact Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ahmed Khan" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="0300-1234567" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {status === "error" && serverMessage && (
                <p role="alert" className="text-body-sm font-medium text-danger">
                  {serverMessage}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </Button>
                <Button type="submit" size="lg" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting…" : "Submit Listing Request"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
