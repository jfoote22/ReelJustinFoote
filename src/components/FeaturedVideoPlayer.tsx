"use client"

import { useState, useEffect } from "react"
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
  
  return (
    <div className="w-full mb-6">
      <div className="w-full bg-gray-900 rounded-md overflow-hidden border-[3px] border-gray-500/20 aspect-video">
        {currentVideo.type === 'youtube' ? (
          <YouTubeEmbed
            videoId={currentVideo.videoId as string}
            title={`Video ${selectedVideoIndex + 1}`}
            autoplay={true}
            showControls={true}
            loop={true}
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={currentVideo.src}
            poster={currentVideo.thumbnail}
            controls
            autoPlay
            playsInline
            loop
          />
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
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