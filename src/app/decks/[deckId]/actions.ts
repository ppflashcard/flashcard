"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createCardForDeckByIdAndClerkUserId,
  deleteCardForDeckByIdAndClerkUserId,
  updateCardForDeckByIdAndClerkUserId,
  updateDeckByIdAndClerkUserId,
} from "@/db/queries/decks";

const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().trim().min(1, "Front is required."),
  back: z.string().trim().min(1, "Back is required."),
});

type CreateCardInput = z.infer<typeof createCardSchema>;

type CreateCardActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const updateDeckSchema = z.object({
  deckId: z.number().int().positive(),
  title: z.string().trim().min(1, "Title is required.").max(255),
  description: z.string().trim(),
});

type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

type UpdateDeckActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const updateCardSchema = z.object({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
  front: z.string().trim().min(1, "Front is required."),
  back: z.string().trim().min(1, "Back is required."),
});

type UpdateCardInput = z.infer<typeof updateCardSchema>;

type UpdateCardActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const deleteCardSchema = z.object({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
});

type DeleteCardInput = z.infer<typeof deleteCardSchema>;

type DeleteCardActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function createCardAction(
  input: CreateCardInput
): Promise<CreateCardActionResult> {
  const parsedInput = createCardSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not create the card. Please refresh and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before creating a card.",
    };
  }

  const { deckId, front, back } = parsedInput.data;
  const card = await createCardForDeckByIdAndClerkUserId({
    deckId,
    clerkUserId: userId,
    front,
    back,
  });

  if (!card) {
    return {
      ok: false,
      message: "Deck not found or you do not have access to it.",
    };
  }

  revalidatePath(`/decks/${deckId}`);

  return {
    ok: true,
    message: "Card created successfully.",
  };
}

export async function updateDeckAction(
  input: UpdateDeckInput
): Promise<UpdateDeckActionResult> {
  const parsedInput = updateDeckSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not update the deck. Please check the title and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before updating a deck.",
    };
  }

  const { deckId, title, description } = parsedInput.data;
  const deck = await updateDeckByIdAndClerkUserId({
    deckId,
    clerkUserId: userId,
    name: title,
    description: description || null,
  });

  if (!deck) {
    return {
      ok: false,
      message: "Deck not found or you do not have access to it.",
    };
  }

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Deck updated successfully.",
  };
}

export async function updateCardAction(
  input: UpdateCardInput
): Promise<UpdateCardActionResult> {
  const parsedInput = updateCardSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not update the card. Please check both sides and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before updating a card.",
    };
  }

  const { deckId, cardId, front, back } = parsedInput.data;
  const card = await updateCardForDeckByIdAndClerkUserId({
    deckId,
    cardId,
    clerkUserId: userId,
    front,
    back,
  });

  if (!card) {
    return {
      ok: false,
      message: "Card not found or you do not have access to it.",
    };
  }

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Card updated successfully.",
  };
}

export async function deleteCardAction(
  input: DeleteCardInput
): Promise<DeleteCardActionResult> {
  const parsedInput = deleteCardSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Could not delete the card. Please refresh and try again.",
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      message: "Please sign in before deleting a card.",
    };
  }

  const { deckId, cardId } = parsedInput.data;
  const card = await deleteCardForDeckByIdAndClerkUserId({
    deckId,
    cardId,
    clerkUserId: userId,
  });

  if (!card) {
    return {
      ok: false,
      message: "Card not found or you do not have access to it.",
    };
  }

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Card deleted successfully.",
  };
}
