import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDeckWithCardsByIdAndClerkUserId } from "@/db/queries/decks";
import { CreateCardButton } from "./create-card-button";
import { DeleteCardButton } from "./delete-card-button";
import { EditCardButton } from "./edit-card-button";
import { EditDeckButton } from "./edit-deck-button";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

function getDescription(description: string | null) {
  return description?.trim() || "No description added yet.";
}

function parseDeckId(deckId: string) {
  const parsedDeckId = Number(deckId);

  if (!Number.isInteger(parsedDeckId) || parsedDeckId < 1) {
    notFound();
  }

  return parsedDeckId;
}

export default async function DeckPage({
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
              Deck #{deck.id}
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                {deck.name}
              </h1>
              <p className="max-w-2xl leading-7 text-muted-foreground">
                {getDescription(deck.description)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(deck.createdAt)} - Last modified{" "}
              {formatDate(deck.updatedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/decks/${deck.id}/study`}>Study deck</Link>
            </Button>
            <EditDeckButton
              deckId={deck.id}
              title={deck.name}
              description={deck.description}
            />
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Cards</h2>
              <p className="text-muted-foreground">
                {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}{" "}
                in this deck.
              </p>
            </div>
            <CreateCardButton deckId={deck.id} />
          </div>

          {deck.cards.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {deck.cards.map((card, index) => (
                <Card key={card.id} className="min-h-64">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle>Card {index + 1}</CardTitle>
                      <div className="flex gap-2">
                        <EditCardButton
                          deckId={deck.id}
                          cardId={card.id}
                          cardNumber={index + 1}
                          front={card.front}
                          back={card.back}
                        />
                        <DeleteCardButton
                          deckId={deck.id}
                          cardId={card.id}
                          cardNumber={index + 1}
                        />
                      </div>
                    </div>
                    <CardDescription>
                      Updated {formatDate(card.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Front
                      </p>
                      <p className="leading-7">{card.front}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Back
                      </p>
                      <p className="leading-7">{card.back}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No cards yet</CardTitle>
                <CardDescription>
                  Cards for this deck will appear here after you create them.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
