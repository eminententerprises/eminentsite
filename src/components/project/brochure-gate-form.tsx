"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export function BrochureGateForm({
  projectSlug,
  projectName,
  variant = "secondary",
  size = "lg",
  className,
}: {
  projectSlug: string;
  projectName: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={variant} size={size} className={className}>
          <FileDown aria-hidden="true" />
          Download Brochure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get the Brochure</DialogTitle>
          <DialogDescription>
            Share your details and we&apos;ll email the {projectName} brochure to you shortly.
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm propertyRef={projectSlug} submitLabel="Send & Get Brochure" />
      </DialogContent>
    </Dialog>
  );
}
