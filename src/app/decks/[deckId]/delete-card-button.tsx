"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteCardAction } from "./actions";

export function DeleteCardButton({
  deckId,
  cardId,
  cardNumber,
}: {
  deckId: number;
  cardId: number;
  cardNumber: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeleteCard() {
    startTransition(async () => {
      const result = await deleteCardAction({ deckId, cardId });

      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete card {cardNumber}?</DialogTitle>
          <DialogDescription>
            This will permanently remove this flashcard from the deck.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteCard}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
