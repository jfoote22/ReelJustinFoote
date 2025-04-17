"use client"

import { useEffect, useRef } from "react"

// Add YouTube Player API type definition
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState?: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeEmbedProps {
  videoId: string
  title: string
  autoplay?: boolean
  loop?: boolean
  showControls?: boolean
  onEnd?: () => void
}

export default function YouTubeEmbed({ 
  videoId, 
  title, 
  autoplay = false, 
  loop = true,
  showControls = true,
  onEnd
}: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    if (!onEnd) return;
    
    // Initialize YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
    
    function initPlayer() {
      if (!iframeRef.current?.id) {
        const frameId = `youtube-player-${videoId}`;
        if (iframeRef.current) {
          iframeRef.current.id = frameId;
        }
      }
      
      if (iframeRef.current?.id && window.YT && window.YT.Player) {
        new window.YT.Player(iframeRef.current.id, {
          events: {
            onStateChange: (event: { data: number }) => {
              // When video ends (state === 0)
              if (event.data === 0 && !loop && onEnd) {
                onEnd();
              }
            }
          }
        });
      }
    }
    
    return () => {
      // Clean up if needed
    };
  }, [videoId, onEnd, loop]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <div className="w-full h-full aspect-video border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite] rounded-md overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&controls=${showControls ? 1 : 0}&rel=0&loop=${loop ? 1 : 0}&playlist=${videoId}&modestbranding=1&showinfo=1&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
} 