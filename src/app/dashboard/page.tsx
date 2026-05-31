import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDecksByClerkUserId } from "@/db/queries/decks";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

function getDescription(description: string | null) {
  return description?.trim() || "No description added yet.";
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const decks = await getDecksByClerkUserId(userId);

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
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="min-h-56 justify-between transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">{deck.name}</CardTitle>
                    <CardDescription>
                      Created {formatDate(deck.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-4 leading-7 text-muted-foreground">
                      {getDescription(deck.description)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
                    <p>Deck #{deck.id}</p>
                    <p>Last modified {formatDate(deck.updatedAt)}</p>
                    <p className="break-all">Modified by {deck.clerkUserId}</p>
                  </CardFooter>
                </Card>
              </Link>
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
