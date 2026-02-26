"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@workspace/backend/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import {
  MoreHorizontalIcon,
  PhoneOffIcon,
  TrashIcon,
  ClockIcon,
} from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import { useI18n } from "@/lib/i18n";

function formatDuration(seconds?: number, noData?: string) {
  if (!seconds) return noData ?? "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTime(timestamp: number, translations: { yesterday: string; daysAgo: string }) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (days === 1) return translations.yesterday;
  if (days < 7) return translations.daysAgo.replace("{days}", String(days));
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ConversationsTableProps {
  conversations: Doc<"conversations">[];
}

export function ConversationsTable({
  conversations,
}: ConversationsTableProps) {
  const { t } = useI18n();
  const router = useRouter();
  const endConversation = useMutation(api.conversations.end);
  const removeConversation = useMutation(api.conversations.remove);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.conversations.customer}</TableHead>
          <TableHead>{t.conversations.titleLabel}</TableHead>
          <TableHead>{t.conversations.status}</TableHead>
          <TableHead>{t.conversations.duration}</TableHead>
          <TableHead>{t.conversations.lastMessage}</TableHead>
          <TableHead>{t.conversations.time}</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conversation) => (
          <TableRow
            key={conversation._id}
            className="cursor-pointer"
            onClick={() => router.push(`/conversations/${conversation._id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(conversation.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {conversation.customerName}
                  </span>
                  {conversation.customerEmail && (
                    <span className="text-muted-foreground text-xs">
                      {conversation.customerEmail}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {conversation.title}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  conversation.status === "active" ? "default" : "secondary"
                }
              >
                {conversation.status === "active" ? t.common.active : t.common.ended}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ClockIcon className="size-3" />
                <span className="text-sm">
                  {formatDuration(conversation.duration, t.common.noData)}
                </span>
              </div>
            </TableCell>
            <TableCell className="max-w-[200px]">
              <span className="text-sm text-muted-foreground truncate block">
                {conversation.lastMessage || t.common.noMessagesYet}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatTime(conversation._creationTime, { yesterday: t.common.yesterday, daysAgo: t.common.daysAgo })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {conversation.status === "active" && (
                    <DropdownMenuItem
                      onClick={() =>
                        endConversation({
                          id: conversation._id,
                          duration: Math.floor(
                            (Date.now() - conversation._creationTime) / 1000
                          ),
                        })
                      }
                    >
                      <PhoneOffIcon />
                      {t.conversations.endConversation}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      removeConversation({ id: conversation._id })
                    }
                  >
                    <TrashIcon />
                    {t.common.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
