import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/lead-schema";

/**
 * No backend exists yet — this validates the payload with the same Zod
 * schema the client form uses and returns a simulated success response.
 * Swap the body of the try block for a real CRM/email integration later;
 * the request/response contract stays the same.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    success: true,
    message: "Thanks — your enquiry has been received. Our team will contact you shortly.",
  });
}
