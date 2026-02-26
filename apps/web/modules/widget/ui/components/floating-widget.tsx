"use client";

import { useState } from "react";
import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  PhoneIcon,
  PhoneOffIcon,
  MicIcon,
  MicOffIcon,
  BotIcon,
  Loader2Icon,
  XIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function FloatingWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const {
    isConnected,
    isSpeaking,
    transcript,
    isConecting,
    startCall,
    endCall,
  } = useVapi();

  const isActive = isConnected || isConecting;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-[380px] shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BotIcon className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">{t.widget.echoAssistant}</CardTitle>
                  <p className="text-muted-foreground text-[11px]">
                    {t.widget.aiPoweredSupport}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    isConnected
                      ? "default"
                      : isConecting
                        ? "secondary"
                        : "outline"
                  }
                  className="text-[10px] px-1.5 py-0"
                >
                  <span
                    className={`mr-1 inline-block size-1.5 rounded-full ${
                      isConnected
                        ? "bg-green-400 animate-pulse"
                        : isConecting
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {isConnected
                    ? t.widget.connected
                    : isConecting
                      ? t.widget.connecting
                      : t.widget.offline}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setOpen(false)}
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-2.5 p-3">
                {transcript.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[260px] gap-3 text-center">
                    {isConecting ? (
                      <>
                        <Loader2Icon className="size-7 text-muted-foreground animate-spin" />
                        <p className="text-xs text-muted-foreground">
                          {t.widget.connectingToAssistant}
                        </p>
                      </>
                    ) : isConnected ? (
                      <>
                        <div className="relative">
                          <MicIcon
                            className={`size-7 text-primary ${isSpeaking ? "animate-pulse" : ""}`}
                          />
                          {isSpeaking && (
                            <span className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isSpeaking ? t.widget.listening : t.widget.startSpeaking}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                          <PhoneIcon className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                          {t.widget.idlePrompt}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="size-6 shrink-0 mt-0.5">
                        <AvatarFallback
                          className={`text-[9px] ${
                            msg.role === "assistant"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.role === "assistant" ? t.widget.ai : t.widget.you}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-2.5 py-1.5 text-xs max-w-[70%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isConnected && isSpeaking && transcript.length > 0 && (
                  <div className="flex gap-2">
                    <Avatar className="size-6 shrink-0 mt-0.5">
                      <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                        {t.widget.ai}
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg rounded-tl-sm bg-muted px-2.5 py-1.5">
                      <div className="flex gap-1">
                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <Separator />

          <CardFooter className="flex items-center justify-center py-3">
            {!isActive ? (
              <Button
                size="sm"
                className="gap-2 rounded-full px-5"
                onClick={startCall}
              >
                <PhoneIcon className="size-3.5" />
                {t.widget.startConversation}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isSpeaking ? (
                    <>
                      <MicIcon className="size-3.5 text-primary animate-pulse" />
                      <span>{t.widget.listening}</span>
                    </>
                  ) : isConecting ? (
                    <>
                      <Loader2Icon className="size-3.5 animate-spin" />
                      <span>{t.widget.connecting}</span>
                    </>
                  ) : (
                    <>
                      <MicOffIcon className="size-3.5" />
                      <span>{t.widget.onCall}</span>
                    </>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full size-8"
                  onClick={endCall}
                >
                  <PhoneOffIcon className="size-3.5" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}

      <Button
        size="icon"
        className={`size-14 rounded-full shadow-lg transition-transform hover:scale-105 ${
          isActive ? "bg-green-600 hover:bg-green-700" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <XIcon className="size-6" />
        ) : isActive ? (
          <PhoneIcon className="size-6 animate-pulse" />
        ) : (
          <MessageCircleIcon className="size-6" />
        )}
      </Button>
    </div>
  );
}
