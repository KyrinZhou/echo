"use client";

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@workspace/ui/components/empty";
import { LibraryBigIcon } from "lucide-react";
import { CreateFileDialog } from "./create-file-dialog";
import { useI18n } from "@/lib/i18n";

export function FilesEmpty() {
  const { t } = useI18n();

  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LibraryBigIcon />
        </EmptyMedia>
        <EmptyTitle>{t.files.emptyTitle}</EmptyTitle>
        <EmptyDescription>
          {t.files.emptyDescription}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateFileDialog />
      </EmptyContent>
    </Empty>
  );
}
