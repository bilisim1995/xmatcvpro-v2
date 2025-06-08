'use client';

import { useEffect, useState, useRef } from 'react';
import { Video as VideoIcon, Instagram, Link as LinkIconComponent, User, Heart, Volume2, VolumeX, AlertCircle, Eye } from 'lucide-react'; // Renamed Link to LinkIconComponent
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import Link from 'next/link'; // Added Next.js Link
import { usePathname } from 'next/navigation';
import Confetti from 'react-confetti'; 
import useWindowSize from 'react-use/lib/useWindowSize'; 
import { Skeleton } from "@/components/ui/skeleton"; 

interface ApiVideoObject {
  _id: { $oid: string } | string; 
  reelId?: string;
  originalUrl?: string;
  username?: string;
  channel?: string;
  description?: string;
  cdnUrl: string; 
  filename?: string;
  likes?: { $numberInt: string } | number;
  views?: { $numberInt: string } | number;
  createdAt?: { $date: { $numberLong: string } } | string | Date;
  updatedAt?: { $date: { $numberLong: string } } | string | Date;
  thumbnail_url?: string; // Added for potential use in profile page
}

interface Video {
  _id: string;
  reelId?: string;
  originalUrl?: string;
  username?: string;
  channel?: string;
  description?: string;
  cdnUrl: string;
  filename?: string;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  thumbnail_url?: string;
}

const LIKED_VIDEOS_STORAGE_KEY = 'sensualVibesLikedVideos'; // Specific key

function mapApiVideoToVideo(apiVideo: ApiVideoObject): Video {
  const likes = typeof apiVideo.likes === 'object' && apiVideo.likes !== null && '$numberInt' in apiVideo.likes 
                ? parseInt(apiVideo.likes.$numberInt)
                : typeof apiVideo.likes === 'number' ? apiVideo.likes : 0;
  const views = typeof apiVideo.views === 'object' && apiVideo.views !== null && '$numberInt' in apiVideo.views
                ? parseInt(apiVideo.views.$numberInt)
                : typeof apiVideo.views === 'number' ? apiVideo.views : 0;
  const createdAt = typeof apiVideo.createdAt === 'object' && apiVideo.createdAt !== null && '$date' in apiVideo.createdAt && '$numberLong' in apiVideo.createdAt.$date
                ? new Date(parseInt(apiVideo.createdAt.$date.$numberLong))
                : typeof apiVideo.createdAt === 'string' ? new Date(apiVideo.createdAt) : new Date(); 
  const updatedAt = typeof apiVideo.updatedAt === 'object' && apiVideo.updatedAt !== null && '$date' in apiVideo.updatedAt && '$numberLong' in apiVideo.updatedAt.$date
                ? new Date(parseInt(apiVideo.updatedAt.$date.$numberLong))
                : typeof apiVideo.updatedAt === 'string' ? new Date(apiVideo.updatedAt) : new Date();
  const id = typeof apiVideo._id === 'object' && apiVideo._id !== null && '$oid' in apiVideo._id 
             ? apiVideo._id.$oid 
             : typeof apiVideo._id === 'string' ? apiVideo._id : 'unknown-'+Date.now(); // More unique fallback ID

  return {
    _id: id,
    reelId: apiVideo.reelId,
    originalUrl: apiVideo.originalUrl,
    username: apiVideo.username,
    channel: apiVideo.channel,
    description: apiVideo.description,
    cdnUrl: apiVideo.cdnUrl,
    filename: apiVideo.filename,
    likes: likes,
    views: views,
    createdAt: createdAt,
    updatedAt: updatedAt,
    thumbnail_url: apiVideo.thumbnail_url,
  };
}

