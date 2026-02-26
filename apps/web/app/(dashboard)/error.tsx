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

export default function DashboardError({
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
        <h1 className="text-2xl font-semibold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.description}
        </p>
      </div>
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>{t.dashboard.unableToLoad}</EmptyTitle>
          <EmptyDescription>
            {error.message.includes("Could not find public function")
              ? t.dashboard.convexNotDeployed
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
