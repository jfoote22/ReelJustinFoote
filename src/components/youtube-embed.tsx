"use client"

import { useEffect, useRef } from "react"

interface YouTubeEmbedProps {
  videoId: string
  title: string
  autoplay?: boolean
}

export default function YouTubeEmbed({ videoId, title, autoplay = false }: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  return (
    <div className="relative overflow-hidden rounded-md">
      <div className="w-full aspect-video border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite] rounded-md overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&controls=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
} 