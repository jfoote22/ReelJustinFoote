"use client"

import { useState, useEffect, useRef } from "react"
import YouTubeEmbed from '@/components/youtube-embed'

// Use the same VideoItem interface from VideoCarousel
interface VideoItem {
  src: string;
  thumbnail: string;
  fallbackSrc?: string;
  type?: 'video' | 'youtube';
  videoId?: string;
}

interface FeaturedVideoPlayerProps {
  videos: VideoItem[];
  selectedVideoIndex: number;
  onSelectVideo: (index: number) => void;
}

export default function FeaturedVideoPlayer({ 
  videos, 
  selectedVideoIndex, 
  onSelectVideo 
}: FeaturedVideoPlayerProps) {
  const currentVideo = videos[selectedVideoIndex];
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to advance to the next video
  const playNextVideo = () => {
    if (!isAutoPlayEnabled) return;
    
    const nextIndex = (selectedVideoIndex + 1) % videos.length;
    onSelectVideo(nextIndex);
  };
  
  // Set up video cycle
  useEffect(() => {
    if (!isAutoPlayEnabled) return;
    
    // Clear any existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    
    // Set timeout to advance to next video after certain period
    // For YouTube videos, we can't easily detect when they end, so we use a fixed duration
    const videoDuration = 15000; // 15 seconds per video for demonstration
    autoPlayTimeoutRef.current = setTimeout(playNextVideo, videoDuration);
    
    // Clean up
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [selectedVideoIndex, isAutoPlayEnabled]);
  
  return (
    <div className="w-full mb-6">
      <div className="w-full bg-gray-900 rounded-md overflow-hidden border-[3px] border-gray-500/20 aspect-video">
        {currentVideo.type === 'youtube' ? (
          <YouTubeEmbed
            videoId={currentVideo.videoId as string}
            title={`Video ${selectedVideoIndex + 1}`}
            autoplay={true}
            showControls={true}
            loop={false} // Changed to false to allow video to end
            onEnd={playNextVideo}
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={currentVideo.src}
            poster={currentVideo.thumbnail}
            controls
            autoPlay
            playsInline
            loop={false} // Changed to false to allow video to end
            onEnded={playNextVideo}
          />
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="flex items-center">
          <button 
            onClick={() => setIsAutoPlayEnabled(!isAutoPlayEnabled)}
            className={`px-4 py-1.5 rounded-md mr-3 text-sm font-light tracking-wider
              ${isAutoPlayEnabled 
                ? 'bg-gray-300 text-black border-[2px] border-gray-500/20' 
                : 'bg-gray-700 text-white border-[2px] border-gray-500/20'
              }`}
            style={{ fontFamily: 'inherit' }}
          >
            {isAutoPlayEnabled ? "AUTO-PLAY ON" : "AUTO-PLAY OFF"}
          </button>
        </div>
        <div className="text-sm text-gray-400 font-light tracking-wide">
          {selectedVideoIndex + 1} / {videos.length}
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`relative aspect-video cursor-pointer rounded-md overflow-hidden border-2 ${
              selectedVideoIndex === index 
                ? 'border-blue-500 ring-2 ring-blue-500' 
                : 'border-gray-500/20'
            }`}
            onClick={() => onSelectVideo(index)}
          >
            <img
              src={video.thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 