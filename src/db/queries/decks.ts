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
