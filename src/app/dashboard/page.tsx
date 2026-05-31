import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { decksTable } from "@/db/schema";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function formatCreatedDate(date: Date) {
  return dateFormatter.format(date);
}

function getDescription(description: string | null) {
  return description?.trim() || "No description added yet.";
}

async function getDecks(clerkUserId: string) {
  return db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
    })
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, clerkUserId))
    .orderBy(desc(decksTable.createdAt));
}

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const decks = await getDecks(userId);

  return (
    <main className="min-h-screen flex-1 bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight">Your decks</h1>
          <p className="max-w-2xl text-muted-foreground">
            Review the flashcard decks you have created and jump back into your
            learning flow.
          </p>
        </div>

        {decks.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="min-h-56 justify-between transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{deck.name}</CardTitle>
                  <CardDescription>
                    Created {formatCreatedDate(deck.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-4 leading-7 text-muted-foreground">
                    {getDescription(deck.description)}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Deck #{deck.id}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No decks yet</CardTitle>
              <CardDescription>
                Your decks from Neon will appear here after you create them.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </main>
  );
}
