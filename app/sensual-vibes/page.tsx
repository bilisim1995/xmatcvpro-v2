'use client';

import { useEffect, useState, useRef } from 'react';
import { Video as VideoIcon, Instagram, Link as LinkIcon, User, Heart } from 'lucide-react'; // Removed Grid icon
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usePathname } from 'next/navigation';
import Confetti from 'react-confetti'; // Import Confetti
import useWindowSize from 'react-use/lib/useWindowSize'; // Import useWindowSize

interface Video {
  _id: string;
  title?: string;
  url?: string;
  cdn_url: string;
  thumbnail_url?: string;
  category?: string;
  description?: string;
  created_at?: string; // Assuming this is a date string like ISO 8601
  updated_at?: string;
  instagram_url?: string;
  likes?: number; // Added likes field to the interface
}

// Key for localStorage
const LIKED_VIDEOS_STORAGE_KEY = 'likedVideos';

export default function SensualVibesPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null); // Sentinel for infinite scroll
  const { width, height } = useWindowSize(); // Get window size for confetti
  const [confetti, setConfetti] = useState<{ x: number, y: number, w: number, h: number, run: boolean }>({ x: 0, y: 0, w: 0, h: 0, run: false }); // State for confetti effect
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set()); // State to track liked video IDs

  // Effect to fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      console.log('Fetching videos...');
      try {
        const response = await fetch('/api/videos');
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
          console.error('Failed to fetch videos. Status:', response.status, await response.text());
          setVideos([]); // Clear videos if fetch fails
          return;
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data && Array.isArray(data.videos)) {
          console.log('Videos received from API:', data.videos.length);
          // Sort videos by created_at in descending order (newest first)
          const sortedVideos = data.videos.sort((a: Video, b: Video) => {
            // Ensure created_at exists before trying to parse
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA; // For descending order
          });
          setVideos(sortedVideos.map((video: Video) => ({ ...video, likes: video.likes ?? 0 })));
        } else {
          console.error('Error fetching videos: data.videos is not an array or data is undefined', data);
          setVideos([]); // Clear videos if data is not in expected format
        }
      } catch (error) {
        console.error('Error fetching videos (catch block):', error);
        setVideos([]); // Clear videos on error
      }
    };

    fetchVideos();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle autoplay/pause based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            videoElement.play().catch(error => console.log('Autoplay prevented or failed:', error));
          } else {
            videoElement.pause();
            videoElement.currentTime = 0;
          }
        });
      },
      { threshold: 0.8 }
    );

    if (videos.length > 0) {
        videoRefs.current = videoRefs.current.slice(0, videos.length);
        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });
    }

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  // Effect for infinite scroll loop
  useEffect(() => {
    if (videos.length <= 1 || !containerRef.current || !bottomSentinelRef.current) {
      return;
    }

    const scrollContainer = containerRef.current;
    const sentinel = bottomSentinelRef.current;

    const sentinelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target === sentinel) {
            console.log("Reached bottom, scrolling to top");
            sentinelObserver.unobserve(sentinel);
            scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
            requestAnimationFrame(() => {
                if (bottomSentinelRef.current) {
                    sentinelObserver.observe(bottomSentinelRef.current);
                }
            });
          }
        });
      },
      { root: scrollContainer, threshold: 1.0 }
    );

    sentinelObserver.observe(sentinel);

    return () => {
      sentinelObserver.disconnect();
    };
  }, [videos]);

    // Effect to load liked video IDs from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLikedVideos = localStorage.getItem(LIKED_VIDEOS_STORAGE_KEY);
      if (storedLikedVideos) {
        try {
          const parsedIds = JSON.parse(storedLikedVideos);
          if (Array.isArray(parsedIds) && parsedIds.every(id => typeof id === 'string')) {
            setLikedVideoIds(new Set(parsedIds));
          } else {
             console.error('Invalid data in localStorage for liked videos');
             localStorage.removeItem(LIKED_VIDEOS_STORAGE_KEY);
          }
        } catch (error) {
          console.error('Error parsing liked videos from localStorage:', error);
           localStorage.removeItem(LIKED_VIDEOS_STORAGE_KEY);
        }
      }
    }
  }, []);


  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    const modalVideo = document.querySelector('#modal-video') as HTMLVideoElement | null;
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
    setSelectedVideo(null);
  };

  // Function to handle liking a video
  const handleLike = async (videoId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (likedVideoIds.has(videoId)) {
        console.log(`Video ${videoId} already liked.`);
        return;
    }

    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, likes: (video.likes ?? 0) + 1 } : video
      )
    );
    if (selectedVideo && selectedVideo._id === videoId) {
        setSelectedVideo(prevSelectedVideo => prevSelectedVideo ? { ...prevSelectedVideo, likes: (prevSelectedVideo.likes ?? 0) + 1 } : null);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setConfetti({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: 0, h: 0, run: true });
    setTimeout(() => {
      setConfetti(prevConfetti => ({ ...prevConfetti, w: 0, h: 0, run: false }));
    }, 1000);

    const newLikedVideoIds = new Set(likedVideoIds).add(videoId);
    setLikedVideoIds(newLikedVideoIds);
    localStorage.setItem(LIKED_VIDEOS_STORAGE_KEY, JSON.stringify(Array.from(newLikedVideoIds)));

    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to like video');
      }

    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  return (
    <div className="w-full h-screen relative bg-black pt-16">
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-white">
              Videolar yükleniyor veya bulunamadı...
            </div>
          )}
          {videos.map((video, index) => (
            <div
              key={video._id}
              className="w-full h-full flex flex-col items-center justify-center snap-start bg-black relative"
            >
              <video
                ref={el => videoRefs.current[index] = el}
                src={video.cdn_url || video.url}
                loop
                controlsList="nodownload noremoteplayback nofullscreen"
                playsInline
                muted
                className="max-h-full max-w-full object-contain"
                 onClick={(e) => {
                    const videoElement = e.currentTarget;
                    if (videoElement.paused) {
                        videoElement.play().catch(error => console.log('Play prevented or failed:', error));
                    } else {
                        videoElement.pause();
                    }
                }}
                onContextMenu={(e) => e.preventDefault()}
              />

              {video._id && video.category && (
                <div className="absolute top-4 left-4 z-50 text-base text-white flex items-center space-x-2">
                   <div className="flex items-center p-2 bg-black/60 rounded-md">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-1">
                         <User className="w-5 h-5" />
                      </div>
                      {video.category}
                   </div>
              </div>
             )}

               {video._id && (
                  <div className="absolute bottom-32 right-4 z-[60] flex flex-col space-y-2 bg-black/30 p-2 rounded-md">
                     <div 
                        className={`flex items-center p-2 bg-black/60 rounded-md cursor-pointer ${likedVideoIds.has(video._id) ? 'text-red-500 cursor-not-allowed opacity-50' : 'text-white'}`} 
                        onClick={(e) => likedVideoIds.has(video._id) ? null : handleLike(video._id, e)}>
                        <Heart className="w-5 h-5 mr-1" />
                        {video.likes ?? 0}
                     </div>
                     {(video.cdn_url || video.url) && (
                        <a href={video.cdn_url || video.url} target="_blank" rel="noopener noreferrer">
                           <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                              <LinkIcon className="w-6 h-6" />
                           </Button>
                        </a>
                     )}
                  </div>
               )}

              {(video.title || video.description || video.instagram_url) && (
                <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-5 sm:right-auto text-white p-2 bg-black/60 rounded-md max-w-[calc(100%-2rem)] sm:max-w-[80%] text-xs sm:text-sm">
                   {video.title && <p className="font-semibold mb-0.5">{video.title}</p>}
                  {video.description && <p className="opacity-90">{video.description}</p>}
                  {video.instagram_url && (
                    <a href={video.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-gray-300 hover:text-white transition-colors">
                      <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          {videos.length > 1 && (
            <div ref={bottomSentinelRef} style={{ height: '1px', width: '100%' }} aria-hidden="true"></div>
          )}
        </div>
      )

      <Dialog open={selectedVideo !== null} onOpenChange={closeVideoModal}>
        <DialogContent className="sm:max-w-[800px] p-0 border-0 bg-transparent">
          {selectedVideo && (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
              <video
                id="modal-video"
                src={selectedVideo.cdn_url || selectedVideo.url}
                controls
                autoPlay
                controlsList="nodownload noremoteplayback"
                loop
                playsInline
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()}
              />
              {selectedVideo.category && (
                <div className="absolute top-4 left-4 z-[60] text-base text-white flex items-center p-2 bg-black/60 rounded-md">
                   <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-1">
                       <User className="w-5 h-5" />
                    </div>
                    {selectedVideo.category}
                </div>
              )}
              {selectedVideo._id && (
                 <div className="absolute bottom-12 right-4 z-[60] flex flex-col space-y-2 bg-black/30 p-2 rounded-md">
                     <div 
                        className={`flex items-center p-2 bg-black/60 rounded-md cursor-pointer ${likedVideoIds.has(selectedVideo._id) ? 'text-red-500 cursor-not-allowed opacity-50' : 'text-white'}`} 
                        onClick={(e) => likedVideoIds.has(selectedVideo._id) ? null : handleLike(selectedVideo._id, e)}>
                        <Heart className="w-5 h-5 mr-1" />
                        {selectedVideo.likes ?? 0}
                     </div>
                    {(selectedVideo.cdn_url || selectedVideo.url) && (
                       <a href={selectedVideo.cdn_url || selectedVideo.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                             <LinkIcon className="w-6 h-6" />
                          </Button>
                       </a>
                    )}
                 </div>
              )}

              {(selectedVideo.title || selectedVideo.description || selectedVideo.instagram_url) && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                   {selectedVideo.title && <p className="text-base font-semibold">{selectedVideo.title}</p>}
                   {selectedVideo.description && <p className="text-sm mt-1">{selectedVideo.description}</p>}
                   {selectedVideo.instagram_url && (
                    <a href={selectedVideo.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm mt-2 text-gray-300 hover:text-white">
                      <Instagram className="w-4 h-4 mr-1" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confetti effect */} 
      {confetti.run && <Confetti width={width} height={height} recycle={false} tweenDuration={1000} numberOfPieces={150} gravity={0.5} initialVelocityX={5} initialVelocityY={15} confettiSource={{ x: confetti.x, y: confetti.y, w: 0, h: 0 }} />} {/* Added w and h to confettiSource */}
    </div>
  );
}
