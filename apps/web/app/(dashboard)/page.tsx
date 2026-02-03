"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import YouTubePlayer from "./YoutubeVideo";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.user.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh w-full">
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <YouTubePlayer url="https://www.youtube.com/watch?v=18r256G0zPY" />
        <Button asChild>
          <a href="/widget">Open Widget</a>
        </Button>
      </div>
    </div>
  );
}
