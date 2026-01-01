import { YouTubeEmbed } from "@next/third-parties/google";

// 辅助函数：从 URL 中提取 Video ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
};

interface Props {
  url: string;
}

export default function YouTubePlayer({ url }: Props) {
  const videoId = getYouTubeId(url);

  if (!videoId) return <div>无效的视频链接</div>;

  return (
    <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg">
      <YouTubeEmbed
        videoid={videoId}
        style="width: 100%; height: 100%; max-width: 100%;"
        params="controls=1"
      />
    </div>
  );
}