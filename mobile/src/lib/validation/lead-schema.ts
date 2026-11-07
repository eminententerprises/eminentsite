import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Use digits only, e.g. 0300-1234567"),
  email: z.union([z.string().trim().email("Enter a valid email"), z.literal("")]).optional(),
  message: z.string().trim().max(1000, "Keep the message under 1000 characters").optional(),
  reason: z.enum(["Buy/Sell", "Investment", "Property Management", "Construction", "Renovation", "Other"]).optional(),
  propertyRef: z.string().trim().optional(),
  preferredTime: z.string().trim().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
