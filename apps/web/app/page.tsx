"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.user.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">app/Web</h1>
        <Authenticated>
          <UserButton />
          <pre>{JSON.stringify(users)}</pre>
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </div>
  );
}
