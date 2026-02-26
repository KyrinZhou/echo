"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import {
  BotIcon,
  MoonIcon,
  SunIcon,
  ShieldIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useOrganization } from "@clerk/nextjs";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const { organization } = useOrganization();

  return (
    <div className="flex flex-col gap-6 p-6 flex-1 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.settings.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.settings.description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-4" />
            <CardTitle className="text-base">{t.settings.organization}</CardTitle>
          </div>
          <CardDescription>{t.settings.organizationDescription}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label>{t.settings.organizationName}</Label>
            <Input value={organization?.name || t.common.noData} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t.settings.organizationId}</Label>
            <Input
              value={organization?.id || t.common.noData}
              disabled
              className="font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>{t.settings.members}</Label>
            <Badge variant="secondary">
              {organization?.membersCount || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BotIcon className="size-4" />
            <CardTitle className="text-base">{t.settings.aiAssistant}</CardTitle>
          </div>
          <CardDescription>
            {t.settings.aiAssistantDescription}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label>{t.settings.assistantId}</Label>
            <Input
              value="cf71760a-d8aa-433f-859e-b28134532408"
              disabled
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t.settings.provider}</Label>
            <div className="flex items-center gap-2">
              <Badge>Vapi AI</Badge>
              <span className="text-xs text-muted-foreground">
                {t.settings.voiceAiPlatform}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t.settings.statusLabel}</Label>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-green-400" />
              <span className="text-sm">{t.settings.statusActive}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
            <CardTitle className="text-base">{t.settings.appearance}</CardTitle>
          </div>
          <CardDescription>{t.settings.appearanceDescription}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t.settings.darkMode}</p>
              <p className="text-xs text-muted-foreground">
                {t.settings.darkModeDescription}
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
