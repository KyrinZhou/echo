"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs";
import { ConversationsTable } from "../components/conversations-table";
import { ConversationsEmpty } from "../components/conversations-empty";
import { ConversationsLoading } from "../components/conversations-loading";
import { CreateConversationDialog } from "../components/create-conversation-dialog";
import { useI18n } from "@/lib/i18n";

export function ConversationsView() {
  const { t } = useI18n();
  const [tab, setTab] = useState<string>("all");

  const statusFilter = tab === "active" ? ("active" as const)
    : tab === "ended" ? ("ended" as const)
    : undefined;

  const conversations = useQuery(api.conversations.list, {
    status: statusFilter,
  });

  if (conversations === undefined) {
    return <ConversationsLoading />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.conversations.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t.conversations.description}
          </p>
        </div>
        <CreateConversationDialog />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">{t.conversations.all}</TabsTrigger>
          <TabsTrigger value="active">{t.conversations.active}</TabsTrigger>
          <TabsTrigger value="ended">{t.conversations.ended}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {conversations.length === 0 ? (
            <ConversationsEmpty />
          ) : (
            <div className="rounded-md border">
              <ConversationsTable conversations={conversations} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
