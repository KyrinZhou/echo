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

export function FilesEmpty() {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LibraryBigIcon />
        </EmptyMedia>
        <EmptyTitle>No knowledge base entries yet</EmptyTitle>
        <EmptyDescription>
          Add articles, FAQs, and documents to build your AI assistant&apos;s
          knowledge base.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateFileDialog />
      </EmptyContent>
    </Empty>
  );
}
