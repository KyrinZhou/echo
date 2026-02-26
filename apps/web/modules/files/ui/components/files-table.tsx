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
import { useI18n } from "@/lib/i18n";

const typeIcons = {
  article: FileTextIcon,
  faq: HelpCircleIcon,
  document: FileIcon,
};

const typeVariants = {
  article: "default" as const,
  faq: "secondary" as const,
  document: "outline" as const,
};

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

interface FilesTableProps {
  files: Doc<"files">[];
}

export function FilesTable({ files }: FilesTableProps) {
  const { t } = useI18n();
  const archiveFile = useMutation(api.files.archive);
  const removeFile = useMutation(api.files.remove);

  const typeLabels = {
    article: t.files.article,
    faq: t.files.faq,
    document: t.files.document,
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.files.titleLabel}</TableHead>
          <TableHead>{t.files.type}</TableHead>
          <TableHead>{t.files.descriptionLabel}</TableHead>
          <TableHead>{t.files.contentPreview}</TableHead>
          <TableHead>{t.files.createdAt}</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const TypeIcon = typeIcons[file.type];
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
                <Badge variant={typeVariants[file.type]}>{typeLabels[file.type]}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <span className="text-sm text-muted-foreground truncate block">
                  {file.description || t.common.noData}
                </span>
              </TableCell>
              <TableCell className="max-w-[250px]">
                <span className="text-sm text-muted-foreground truncate block">
                  {file.content.slice(0, 80)}
                  {file.content.length > 80 ? "…" : ""}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatTime(file._creationTime, { yesterday: t.common.yesterday, daysAgo: t.common.daysAgo })}
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
                      {t.files.archive}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => removeFile({ id: file._id })}
                    >
                      <TrashIcon />
                      {t.common.delete}
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
