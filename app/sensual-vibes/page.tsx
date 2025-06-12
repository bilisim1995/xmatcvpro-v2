'use client';

import { useEffect, useState, useRef } from 'react';
import { Video as VideoIcon, Instagram, Link as LinkIconComponent, User, Heart, Volume2, VolumeX, AlertCircle, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import Link from 'next/link';
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
  thumbnail_url?: string;
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

const LIKED_VIDEOS_STORAGE_KEY = 'sensualVibesLikedVideos';
const VIEWED_VIDEOS_STORAGE_KEY = 'sensualVibesViewedVideos';

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
             : typeof apiVideo._id === 'string' ? apiVideo._id : 'unknown-'+Date.now();

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
  const [hasMounted, setHasMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        if (data && Array.isArray(data.videos)) {
          const mappedVideos = data.videos.map(mapApiVideoToVideo);
          const shuffledVideos = mappedVideos.sort(() => Math.random() - 0.5);
          setVideos(shuffledVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      }
    };
    fetchVideos();
  }, [hasMounted]);

  const handleView = async (videoId: string) => {
    const viewedVideos = JSON.parse(localStorage.getItem(VIEWED_VIDEOS_STORAGE_KEY) || '[]');
    if (viewedVideos.includes(videoId)) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/${videoId}/view`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setVideos(prevVideos =>
          prevVideos.map(video =>
            video._id === videoId ? { ...video, views: data.views } : video
          )
        );
        const newViewedVideos = [...viewedVideos, videoId];
        localStorage.setItem(VIEWED_VIDEOS_STORAGE_KEY, JSON.stringify(newViewedVideos));
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  useEffect(() => {
    if (!hasMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          const videoId = videoElement.getAttribute('data-video-id');

          if (entry.isIntersecting) {
            videoElement.play().catch(error => console.log('Autoplay prevented:', error));
            setIsPaused(false)
            if (videoId) {
              handleView(videoId);
            }
          } else {
            videoElement.pause();
            setIsPaused(true)
            videoElement.currentTime = 0;
          }
        });
      },
      { threshold: 0.8 }
    );

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos, hasMounted]);


  useEffect(() => {
    if (!hasMounted) return;
    const storedLikedVideos = localStorage.getItem(LIKED_VIDEOS_STORAGE_KEY);
    if (storedLikedVideos) {
      try {
        const parsedIds = JSON.parse(storedLikedVideos);
        setLikedVideoIds(new Set(parsedIds));
      } catch (error) {
        localStorage.removeItem(LIKED_VIDEOS_STORAGE_KEY);
      }
    }
  }, [hasMounted]);


  const toggleGlobalMute = () => setIsGloballyMuted(prev => !prev);
  const handleReportClick = (video: Video) => {
    const urlToReport = video.originalUrl || video.cdnUrl;
    if (urlToReport) {
      setReportingVideoUrl(urlToReport);
      setShowReportDialog(true);
    }
  };

  const handleLike = async (videoId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (likedVideoIds.has(videoId)) return;

    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, likes: (video.likes ?? 0) + 1 } : video
      )
    );

    const rect = event.currentTarget.getBoundingClientRect();
    setConfetti({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: 0, h: 0, run: true });
    setTimeout(() => setConfetti(prev => ({ ...prev, run: false })), 1000);

    const newLikedVideoIds = new Set(likedVideoIds).add(videoId);
    setLikedVideoIds(newLikedVideoIds);
    localStorage.setItem(LIKED_VIDEOS_STORAGE_KEY, JSON.stringify(Array.from(newLikedVideoIds)));

    try {
      await fetch(`/api/videos/${videoId}/like`, { method: 'POST' });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  if (!hasMounted) {
    return (
      <div className="w-full h-screen relative bg-black pt-16">
          <VideoLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-black pt-16">
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.length === 0 ? (
            <VideoLoadingSkeleton />
          ) : (
            videos.map((video, index) => (
              <div
                key={video._id}
                className="w-full h-full flex flex-col items-center justify-center snap-start bg-black relative"
              >
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={video.cdnUrl}
                  data-video-id={video._id}
                  loop
                  controlsList="nodownload noremoteplayback nofullscreen"
                  playsInline
                  muted={isGloballyMuted}
                  className="max-h-full max-w-full w-full h-full object-cover"
                   onClick={(e) => {
                      const videoElement = e.currentTarget;
                      if (videoElement.paused) {
                        videoElement.play();
                        setIsPaused(false);
                      } else {
                        videoElement.pause();
                        setIsPaused(true);
                      }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />

                {isPaused && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none"
                  >
                    <Play className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}

                <div className="absolute top-6 left-0 right-0 px-4 z-50 text-base text-white flex items-center justify-between">
                  {(video.username || video.channel) && video.channel ? (
                    <Link href={`/profile/${encodeURIComponent(video.channel)}`} className="hover:opacity-80 transition-opacity">
                      <div className="flex items-center p-2 bg-black/60 rounded-md">
                         <User className="w-5 h-5 mr-2" />
                         <div className="flex flex-col">
                            {video.username && <span className="font-semibold">{video.username}</span>}
                            {video.channel && <span className="text-xs text-gray-300">@{video.channel}</span>}
                         </div>
                      </div>
                    </Link>
                   ) : (
                      <div className="flex items-center p-2 bg-black/60 rounded-md">
                          <User className="w-5 h-5 mr-2" />
                          <div className="flex flex-col">
                              {video.username && <span className="font-semibold">{video.username}</span>}
                              {video.channel && <span className="text-xs text-gray-300">@{video.channel}</span>}
                          </div>
                      </div>
                   )}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleReportClick(video)} className="text-white hover:bg-white/20 p-2 bg-black/60 rounded-md">
                      <AlertCircle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleGlobalMute} className="text-white hover:bg-white/20 p-2 bg-black/60 rounded-md">
                      {isGloballyMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="absolute bottom-32 right-4 z-[60] flex flex-col space-y-2 bg-black/30 p-2 rounded-md">
                   <div
                      className={`flex items-center p-2 bg-black/60 rounded-md cursor-pointer ${likedVideoIds.has(video._id) ? 'text-red-500 cursor-not-allowed' : 'text-white'}`}
                      onClick={(e) => !likedVideoIds.has(video._id) && handleLike(video._id, e)}>
                      <Heart className="w-5 h-5 mr-1" />
                      {video.likes ?? 0}
                   </div>
                    <div className="flex items-center p-2 bg-black/60 rounded-md text-white">
                      <Eye className="w-5 h-5 mr-1" />
                      {video.views ?? 0}
                   </div>
                   {video.originalUrl && (
                      <a href={video.originalUrl} target="_blank" rel="noopener noreferrer">
                         <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <LinkIconComponent className="w-6 h-6" />
                         </Button>
                      </a>
                   )}
                </div>

                {video.description && (
                  <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-5 sm:right-auto text-white p-2 bg-black/60 rounded-md max-w-[calc(100%-2rem)] sm:max-w-[80%] text-xs sm:text-sm">
                    <p>{video.description}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact About Video</DialogTitle>
            <DialogDescription>
              Do you want to contact us about this video?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end pt-4 space-x-2">
            <DialogClose asChild><Button type="button" variant="outline">No</Button></DialogClose>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (reportingVideoUrl) {
                  window.open(`https://t.me/xmatchpro?text=${encodeURIComponent(`Video Link: ${reportingVideoUrl}`)}`, '_blank');
                }
                setShowReportDialog(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confetti.run && <Confetti width={width} height={height} recycle={false} numberOfPieces={150} gravity={0.5} initialVelocityX={5} initialVelocityY={15} confettiSource={{ x: confetti.x, y: confetti.y, w: 0, h: 0 }} />}
    </div>
  );
}
