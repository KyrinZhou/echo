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
import { useI18n } from "@/lib/i18n";

export default function FilesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.files.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t.files.description}
        </p>
      </div>
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>{t.files.unableToLoad}</EmptyTitle>
          <EmptyDescription>
            {error.message.includes("Could not find public function")
              ? t.files.convexNotDeployed
              : error.message}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={reset}>{t.common.tryAgain}</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
