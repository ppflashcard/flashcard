import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDeckWithCardsByIdAndClerkUserId } from "@/db/queries/decks";
import { StudyFlashcards } from "./study-flashcards";

function parseDeckId(deckId: string) {
  const parsedDeckId = Number(deckId);

  if (!Number.isInteger(parsedDeckId) || parsedDeckId < 1) {
    notFound();
  }

  return parsedDeckId;
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { deckId } = await params;
  const deck = await getDeckWithCardsByIdAndClerkUserId(
    parseDeckId(deckId),
    userId
  );

  if (!deck) {
    notFound();
  }

  return (
    <main className="min-h-screen flex-1 bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Study deck #{deck.id}
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                {deck.name}
              </h1>
              <p className="max-w-2xl leading-7 text-muted-foreground">
                Work through each card, reveal the answer, and mark whether you
                knew it or need to review it again.
              </p>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href={`/decks/${deck.id}`}>Back to deck</Link>
          </Button>
        </div>

        {deck.cards.length > 0 ? (
          <StudyFlashcards cards={deck.cards} />
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No cards to study yet</CardTitle>
              <CardDescription>
                Add cards to this deck before starting a study session.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </main>
  );
}
