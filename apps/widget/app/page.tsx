"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isSpeaking,
    transcript,
    isConecting,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello widget</h1>
        <Button onClick={startCall}>Start Call</Button>
        <Button variant="destructive" onClick={endCall}>
          End Call
        </Button>
        <p>isConnected: {isConnected ? "true" : "false"}</p>
        <p>isSpeaking: {isSpeaking ? "true" : "false"}</p>
        <p>isConecting: {isConecting ? "true" : "false"}</p>
        <pre>{JSON.stringify(transcript)}</pre>
      </div>
    </div>
  );
}
