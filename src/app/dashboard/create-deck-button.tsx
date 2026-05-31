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

import { createDeckAction } from "./actions";

export function CreateDeckButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreateDeck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await createDeckAction({ title, description });

      if (result.ok) {
        toast.success(result.message);
        setTitle("");
        setDescription("");
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
        <Button type="button">Create deck</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create deck</DialogTitle>
          <DialogDescription>
            Add a title and optional description for your new flashcard deck.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleCreateDeck}>
          <div className="grid gap-3">
            <Label htmlFor="deck-title">Title</Label>
            <Input
              id="deck-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Biology terms"
              disabled={isPending}
              maxLength={255}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="deck-description">Description</Label>
            <Textarea
              id="deck-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What will this deck help you study?"
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
