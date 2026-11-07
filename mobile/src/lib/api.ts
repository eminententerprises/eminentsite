import { CONTACT } from "@/config/site";
import type { LeadPayload, LeadResponse } from "@/types";

/**
 * Base URL of the live website. The app posts enquiries to the same
 * /api/leads endpoint the website's forms use, so every lead — web or
 * app — goes through one place.
 */
export const WEB_BASE_URL = (process.env.EXPO_PUBLIC_WEB_BASE_URL || CONTACT.websiteHref).replace(/\/$/, "");

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  try {
    const res = await fetch(`${WEB_BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, source: "android-app" }),
    });
    const data = (await res.json().catch(() => null)) as LeadResponse | null;
    if (!res.ok || !data?.success) {
      return { success: false, message: data?.message ?? "Something went wrong. Please try again." };
    }
    return data;
  } catch {
    return { success: false, message: "We couldn't send that. Check your connection and try again." };
  }
}
