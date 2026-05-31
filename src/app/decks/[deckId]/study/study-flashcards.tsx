"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StudyCard = {
  id: number;
  front: string;
  back: string;
};

type CardStatus = "known" | "review";

export function StudyFlashcards({ cards }: { cards: StudyCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [statusByCardId, setStatusByCardId] = useState<
    Record<number, CardStatus>
  >({});

  const currentCard = cards[currentIndex];
  const currentStatus = statusByCardId[currentCard.id];
  const knownCount = useMemo(
    () => Object.values(statusByCardId).filter((status) => status === "known").length,
    [statusByCardId]
  );
  const reviewCount = useMemo(
    () => Object.values(statusByCardId).filter((status) => status === "review").length,
    [statusByCardId]
  );
  const studiedCount = Object.keys(statusByCardId).length;
  const isComplete = studiedCount === cards.length;

  function goToCard(nextIndex: number) {
    setCurrentIndex(nextIndex);
    setIsAnswerVisible(false);
  }

  function markCard(status: CardStatus) {
    setStatusByCardId((currentStatuses) => ({
      ...currentStatuses,
      [currentCard.id]: status,
    }));

    if (currentIndex < cards.length - 1) {
      goToCard(currentIndex + 1);
    } else {
      setIsAnswerVisible(true);
    }
  }

  function restartSession() {
    setCurrentIndex(0);
    setIsAnswerVisible(false);
    setStatusByCardId({});
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((index) => {
          const previousIndex = Math.max(index - 1, 0);

          if (previousIndex !== index) {
            setIsAnswerVisible(false);
          }

          return previousIndex;
        });
        return;
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((index) => {
          const nextIndex = Math.min(index + 1, cards.length - 1);

          if (nextIndex !== index) {
            setIsAnswerVisible(false);
          }

          return nextIndex;
        });
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        setIsAnswerVisible((isVisible) => !isVisible);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards.length]);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <Card className="min-h-[28rem]">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>
                Card {currentIndex + 1} of {cards.length}
              </CardTitle>
              <CardDescription>
                {currentStatus
                  ? currentStatus === "known"
                    ? "Marked as known"
                    : "Marked for review"
                  : "Read the prompt, then reveal the answer."}
              </CardDescription>
            </div>
            <p className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              {Math.round(((currentIndex + 1) / cards.length) * 100)}%
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid flex-1 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Front</p>
            <p className="text-2xl font-semibold leading-relaxed">
              {currentCard.front}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-5">
            {isAnswerVisible ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Back</p>
                <p className="text-xl leading-relaxed">{currentCard.back}</p>
              </div>
            ) : (
              <div className="flex min-h-36 items-center justify-center text-center text-muted-foreground">
                Reveal the answer when you are ready to check yourself.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => goToCard(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => goToCard(currentIndex + 1)}
              disabled={currentIndex === cards.length - 1}
            >
              Next
            </Button>
          </div>

          {isAnswerVisible ? (
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                className="flex-1 sm:flex-none"
                variant="outline"
                onClick={() => markCard("review")}
              >
                Needs review
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => markCard("known")}
              >
                I knew it
              </Button>
            </div>
          ) : (
            <Button className="w-full sm:w-auto" onClick={() => setIsAnswerVisible(true)}>
              Reveal answer
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study progress</CardTitle>
          <CardDescription>
            {isComplete
              ? "Session complete. Review any cards you missed."
              : `${studiedCount} of ${cards.length} cards marked.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Known</span>
            <span className="font-semibold">{knownCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Needs review</span>
            <span className="font-semibold">{reviewCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-semibold">{cards.length - studiedCount}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={restartSession}>
            Restart session
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
