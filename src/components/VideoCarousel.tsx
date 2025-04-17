'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import YouTubeEmbed from './youtube-embed';

// Define the interface for video items
interface VideoItem {
  src: string;
  thumbnail: string;
  fallbackSrc?: string;
  type?: 'video' | 'youtube';
  videoId?: string;
}

// Props for the VideoCarousel component
interface VideoCarouselProps {
  selectedMainVideo?: string;
  onSelectVideo?: (videoId: string) => void;
}

// Add Justin Foote's reel video and other videos
const videos: VideoItem[] = [
  {
    src: '/video_reels/justin-foote-reel.mp4',
    thumbnail: '/video_reels/thumbnails/justin-foote-reel-thumb.jpg',
    type: 'youtube',
    videoId: 'Byraswh5Rk8' // Justin Foote In-Game VFX Reel
  },
  {
    src: '/video_reels/vfx-reel--star-wars--the-old-republic.mp4',
    thumbnail: '/video_reels/thumbnails/star-wars-thumb.jpg',
    type: 'youtube',
    videoId: '21HXamqCyZY'
  },
  {
    src: '/video_reels/vfx-reel--where-the-wild-things-are.mp4',
    thumbnail: '/video_reels/thumbnails/wild-things-thumb.jpg',
    type: 'youtube',
    videoId: 'H5YUZWQqHaQ'
  },
  {
    src: '/video_reels/vfx-reel--call-of-duty--roads-to-victory.mp4',
    thumbnail: '/video_reels/thumbnails/cod-thumb.jpg',
    type: 'youtube',
    videoId: 'O9vNye383zw'
  },
  {
    src: '/video_reels/TeleportationDeviceActivation.mp4',
    thumbnail: '/video_reels/thumbnails/teleportation-thumb.jpg',
    type: 'youtube',
    videoId: 'yidVFPRkmC8'
  },
  {
    src: '/video_reels/MortarShellExplodingInSoftDirt.mp4',
    thumbnail: '/video_reels/thumbnails/mortar-thumb.jpg',
    type: 'youtube',
    videoId: '2ComkznaI9o'
  },
  {
    src: '/video_reels/Tornadotorch.mp4',
    thumbnail: '/video_reels/thumbnails/tornadotorch-thumb.jpg',
    type: 'youtube',
    videoId: '3L3A2zv5v34'
  },
  {
    src: '/video_reels/destiny-effects.mp4',
    thumbnail: '/video_reels/thumbnails/destiny-thumb.jpg',
    type: 'youtube',
    videoId: 'ie3wRVpzd8o'
  },
  {
    src: '/video_reels/mass-effect-andromeda.mp4',
    thumbnail: '/video_reels/thumbnails/mass-effect-thumb.jpg',
    type: 'youtube',
    videoId: 'uGglLTqU10w'
  }
];

