"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createDeckForClerkUserId,
  deleteDeckByIdAndClerkUserId,
} from "@/db/queries/decks";

const createDeckSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(255),
  description: z.string().trim(),
});

type CreateDeckInput = z.infer<typeof createDeckSchema>;

type CreateDeckActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const deleteDeckSchema = z.object({
  deckId: z.number().int().positive(),
});

type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

type DeleteDeckActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function createDeckAction(
  input: CreateDeckInput
): Promise<CreateDeckActionResult> {
  const parsedInput = createDeckSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not create the deck. Please check the title and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before creating a deck.",
    };
  }

  const { title, description } = parsedInput.data;
  await createDeckForClerkUserId({
    clerkUserId: userId,
    name: title,
    description: description || null,
  });

  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Deck created successfully.",
  };
}

export async function deleteDeckAction(
  input: DeleteDeckInput
): Promise<DeleteDeckActionResult> {
  const parsedInput = deleteDeckSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not delete the deck. Please refresh and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before deleting a deck.",
    };
  }

  const { deckId } = parsedInput.data;
  const deck = await deleteDeckByIdAndClerkUserId({
    deckId,
    clerkUserId: userId,
  });

  if (!deck) {
    return {
      ok: false,
      message: "Deck not found or you do not have access to it.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/decks/${deckId}`);

  return {
    ok: true,
    message: "Deck deleted successfully.",
  };
}
