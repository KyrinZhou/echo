"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@workspace/ui/components/empty";
import { AlertCircleIcon } from "lucide-react";

export default function FilesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Knowledge Base
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage articles, FAQs, and documents for your AI assistant.
        </p>
      </div>
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>Unable to load knowledge base</EmptyTitle>
          <EmptyDescription>
            {error.message.includes("Could not find public function")
              ? "The Convex backend functions have not been deployed yet. Please run 'npx convex dev' in the backend package to push the schema and functions."
              : error.message}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={reset}>Try Again</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
