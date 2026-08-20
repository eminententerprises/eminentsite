export type EnquiryReason =
  | "Buy/Sell"
  | "Investment"
  | "Property Management"
  | "Construction"
  | "Renovation"
  | "Other";

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  reason?: EnquiryReason;
  propertyRef?: string;
  preferredTime?: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
}
