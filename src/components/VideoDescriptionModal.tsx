"use client"

import { useEffect, useState } from "react"
import { VideoItem } from "./VideoCarousel"

interface VideoDescriptionModalProps {
  videos: VideoItem[];
  selectedVideoIndex: number;
  isAutoPlayEnabled: boolean;
}

export default function VideoDescriptionModal({ 
  videos, 
  selectedVideoIndex, 
  isAutoPlayEnabled 
}: VideoDescriptionModalProps) {
  const currentVideo = videos[selectedVideoIndex];
  const [isVisible, setIsVisible] = useState(true);

  // Add a subtle animation effect when videos change
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, [selectedVideoIndex]);

  if (!currentVideo.title && !currentVideo.description) {
    return null;
  }

  return (
    <div className={`w-full mb-8 transition-all duration-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-2'}`}>
      <div className="bg-gray-900/60 backdrop-blur-sm border-[3px] border-gray-500/20 rounded-lg p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {currentVideo.title && (
              <h3 className="text-xl font-light text-white mb-2 tracking-wide">
                {currentVideo.title}
              </h3>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Video {selectedVideoIndex + 1} of {videos.length}</span>
              {isAutoPlayEnabled && (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Auto-playing
                </span>
              )}
            </div>
          </div>
        </div>
        
        {currentVideo.description && (
          <p className="text-gray-300 leading-relaxed text-base">
            {currentVideo.description}
          </p>
        )}
      </div>
    </div>
  );
} 