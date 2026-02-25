"use client";

import { useMutation } from "convex/react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import {
  MoreHorizontalIcon,
  ArchiveIcon,
  TrashIcon,
  FileTextIcon,
  HelpCircleIcon,
  FileIcon,
} from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";

const typeConfig = {
  article: { label: "Article", icon: FileTextIcon, variant: "default" as const },
  faq: { label: "FAQ", icon: HelpCircleIcon, variant: "secondary" as const },
  document: { label: "Document", icon: FileIcon, variant: "outline" as const },
};

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface FilesTableProps {
  files: Doc<"files">[];
}

export function FilesTable({ files }: FilesTableProps) {
  const archiveFile = useMutation(api.files.archive);
  const removeFile = useMutation(api.files.remove);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Content Preview</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const config = typeConfig[file.type];
          const TypeIcon = config.icon;
          return (
            <TableRow key={file._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <TypeIcon className="size-4" />
                  </div>
                  <span className="font-medium text-sm">{file.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={config.variant}>{config.label}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <span className="text-sm text-muted-foreground truncate block">
                  {file.description || "—"}
                </span>
              </TableCell>
              <TableCell className="max-w-[250px]">
                <span className="text-sm text-muted-foreground truncate block">
                  {file.content.slice(0, 80)}
                  {file.content.length > 80 ? "…" : ""}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatTime(file._creationTime)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => archiveFile({ id: file._id })}
                    >
                      <ArchiveIcon />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => removeFile({ id: file._id })}
                    >
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
