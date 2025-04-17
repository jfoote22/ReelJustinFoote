'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import YouTubeEmbed from './youtube-embed';

// Define the interface for video items
interface VideoItem {
  src: string;
  thumbnail: string;
  fallbackSrc?: string; // Optional fallback source if main source fails
  type?: 'video' | 'youtube'; // Add type to differentiate between normal videos and YouTube embeds
  videoId?: string; // YouTube video ID if type is 'youtube'
}

// Remove Hololens videos and use working videos only
const videos: VideoItem[] = [
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

const VideoCarousel = () => {
  const [isVerticalView, setIsVerticalView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [playingStates, setPlayingStates] = useState<boolean[]>(new Array(videos.length).fill(true));
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [videoLoadErrors, setVideoLoadErrors] = useState<boolean[]>(new Array(videos.length).fill(false));
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Function to generate thumbnails
  useEffect(() => {
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
      setThumbnailsGenerated(true);
    };

    if (!thumbnailsGenerated) {
      generateThumbnails();
    }
  }, [thumbnailsGenerated]);

  // Enhanced video error handling with fallback support
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      const handleError = () => {
        console.error(`Error loading video ${videos[index].src}`);
        
        // Try fallback if available
        if (videos[index].fallbackSrc && video.src !== videos[index].fallbackSrc) {
          console.log(`Trying fallback for video ${index}: ${videos[index].fallbackSrc}`);
          video.src = videos[index].fallbackSrc;
          video.load();
          video.play().catch(err => {
            console.error(`Fallback play failed for video ${index}:`, err);
            setVideoLoadErrors(prev => {
              const newErrors = [...prev];
              newErrors[index] = true;
              return newErrors;
            });
          });
        } else {
          // If no fallback or fallback failed, mark as error
          setVideoLoadErrors(prev => {
            const newErrors = [...prev];
            newErrors[index] = true;
            return newErrors;
          });
        }
      };
      
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('error', handleError);
      };
    });
  }, []);

  // Autoplay videos on mount
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        // Make sure video is muted for autoplay to work
        video.muted = true;
        video.play().catch(err => {
          console.log("Autoplay error:", err);
        });
      }
    });
  }, []);

  // Auto-scrolling effect
  useEffect(() => {
    if (!containerRef.current || isVerticalView || isHovered || isDragging) return;
    
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    const scroll = () => {
      if (container.scrollLeft >= scrollWidth - clientWidth - 10) {
        // When reaching the end, smoothly scroll back to start
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        container.scrollLeft += 1; // Slower scroll speed for smoother movement
      }
    };
    
    const intervalId = setInterval(scroll, 30); // Lower speed, higher interval for smoother scrolling
    
    return () => clearInterval(intervalId);
  }, [isVerticalView, isHovered, isDragging]);

  // Add click outside handler
  useEffect(() => {
    if (!isVerticalView) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVerticalView(false);
        
        // For non-YouTube videos only
        videoRefs.current.forEach((video, index) => {
          if (video && videos[index].type !== 'youtube') {
            video.play().catch(() => {
              setPlayingStates(prev => {
                const newStates = [...prev];
                newStates[index] = false;
                return newStates;
              });
            });
          }
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVerticalView]);

  const toggleView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling to document
    setIsVerticalView(!isVerticalView);
    
    // For non-YouTube videos only
    videoRefs.current.forEach((video, index) => {
      if (video && videos[index].type !== 'youtube') {
        video.play().catch(() => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        });
      }
    });
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (playingStates[index]) {
        video.pause();
      } else {
        video.play().catch(() => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        });
      }
    }
  };

  const rewindTenSeconds = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    }
  };

  const restartVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        console.log("Error restarting video");
      });
    }
  };

  // Add handlers for video play/pause events
  const handlePlay = (index: number) => {
    setPlayingStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  const handlePause = (index: number) => {
    setPlayingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  useEffect(() => {
    // Add event listeners for each video
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      const handlePlay = () => {
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
        });
      };

      const handlePause = () => {
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    });
  }, [isVerticalView]); // Re-run when view changes

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVerticalView) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isVerticalView) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2.5;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
      setHasMoved(Math.abs(walk) > 5);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Only toggle vertical view if it was a simple click (no movement)
    if (!hasMoved && !isVerticalView) {
      e.stopPropagation();
      setIsVerticalView(true);
      
      // For non-YouTube videos only
      videoRefs.current.forEach((video, index) => {
        if (video && videos[index].type !== 'youtube') {
          video.play().catch(() => {
            setPlayingStates(prev => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          });
        }
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isVerticalView) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isVerticalView) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2.5;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
      setHasMoved(Math.abs(walk) > 5);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Only toggle vertical view if it was a simple tap (no movement)
    if (!hasMoved && !isVerticalView) {
      e.stopPropagation();
      setIsVerticalView(true);
      
      // For non-YouTube videos only
      videoRefs.current.forEach((video, index) => {
        if (video && videos[index].type !== 'youtube') {
          video.play().catch(() => {
            setPlayingStates(prev => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          });
        }
      });
    }
  };

  // Add scroll position tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isVerticalView) return;
    
    const handleScroll = () => {
      const currentScrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = currentScrollLeft / scrollWidth;
      setScrollProgress(progress);
    };
    
    // Initial calculation
    handleScroll();
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isVerticalView]);
  
  // Add scroll controls
  const scrollCarouselLeft = () => {
    if (!containerRef.current || isVerticalView) return;
    containerRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };
  
  const scrollCarouselRight = () => {
    if (!containerRef.current || isVerticalView) return;
    containerRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  // Function to handle click on the progress bar
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (isVerticalView || !containerRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickProgress = clickPosition / progressBarWidth;
    
    const scrollDistance = (containerRef.current.scrollWidth - containerRef.current.clientWidth) * clickProgress;
    containerRef.current.scrollTo({
      left: scrollDistance,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      className="w-full py-6 sm:py-12"
    >
      <div className="relative">
        <div 
          ref={containerRef}
          className={`relative w-full ${isVerticalView ? '' : 'overflow-x-auto scrollbar-hide'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={(e) => {
            setIsHovered(false);
            handleMouseUp(e);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx global>{`
            /* Hide scrollbar for Chrome, Safari and Opera */
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Hide scrollbar for IE, Edge and Firefox */
            .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `}</style>
          <div 
            className={`${isVerticalView ? 'flex flex-col gap-4 sm:gap-8 px-4 sm:px-8' : 'flex gap-2 sm:gap-4 px-4 sm:px-8'}`}
          >
            {videos.map((video, index) => (
              <div 
                key={index} 
                className={`${
                  isVerticalView 
                    ? 'w-full h-auto aspect-video md:aspect-[16/9] lg:aspect-[16/9] transition-all duration-500' 
                    : 'min-w-[280px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] h-[157px] sm:h-[225px] md:h-[281px] lg:h-[337px] cursor-pointer'
                } relative bg-gray-900 rounded-md overflow-hidden border-[2px] sm:border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite]`}
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
                  <div className={`w-full ${isVerticalView ? 'h-full' : 'h-full'}`}>
                    <YouTubeEmbed
                      videoId={video.videoId as string}
                      title={`Video ${index + 1}`}
                      autoplay={isVerticalView || playingStates[index]}
                      showControls={true}
                    />
                  </div>
                ) : (
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
                    autoPlay
                    preload="auto"
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
                      }
                    }}
                  />
                )}
                {videoLoadErrors[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4">
                    <p>Sorry, this video could not be loaded.</p>
                  </div>
                )}
                {isVerticalView && (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking controls
                  >
                    {!videoLoadErrors[index] && video.type !== 'youtube' && (
                      <>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => togglePlay(index)}
                          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-white bg-black/30 text-white hover:bg-white hover:text-black transition-colors"
                        >
                          {playingStates[index] ? (
                            <Pause className="h-7 w-7 sm:h-10 sm:w-10 fill-current" />
                          ) : (
                            <Play className="h-7 w-7 sm:h-10 sm:w-10 fill-current" />
                          )}
                          <span className="sr-only">{playingStates[index] ? "Pause" : "Play"} video</span>
                        </Button>
                        <div className="flex gap-4">
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => rewindTenSeconds(index)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-black/30 text-white hover:bg-white hover:text-black transition-colors"
                          >
                            <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="sr-only">Rewind 10 seconds</span>
                          </Button>
                          <Button 
                            size="icon"
                            variant="outline"
                            onClick={() => restartVideo(index)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-black/30 text-white hover:bg-white hover:text-black transition-colors"
                          >
                            <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="sr-only">Restart video</span>
                          </Button>
                        </div>
                      </>
                    )}
                    {!videoLoadErrors[index] && video.type === 'youtube' && (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="py-2 px-3 bg-red-600 rounded-lg shadow-md flex items-center gap-2">
                          <svg 
                            className="w-5 h-5 sm:w-6 sm:h-6" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                          <span className="text-white font-semibold text-sm sm:text-base">YouTube Controls Available</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white bg-black/60 px-2 py-1 rounded">Click on video to access controls</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {/* Duplicate videos for seamless loop - only show in horizontal mode */}
            {!isVerticalView && videos.slice(0, 2).map((video, index) => (
              <div 
                key={`duplicate-${index}`} 
                className="min-w-[280px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] h-[157px] sm:h-[225px] md:h-[281px] lg:h-[337px] bg-gray-900 rounded-md overflow-hidden border-[2px] sm:border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite]"
              >
                {video.type === 'youtube' ? (
                  <div className="w-full h-full">
                    <YouTubeEmbed
                      videoId={video.videoId as string}
                      title={`Duplicate ${index + 1}`}
                      autoplay={false}
                      loop={true}
                      showControls={true}
                    />
                  </div>
                ) : (
                  <video
                    className="w-full h-full object-cover rounded-[2px] sm:rounded-[4px]"
                    src={video.src}
                    poster={video.thumbnail}
                    autoPlay
                    preload="auto"
                    playsInline
                    muted
                    loop
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      // Try fallback if available
                      if (video.fallbackSrc && target.src !== video.fallbackSrc) {
                        target.src = video.fallbackSrc;
                        target.load();
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {!isVerticalView && (
          <div className="mt-4 px-4 sm:px-8">
            <div className="flex items-center gap-2">
              {/* Left scroll button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={scrollCarouselLeft}
                className="h-10 w-10 rounded-full border border-gray-600 bg-black/50 hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Scroll left</span>
              </Button>
              
              {/* Progress bar */}
              <div 
                ref={progressBarRef}
                className="relative flex-1 h-3 bg-gray-800/70 rounded-full overflow-hidden cursor-pointer hover:bg-gray-700/90 transition-colors duration-200"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-gray-400 hover:bg-gray-300 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
                <div 
                  className="absolute top-0 left-0 h-full w-4 rounded-full bg-white/20"
                  style={{ 
                    left: `calc(${scrollProgress * 100}% - 8px)`,
                    display: scrollProgress > 0 ? 'block' : 'none' 
                  }}
                />
              </div>
              
              {/* Right scroll button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={scrollCarouselRight}
                className="h-10 w-10 rounded-full border border-gray-600 bg-black/50 hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Scroll right</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoCarousel; 