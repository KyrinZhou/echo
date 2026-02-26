"use client";

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@workspace/ui/components/empty";
import { InboxIcon } from "lucide-react";
import { CreateConversationDialog } from "./create-conversation-dialog";
import { useI18n } from "@/lib/i18n";

export function ConversationsEmpty() {
  const { t } = useI18n();

  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>{t.conversations.emptyTitle}</EmptyTitle>
        <EmptyDescription>
          {t.conversations.emptyDescription}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateConversationDialog />
      </EmptyContent>
    </Empty>
  );
}
