"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  ArrowLeftIcon,
  PhoneOffIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatDuration(seconds?: number) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const conversation = useQuery(api.conversations.getById, {
    id: id as Id<"conversations">,
  });
  const messages = useQuery(api.messages.listByConversation, {
    conversationId: id as Id<"conversations">,
  });
  const endConversation = useMutation(api.conversations.end);
  const removeConversation = useMutation(api.conversations.remove);

  if (conversation === undefined || messages === undefined) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6">
        <p className="text-muted-foreground">Conversation not found.</p>
        <Button variant="outline" asChild>
          <Link href="/conversations">
            <ArrowLeftIcon className="size-4" />
            Back to Conversations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/conversations">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {conversation.title}
          </h1>
          <p className="text-muted-foreground text-sm">Conversation details</p>
        </div>
        <div className="flex items-center gap-2">
          {conversation.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await endConversation({
                  id: conversation._id,
                  duration: Math.floor(
                    (Date.now() - conversation._creationTime) / 1000
                  ),
                });
              }}
            >
              <PhoneOffIcon className="size-3.5" />
              End
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={async () => {
              await removeConversation({ id: conversation._id });
              router.push("/conversations");
            }}
          >
            <TrashIcon className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback>
                  {conversation.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {conversation.customerName}
                </p>
                {conversation.customerEmail && (
                  <p className="text-xs text-muted-foreground">
                    {conversation.customerEmail}
                  </p>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    conversation.status === "active" ? "default" : "secondary"
                  }
                >
                  {conversation.status === "active" ? "Active" : "Ended"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ClockIcon className="size-3.5" /> Duration
                </span>
                <span>{formatDuration(conversation.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-xs">
                  {formatDate(conversation._creationTime)}
                </span>
              </div>
              {conversation.endedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ended</span>
                  <span className="text-xs">
                    {formatDate(conversation.endedAt)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Messages</span>
                <span>{messages.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">
              Messages ({messages.length})
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="flex flex-col gap-3 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      No messages in this conversation yet.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="size-7 shrink-0 mt-0.5">
                        <AvatarFallback
                          className={`text-[10px] ${
                            msg.role === "assistant"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.role === "assistant" ? "AI" : (
                            <UserIcon className="size-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-xl px-3 py-2 text-sm max-w-[75%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                        <div
                          className={`text-[10px] mt-1 ${
                            msg.role === "user"
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatDate(msg._creationTime)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
