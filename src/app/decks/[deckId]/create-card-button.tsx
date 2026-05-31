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

import { createCardAction } from "./actions";

export function CreateCardButton({ deckId }: { deckId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreateCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await createCardAction({ deckId, front, back });

      if (result.ok) {
        toast.success(result.message);
        setFront("");
        setBack("");
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
        <Button type="button">Create card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create card</DialogTitle>
          <DialogDescription>
            Add the front and back text for this flashcard.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleCreateCard}>
          <div className="grid gap-3">
            <Label htmlFor="card-front">Front</Label>
            <Input
              id="card-front"
              value={front}
              onChange={(event) => setFront(event.target.value)}
              placeholder="Question, term, or prompt"
              disabled={isPending}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="card-back">Back</Label>
            <Textarea
              id="card-back"
              value={back}
              onChange={(event) => setBack(event.target.value)}
              placeholder="Answer, definition, or explanation"
              disabled={isPending}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
