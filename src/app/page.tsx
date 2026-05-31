import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const dashboardPath = "/dashboard";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect(dashboardPath);
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            FlashyCardy
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Your personal flashcard platform
          </p>
        </div>
        <Show when="signed-out">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SignInButton
              mode="modal"
              forceRedirectUrl={dashboardPath}
              signUpForceRedirectUrl={dashboardPath}
            >
              <Button type="button" variant="outline">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              forceRedirectUrl={dashboardPath}
              signInForceRedirectUrl={dashboardPath}
            >
              <Button type="button">Sign up</Button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </main>
  );
}
