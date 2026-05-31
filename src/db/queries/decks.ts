import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";

export function getDecksByClerkUserId(clerkUserId: string) {
  return db
    .select({
      id: decksTable.id,
      clerkUserId: decksTable.clerkUserId,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
    })
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, clerkUserId))
    .orderBy(desc(decksTable.createdAt));
}

export async function createDeckForClerkUserId({
  clerkUserId,
  name,
  description,
}: {
  clerkUserId: string;
  name: string;
  description: string | null;
}) {
  const now = new Date();
  const [deck] = await db
    .insert(decksTable)
    .values({
      clerkUserId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: decksTable.id,
      clerkUserId: decksTable.clerkUserId,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
    });

  return deck;
}

export async function deleteDeckByIdAndClerkUserId({
  deckId,
  clerkUserId,
}: {
  deckId: number;
  clerkUserId: string;
}) {
  const [deck] = await db
    .delete(decksTable)
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .returning({
      id: decksTable.id,
    });

  return deck ?? null;
}

export async function createCardForDeckByIdAndClerkUserId({
  deckId,
  clerkUserId,
  front,
  back,
}: {
  deckId: number;
  clerkUserId: string;
  front: string;
  back: string;
}) {
  const [deck] = await db
    .select({ id: decksTable.id })
    .from(decksTable)
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .limit(1);

  if (!deck) {
    return null;
  }

  const now = new Date();
  const [card] = await db
    .insert(cardsTable)
    .values({
      deckId: deck.id,
      front,
      back,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: cardsTable.id,
      deckId: cardsTable.deckId,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      updatedAt: cardsTable.updatedAt,
    });

  await db
    .update(decksTable)
    .set({ updatedAt: now })
    .where(
      and(eq(decksTable.id, deck.id), eq(decksTable.clerkUserId, clerkUserId))
    );

  return card;
}

export async function updateCardForDeckByIdAndClerkUserId({
  deckId,
  cardId,
  clerkUserId,
  front,
  back,
}: {
  deckId: number;
  cardId: number;
  clerkUserId: string;
  front: string;
  back: string;
}) {
  const [deck] = await db
    .select({ id: decksTable.id })
    .from(decksTable)
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .limit(1);

  if (!deck) {
    return null;
  }

  const now = new Date();
  const [card] = await db
    .update(cardsTable)
    .set({
      front,
      back,
      updatedAt: now,
    })
    .where(and(eq(cardsTable.id, cardId), eq(cardsTable.deckId, deck.id)))
    .returning({
      id: cardsTable.id,
      deckId: cardsTable.deckId,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      updatedAt: cardsTable.updatedAt,
    });

  if (!card) {
    return null;
  }

  await db
    .update(decksTable)
    .set({ updatedAt: now })
    .where(
      and(eq(decksTable.id, deck.id), eq(decksTable.clerkUserId, clerkUserId))
    );

  return card;
}

export async function deleteCardForDeckByIdAndClerkUserId({
  deckId,
  cardId,
  clerkUserId,
}: {
  deckId: number;
  cardId: number;
  clerkUserId: string;
}) {
  const [deck] = await db
    .select({ id: decksTable.id })
    .from(decksTable)
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .limit(1);

  if (!deck) {
    return null;
  }

  const [card] = await db
    .delete(cardsTable)
    .where(and(eq(cardsTable.id, cardId), eq(cardsTable.deckId, deck.id)))
    .returning({
      id: cardsTable.id,
    });

  if (!card) {
    return null;
  }

  await db
    .update(decksTable)
    .set({ updatedAt: new Date() })
    .where(
      and(eq(decksTable.id, deck.id), eq(decksTable.clerkUserId, clerkUserId))
    );

  return card;
}

export async function updateDeckByIdAndClerkUserId({
  deckId,
  clerkUserId,
  name,
  description,
}: {
  deckId: number;
  clerkUserId: string;
  name: string;
  description: string | null;
}) {
  const [deck] = await db
    .update(decksTable)
    .set({
      name,
      description,
      updatedAt: new Date(),
    })
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .returning({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      updatedAt: decksTable.updatedAt,
    });

  return deck ?? null;
}

export async function getDeckWithCardsByIdAndClerkUserId(
  deckId: number,
  clerkUserId: string
) {
  const [deck] = await db
    .select({
      id: decksTable.id,
      clerkUserId: decksTable.clerkUserId,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
    })
    .from(decksTable)
    .where(
      and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, clerkUserId))
    )
    .limit(1);

  if (!deck) {
    return null;
  }

  const cards = await db
    .select({
      id: cardsTable.id,
      deckId: cardsTable.deckId,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      updatedAt: cardsTable.updatedAt,
    })
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deck.id))
    .orderBy(asc(cardsTable.createdAt));

  return {
    ...deck,
    cards,
  };
}
