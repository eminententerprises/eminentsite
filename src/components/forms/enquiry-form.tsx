"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadFormValues } from "@/lib/validation/lead-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EnquiryReason } from "@/types";
import { CheckCircle2 } from "lucide-react";

const REASONS: EnquiryReason[] = ["Buy/Sell", "Investment", "Property Management", "Construction", "Renovation", "Other"];

export function EnquiryForm({
  propertyRef,
  defaultReason,
  showReason = false,
  submitLabel = "Send Enquiry",
  onSuccess,
}: {
  propertyRef?: string;
  defaultReason?: EnquiryReason;
  showReason?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", message: "", reason: defaultReason, propertyRef },
  });

  async function onSubmit(values: LeadFormValues) {
    setStatus("submitting");
    setServerMessage(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setServerMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setServerMessage(data.message);
      form.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
      setServerMessage("We couldn't send that — check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-success bg-surface-sunken px-6 py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
        <p className="text-body-md font-semibold text-ink-primary">{serverMessage}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
        <div className="grid gap-4 sm:grid-cols-2">
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

        {showReason && (
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What can we help with?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us what you're looking for…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "error" && serverMessage && (
          <p role="alert" className="text-body-sm font-medium text-danger">
            {serverMessage}
          </p>
        )}

        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
