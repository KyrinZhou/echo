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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { organization } = useOrganization();

  return (
    <div className="flex flex-col gap-6 p-6 flex-1 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your Echo platform preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-4" />
            <CardTitle className="text-base">Organization</CardTitle>
          </div>
          <CardDescription>Your current organization details.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Organization Name</Label>
            <Input value={organization?.name || "—"} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Organization ID</Label>
            <Input
              value={organization?.id || "—"}
              disabled
              className="font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Members</Label>
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
            <CardTitle className="text-base">AI Assistant</CardTitle>
          </div>
          <CardDescription>
            Voice assistant configuration powered by Vapi.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Assistant ID</Label>
            <Input
              value="cf71760a-d8aa-433f-859e-b28134532408"
              disabled
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Provider</Label>
            <div className="flex items-center gap-2">
              <Badge>Vapi AI</Badge>
              <span className="text-xs text-muted-foreground">
                Voice AI platform
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-green-400" />
              <span className="text-sm">Active</span>
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
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme.
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