const VideoCarousel = ({ selectedMainVideo, onSelectVideo }: VideoCarouselProps) => {
  const [isVerticalView, setIsVerticalView] = useState(false);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);
  const [videoLoadErrors, setVideoLoadErrors] = useState<boolean[]>([]);
  const [visibleYouTubeVideos, setVisibleYouTubeVideos] = useState<number[]>([0, 1, 2]); // Initially show first 3 videos
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoElementRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Function to generate thumbnails
  const generateThumbnails = async () => {
    for (const video of videos) {
      // Skip YouTube videos as they don't need generated thumbnails
      if (video.type === 'youtube') continue;

      const videoElement = document.createElement('video');
      videoElement.src = video.src;
      videoElement.currentTime = 1; // Seek to 1 second
      
      try {
        await new Promise((resolve) => {
          const onError = () => {
            // Try fallback source if available
            if (video.fallbackSrc) {
              videoElement.src = video.fallbackSrc;
              videoElement.load();
            } else {
              resolve(null);
            }
          };
          
          videoElement.addEventListener('error', onError, { once: true });
          
          videoElement.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 337;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Convert to blob and save
            canvas.toBlob((blob) => {
              if (blob) {
                const formData = new FormData();
                formData.append('thumbnail', blob);
                formData.append('filename', video.thumbnail.split('/').pop() || '');
                
                fetch('/api/save-thumbnail', {
                  method: 'POST',
                  body: formData
                });
              }
              resolve(null);
            }, 'image/jpeg', 0.8);
          }, { once: true });
        });
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    }
  };

  useEffect(() => {
    // Initialize playing states
    setPlayingStates(new Array(videos.length).fill(false));
    setVideoLoadErrors(new Array(videos.length).fill(false));
    
    // Initialize video refs
    videoRefs.current = videoRefs.current.slice(0, videos.length);
    videoElementRefs.current = videoElementRefs.current.slice(0, videos.length);
    
    // Generate thumbnails if needed
    generateThumbnails();
    
    // Initialize intersection observer for lazy loading
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = Number(entry.target.getAttribute('data-index'));
        if (!isNaN(index)) {
          if (entry.isIntersecting) {
            setVisibleYouTubeVideos(prev => {
              if (prev.includes(index)) return prev;
              return [...prev, index];
            });
          }
        }
      });
    }, {
      rootMargin: '100px', // Start loading when within 100px of viewport
      threshold: 0.1
    });
    
    return () => {
      // Clean up observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Set up observers for video elements
  useEffect(() => {
    videoElementRefs.current.forEach((el, index) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handlePlay = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      video.play();
      const newPlayingStates = [...playingStates];
      newPlayingStates[index] = true;
      setPlayingStates(newPlayingStates);
    }
  };

  const handlePause = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      const newPlayingStates = [...playingStates];
      newPlayingStates[index] = false;
      setPlayingStates(newPlayingStates);
    }
  };

  const handleRewind = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play();
      const newPlayingStates = [...playingStates];
      newPlayingStates[index] = true;
      setPlayingStates(newPlayingStates);
    }
  };
  
  // Handle video selection - now also passes to parent component
  const handleVideoSelect = useCallback((index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedVideoIndex(index);
    
    // If the video is a YouTube video and we have a callback, send the videoId to the parent
    if (videos[index].type === 'youtube' && videos[index].videoId && onSelectVideo) {
      onSelectVideo(videos[index].videoId);
    }
    
    setIsVerticalView(true);
  }, [onSelectVideo]);
  
  // Add a function to close the modal
  const handleCloseModal = useCallback(() => {
    setIsVerticalView(false);
    setSelectedVideoIndex(null);
  }, []);

  // Check if video is in viewport and should be loaded
  const shouldLoadVideo = (index: number): boolean => {
    if (videos[index].type !== 'youtube') return true;
    return visibleYouTubeVideos.includes(index);
  };
  
  return (
    <section className="w-full py-6 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((video, index) => {
          // Check if this video is currently selected in the main video section
          const isSelectedInMain = video.videoId === selectedMainVideo;
          
          return (
          <div 
            key={index}
            ref={(el) => { videoElementRefs.current[index] = el; }}
            data-index={index}
            className={`relative bg-gray-900 rounded-md overflow-hidden border-[2px] sm:border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite] aspect-video cursor-pointer ${isSelectedInMain ? 'ring-2 ring-white' : ''}`}
            onClick={(e) => handleVideoSelect(index, e)}
          >
            {videoLoadErrors[index] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Image 
                  src={video.thumbnail} 
                  alt="Video thumbnail" 
                  width={600} 
                  height={337} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <p className="text-white text-center p-4">Video could not be loaded</p>
                </div>
              </div>
            ) : video.type === 'youtube' ? (
              <div className={`w-full h-full ${isSelectedInMain ? 'opacity-40' : ''}`}>
                {shouldLoadVideo(index) ? (
                  <YouTubeEmbed
                    videoId={video.videoId as string}
                    title={`Video ${index + 1}`}
                    autoplay={index < 3} // Only autoplay first 3 videos
                    showControls={true}
                    loop={true}
                  />
                ) : (
                  // Placeholder for not-yet-loaded YouTube videos
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Image 
                      src={video.thumbnail || '/video_reels/thumbnails/loading-thumb.jpg'}
                      alt="Video thumbnail"
                      width={600}
                      height={337}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="animate-pulse w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {isSelectedInMain && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white font-medium">Currently Playing</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={isSelectedInMain ? 'opacity-40' : ''}>
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  style={{
                    objectFit: 'cover',
                  }}
                  className="w-full h-full object-cover rounded-[2px] sm:rounded-[4px]"
                  src={video.src}
                  poster={video.thumbnail}
                  autoPlay={index < 3} // Only autoplay first 3 videos
                  preload="metadata" // Just load metadata initially for better performance
                  playsInline
                  muted
                  loop
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    // Try fallback if available
                    if (video.fallbackSrc && target.src !== video.fallbackSrc) {
                      console.log(`Trying fallback for video ${index}`);
                      target.src = video.fallbackSrc;
                      target.load();
                    } else {
                      console.error(`Video ${index} failed to load:`, e);
                      const newErrors = [...videoLoadErrors];
                      newErrors[index] = true;
                      setVideoLoadErrors(newErrors);
                    }
                  }}
                />
                {isSelectedInMain && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white font-medium">Currently Playing</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Video controls overlay */}
            {!video.type && !videoLoadErrors[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  {playingStates[index] ? (
                    <Button 
                      variant="ghost" 
                      className="rounded-full bg-black/50 hover:bg-white/20 transition-colors duration-200"
                      onClick={(e) => handlePause(index, e)}
                    >
                      <Pause className="h-5 w-5 text-white" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="rounded-full bg-black/50 hover:bg-white/20 transition-colors duration-200"
                      onClick={(e) => handlePlay(index, e)}
                    >
                      <Play className="h-5 w-5 text-white" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-black/50 hover:bg-white/20 transition-colors duration-200"
                    onClick={(e) => handleRewind(index, e)}
                  >
                    <RotateCcw className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )})}
      </div>
      
      {/* Modal for expanded video view */}
      {isVerticalView && selectedVideoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 p-4 flex items-center justify-center" onClick={handleCloseModal}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
            {videos[selectedVideoIndex].type === 'youtube' ? (
              <div className="aspect-video w-full">
                <YouTubeEmbed
                  videoId={videos[selectedVideoIndex].videoId as string}
                  title={`Video ${selectedVideoIndex + 1}`}
                  autoplay={true}
                  showControls={true}
                  loop={true}
                />
              </div>
            ) : (
              <video
                className="w-full aspect-video object-contain"
                src={videos[selectedVideoIndex].src}
                controls
                autoPlay
                loop
                playsInline
              />
            )}
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-white/20 rounded-full z-10 p-2"
              onClick={handleCloseModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoCarousel; 