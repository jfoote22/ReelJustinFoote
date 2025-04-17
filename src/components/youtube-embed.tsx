"use client"

import { useEffect, useRef } from "react"

interface YouTubeEmbedProps {
  videoId: string
  title: string
  autoplay?: boolean
  loop?: boolean
  showControls?: boolean
}

export default function YouTubeEmbed({ 
  videoId, 
  title, 
  autoplay = false, 
  loop = true,
  showControls = true 
}: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <div className="w-full h-full aspect-video border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite] rounded-md overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&controls=${showControls ? 1 : 0}&rel=0&loop=${loop ? 1 : 0}&playlist=${videoId}&modestbranding=1&showinfo=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
} 