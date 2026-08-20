"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProperty } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProperty(id);
      if (!result.success) {
        toast({ title: "Couldn't delete listing", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Listing deleted", variant: "success" });
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" aria-label={`Delete ${title}`} onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 text-danger" aria-hidden="true" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Listing</DialogTitle>
          <DialogDescription>
            This permanently removes &ldquo;{title}&rdquo; and its photos won&apos;t be shown anywhere on the site. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete Listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
