"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { updateCardAction } from "./actions";

export function EditCardButton({
  deckId,
  cardId,
  cardNumber,
  front: initialFront,
  back: initialBack,
}: {
  deckId: number;
  cardId: number;
  cardNumber: number;
  front: string;
  back: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setFront(initialFront);
      setBack(initialBack);
    }

    setOpen(nextOpen);
  }

  function handleUpdateCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateCardAction({ deckId, cardId, front, back });

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card {cardNumber}</DialogTitle>
          <DialogDescription>
            Update the front and back text for this flashcard.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleUpdateCard}>
          <div className="grid gap-3">
            <Label htmlFor={`card-${cardId}-front`}>Front</Label>
            <Input
              id={`card-${cardId}-front`}
              value={front}
              onChange={(event) => setFront(event.target.value)}
              placeholder="Question, term, or prompt"
              disabled={isPending}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor={`card-${cardId}-back`}>Back</Label>
            <Textarea
              id={`card-${cardId}-back`}
              value={back}
              onChange={(event) => setBack(event.target.value)}
              placeholder="Answer, definition, or explanation"
              disabled={isPending}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
