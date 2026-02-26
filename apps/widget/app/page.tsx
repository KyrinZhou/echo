"use client";

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
} from "lucide-react";

export default function Page() {
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
    <div className="flex items-center justify-center min-h-svh p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BotIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Echo Assistant</CardTitle>
                <p className="text-muted-foreground text-xs">
                  AI-powered voice support
                </p>
              </div>
            </div>
            <Badge
              variant={
                isConnected
                  ? "default"
                  : isConecting
                    ? "secondary"
                    : "outline"
              }
            >
              <span
                className={`mr-1.5 inline-block size-1.5 rounded-full ${
                  isConnected
                    ? "bg-green-400 animate-pulse"
                    : isConecting
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-muted-foreground"
                }`}
              />
              {isConnected ? "Connected" : isConecting ? "Connecting…" : "Offline"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <ScrollArea className="h-[320px]">
            <div className="flex flex-col gap-3 p-4">
              {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] gap-3 text-center">
                  {isConecting ? (
                    <>
                      <Loader2Icon className="size-8 text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Connecting to assistant…
                      </p>
                    </>
                  ) : isConnected ? (
                    <>
                      <div className="relative">
                        <MicIcon
                          className={`size-8 text-primary ${isSpeaking ? "animate-pulse" : ""}`}
                        />
                        {isSpeaking && (
                          <span className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isSpeaking ? "Listening…" : "Start speaking…"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                        <PhoneIcon className="size-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click the button below to start a voice conversation.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                transcript.map((msg, i) => (
                  <div
                    key={i}
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
                        {msg.role === "assistant" ? "AI" : "You"}
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
                    </div>
                  </div>
                ))
              )}
              {isConnected && isSpeaking && transcript.length > 0 && (
                <div className="flex gap-2.5">
                  <Avatar className="size-7 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-xl rounded-tl-sm bg-muted px-3 py-2">
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

        <CardFooter className="flex items-center justify-center py-4">
          {!isActive ? (
            <Button size="lg" className="gap-2 rounded-full px-6" onClick={startCall}>
              <PhoneIcon className="size-4" />
              Start Conversation
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSpeaking ? (
                  <>
                    <MicIcon className="size-4 text-primary animate-pulse" />
                    <span>Listening</span>
                  </>
                ) : isConecting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Connecting</span>
                  </>
                ) : (
                  <>
                    <MicOffIcon className="size-4" />
                    <span>On call</span>
                  </>
                )}
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full size-10"
                onClick={endCall}
              >
                <PhoneOffIcon className="size-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
