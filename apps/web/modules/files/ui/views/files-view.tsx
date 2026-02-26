"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { FilesTable } from "../components/files-table";
import { FilesEmpty } from "../components/files-empty";
import { FilesLoading } from "../components/files-loading";
import { CreateFileDialog } from "../components/create-file-dialog";
import { useI18n } from "@/lib/i18n";

type FileType = "article" | "faq" | "document";

export function FilesView() {
  const { t } = useI18n();
  const [tab, setTab] = useState<string>("all");

  const typeFilter: FileType | undefined =
    tab === "article"
      ? "article"
      : tab === "faq"
        ? "faq"
        : tab === "document"
          ? "document"
          : undefined;

  const files = useQuery(api.files.list, {
    type: typeFilter,
  });

  if (files === undefined) {
    return <FilesLoading />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.files.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t.files.description}
          </p>
        </div>
        <CreateFileDialog />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">{t.files.all}</TabsTrigger>
          <TabsTrigger value="article">{t.files.articles}</TabsTrigger>
          <TabsTrigger value="faq">{t.files.faqs}</TabsTrigger>
          <TabsTrigger value="document">{t.files.documents}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {files.length === 0 ? (
            <FilesEmpty />
          ) : (
            <div className="rounded-md border">
              <FilesTable files={files} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