export default function SensualVibesPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null); 
  const { width, height } = useWindowSize(); 
  const [confetti, setConfetti] = useState<{ x: number, y: number, w: number, h: number, run: boolean }>({ x: 0, y: 0, w: 0, h: 0, run: false }); 
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set()); 
  const [isGloballyMuted, setIsGloballyMuted] = useState(true); 
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportingVideoUrl, setReportingVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log('Fetching videos...');
      try {
        const response = await fetch('/api/videos');
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
          console.error('Failed to fetch videos. Status:', response.status, await response.text());
          setVideos([]); 
          return;
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data && Array.isArray(data.videos)) {
          console.log('Videos received from API:', data.videos.length);
          const mappedVideos = data.videos.map(mapApiVideoToVideo);
          const sortedVideos = mappedVideos.sort((a: Video, b: Video) => {
            return b.createdAt.getTime() - a.createdAt.getTime(); 
          });
          setVideos(sortedVideos);
        } else {
          console.error('Error fetching videos: data.videos is not an array or data is undefined', data);
          setVideos([]); 
        }
      } catch (error) {
        console.error('Error fetching videos (catch block):', error);
        setVideos([]); 
      }
    };

    fetchVideos();
  }, []); 

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

  const toggleGlobalMute = () => {
    setIsGloballyMuted(prev => !prev);
  };
  
  const handleReportClick = (video: Video) => { 
    const urlToReport = video.originalUrl || video.cdnUrl; 
    if (urlToReport) {
      setReportingVideoUrl(urlToReport);
      setShowReportDialog(true);
    }
  };

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

  const VideoLoadingSkeleton = () => (
    <div className="w-full h-full flex flex-col items-center justify-center snap-start bg-black relative">
      <Skeleton className="w-[80%] h-[60%] bg-gray-700" /> 
      <div className="absolute top-4 left-0 right-0 px-4 z-50 flex items-center justify-between">
        <div className="flex items-center p-2 bg-black/60 rounded-md">
            <Skeleton className="w-8 h-8 rounded-full bg-gray-500 mr-2" />
            <div className="flex flex-col">
                <Skeleton className="h-4 w-20 mb-1 bg-gray-500" />
                <Skeleton className="h-3 w-16 bg-gray-500" />
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <Skeleton className="w-10 h-10 bg-gray-600 rounded-md" /> 
            <Skeleton className="w-10 h-10 bg-gray-600 rounded-md" /> 
        </div>
      </div>
      <div className="absolute bottom-32 right-4 z-[60] flex flex-col space-y-2">
        <Skeleton className="w-16 h-10 bg-gray-600" /> 
        <Skeleton className="w-16 h-10 bg-gray-600 mt-1" /> 
        <Skeleton className="w-10 h-10 bg-gray-600 rounded-md mt-1" /> 
      </div>
      <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-5 sm:right-auto max-w-[calc(100%-2rem)] sm:max-w-[80%]">
        <Skeleton className="h-3 w-full bg-gray-600" /> 
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen relative bg-black pt-16">
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.length === 0 && (
            <VideoLoadingSkeleton /> 
          )}
          {videos.map((video, index) => (
            <div
              key={video._id}
              className="w-full h-full flex flex-col items-center justify-center snap-start bg-black relative"
            >
              <video
                ref={el => videoRefs.current[index] = el}
                src={video.cdnUrl} 
                loop
                controlsList="nodownload noremoteplayback nofullscreen"
                playsInline
                muted={isGloballyMuted} 
                className="max-h-full max-w-full w-full h-full object-cover"
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

              {/* Top bar: User/Channel on left, Report and Mute/Unmute on right */}
              {video._id && ( 
                <div className="absolute top-4 left-0 right-0 px-4 z-50 text-base text-white flex items-center justify-between">
                  {/* Left side: User/Channel Info - Wrapped with Link */}
                  {(video.username || video.channel) && video.channel ? (
                    <Link href={`/profile/${encodeURIComponent(video.channel)}`} className="hover:opacity-80 transition-opacity">
                      <div className="flex items-center p-2 bg-black/60 rounded-md"> 
                         <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-2">
                            <User className="w-5 h-5" />
                         </div>
                         <div className="flex flex-col">
                            {video.username && <span className="font-semibold">{video.username}</span>}
                            {video.channel && <span className="text-xs text-gray-300">@{video.channel}</span>}
                         </div>
                      </div>
                    </Link>
                   ) : (
                    (video.username || video.channel) && (
                        <div className="flex items-center p-2 bg-black/60 rounded-md"> 
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-2">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                {video.username && <span className="font-semibold">{video.username}</span>}
                                {video.channel && <span className="text-xs text-gray-300">@{video.channel}</span>}
                            </div>
                        </div>
                    )
                   )}

                  {/* Right side: Report and Mute buttons */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleReportClick(video)} className="text-white hover:bg-white/20 hover:text-white p-2 bg-black/60 rounded-md">
                      <AlertCircle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleGlobalMute} className="text-white hover:bg-white/20 hover:text-white p-2 bg-black/60 rounded-md">
                      {isGloballyMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
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
                      <div className="flex items-center p-2 bg-black/60 rounded-md text-white">
                        <Eye className="w-5 h-5 mr-1" />
                        {video.views ?? 0}
                     </div>
                     {video.originalUrl && (
                        <a href={video.originalUrl} target="_blank" rel="noopener noreferrer">
                           <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                              <LinkIconComponent className="w-6 h-6" />
                           </Button>
                        </a>
                     )}
                  </div>
               )}

              {/* Bottom left: Description only */}
              {video.description && (
                <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-5 sm:right-auto text-white p-2 bg-black/60 rounded-md max-w-[calc(100%-2rem)] sm:max-w-[80%] text-xs sm:text-sm">
                  <p className="opacity-90">{video.description}</p>
                </div>
              )}
            </div>
          ))}
          {videos.length > 1 && (
            <div ref={bottomSentinelRef} style={{ height: '1px', width: '100%' }} aria-hidden="true"></div>
          )}
        </div>

      <Dialog open={selectedVideo !== null} onOpenChange={closeVideoModal}>
        <DialogContent className="sm:max-w-[800px] p-0 border-0 bg-transparent">
          {selectedVideo && (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
              <video
                id="modal-video"
                src={selectedVideo.cdnUrl} 
                controls 
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Top left: User/Channel in modal */}
              {(selectedVideo.username || selectedVideo.channel) && selectedVideo.channel ? (
                 <Link href={`/profile/${encodeURIComponent(selectedVideo.channel)}`} className="hover:opacity-80 transition-opacity">
                    <div className="absolute top-4 left-4 z-[70] text-base text-white flex items-center p-2 bg-black/60 rounded-md">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-2">
                        <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            {selectedVideo.username && <span className="font-semibold">{selectedVideo.username}</span>}
                            {selectedVideo.channel && <span className="text-xs text-gray-300">@{selectedVideo.channel}</span>}
                        </div>
                    </div>
                 </Link>
              ) : (
                (selectedVideo.username || selectedVideo.channel) && (
                    <div className="absolute top-4 left-4 z-[70] text-base text-white flex items-center p-2 bg-black/60 rounded-md">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white mr-2">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            {selectedVideo.username && <span className="font-semibold">{selectedVideo.username}</span>}
                            {selectedVideo.channel && <span className="text-xs text-gray-300">@{selectedVideo.channel}</span>}
                        </div>
                    </div>
                )
              )}
              {/* Bottom right: Likes, Views and Link to originalUrl in modal*/}
              {selectedVideo._id && (
                 <div className="absolute bottom-12 right-4 z-[70] flex flex-col space-y-2 bg-black/30 p-2 rounded-md">
                     <div 
                        className={`flex items-center p-2 bg-black/60 rounded-md cursor-pointer ${likedVideoIds.has(selectedVideo._id) ? 'text-red-500 cursor-not-allowed opacity-50' : 'text-white'}`} 
                        onClick={(e) => likedVideoIds.has(selectedVideo._id) ? null : handleLike(selectedVideo._id, e)}>
                        <Heart className="w-5 h-5 mr-1" />
                        {selectedVideo.likes ?? 0}
                     </div>
                     <div className="flex items-center p-2 bg-black/60 rounded-md text-white">
                        <Eye className="w-5 h-5 mr-1" />
                        {selectedVideo.views ?? 0}
                     </div>
                    {selectedVideo.originalUrl && (
                       <a href={selectedVideo.originalUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                             <LinkIconComponent className="w-6 h-6" />
                          </Button>
                       </a>
                    )}
                 </div>
              )}

              {/* Bottom left: Description only in modal */}
              {selectedVideo.description && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                   <p className="text-sm mt-1">{selectedVideo.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Confirmation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact About Video</DialogTitle>
            <DialogDescription>
              Do you want to contact us about this video?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end pt-4 space-x-2"> 
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                No
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (reportingVideoUrl) {
                  const message = `Video Link: ${reportingVideoUrl}`;
                  window.open(`https://t.me/xmatchpro?text=${encodeURIComponent(message)}`, '_blank');
                }
                setShowReportDialog(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confetti effect */} 
      {confetti.run && <Confetti width={width} height={height} recycle={false} tweenDuration={1000} numberOfPieces={150} gravity={0.5} initialVelocityX={5} initialVelocityY={15} confettiSource={{ x: confetti.x, y: confetti.y, w: 0, h: 0 }} />} 
    </div>
  );
}
