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

import { updateDeckAction } from "./actions";

export function EditDeckButton({
  deckId,
  title: initialTitle,
  description: initialDescription,
}: {
  deckId: number;
  title: string;
  description: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription ?? "");
    }

    setOpen(nextOpen);
  }

  function handleUpdateDeck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateDeckAction({ deckId, title, description });

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
        <Button type="button" variant="outline">
          Edit deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit deck</DialogTitle>
          <DialogDescription>
            Update the title and description for this deck.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleUpdateDeck}>
          <div className="grid gap-3">
            <Label htmlFor={`deck-${deckId}-title`}>Title</Label>
            <Input
              id={`deck-${deckId}-title`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Deck title"
              disabled={isPending}
              maxLength={255}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor={`deck-${deckId}-description`}>Description</Label>
            <Textarea
              id={`deck-${deckId}-description`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What will this deck help you study?"
              disabled={isPending}
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
