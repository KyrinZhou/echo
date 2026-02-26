"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Separator } from "@workspace/ui/components/separator";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  InboxIcon,
  PhoneIcon,
  LibraryBigIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { CreateConversationDialog } from "@/modules/conversations/ui/components/create-conversation-dialog";
import { CreateFileDialog } from "@/modules/files/ui/components/create-file-dialog";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
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

function StatsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const stats = useQuery(api.stats.overview);

  if (stats === undefined) return <StatsLoading />;

  const statCards = [
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      icon: InboxIcon,
      description: "All time",
    },
    {
      title: "Active Calls",
      value: stats.activeConversations,
      icon: PhoneIcon,
      description: "Currently active",
    },
    {
      title: "Knowledge Base",
      value: stats.knowledgeBaseEntries,
      icon: LibraryBigIcon,
      description: "Active entries",
    },
    {
      title: "Avg Duration",
      value: stats.avgDuration > 0 ? formatDuration(stats.avgDuration) : "—",
      icon: ClockIcon,
      description: "Per conversation",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 flex-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your customer support operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.title}
              </CardDescription>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Conversations</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/conversations">
                  View all
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {stats.recentConversations.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
                <CreateConversationDialog />
              </div>
            ) : (
              <div className="divide-y">
                {stats.recentConversations.map((conv) => (
                  <div
                    key={conv._id}
                    className="flex items-center gap-3 px-6 py-3"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(conv.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.customerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          conv.status === "active" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {conv.status === "active" ? "Active" : "Ended"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conv._creationTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid gap-3">
              <CreateConversationDialog />
              <CreateFileDialog />
              <Button variant="outline" asChild>
                <Link href="/settings">
                  Open Settings
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
