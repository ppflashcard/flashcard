import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            FlashyCardy
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Your personal flashcard platform
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignInButton mode="modal">
            <Button type="button" variant="outline">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button type="button">Sign up</Button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
