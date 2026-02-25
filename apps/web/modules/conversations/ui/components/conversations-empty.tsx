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

export function ConversationsEmpty() {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No conversations yet</EmptyTitle>
        <EmptyDescription>
          Start a new conversation to begin providing customer support.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateConversationDialog />
      </EmptyContent>
    </Empty>
  );
}
