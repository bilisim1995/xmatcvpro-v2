'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { User, Heart, Eye, Link as LinkIconComponent, Instagram, Video as VideoIcon, ArrowLeft, Play, X } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import NextLink from 'next/link'; 

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

const LIKED_VIDEOS_STORAGE_KEY = 'profilePageLikedVideos'; 

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

export default function ChannelProfilePage() {
  const params = useParams();
  const router = useRouter();
  const channelName = params.channelName as string;
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [profileUsername, setProfileUsername] = useState<string | undefined>(undefined);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLikedVideos = localStorage.getItem(LIKED_VIDEOS_STORAGE_KEY);
      if (storedLikedVideos) {
        try {
          setLikedVideoIds(new Set(JSON.parse(storedLikedVideos)));
        } catch (e) { console.error("Failed to parse liked videos from local storage", e); localStorage.removeItem(LIKED_VIDEOS_STORAGE_KEY);}
      }
    }
  }, []);

  useEffect(() => {
    if (channelName) {
      const fetchChannelVideos = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/videos?channel=${encodeURIComponent(channelName)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch videos for channel ${channelName}`);
          }
          const data = await response.json();
          if (data && Array.isArray(data.videos) && data.videos.length > 0) {
            const mappedVideos = data.videos.map(mapApiVideoToVideo);
            const sortedVideos = mappedVideos.sort((a: Video, b: Video) => b.createdAt.getTime() - a.createdAt.getTime());
            setVideos(sortedVideos);
            setProfileUsername(sortedVideos[0].username); 
          } else {
            setVideos([]);
            setProfileUsername(undefined);
          }
        } catch (error) {
          console.error('Error fetching channel videos:', error);
          setVideos([]);
          setProfileUsername(undefined);
        } finally {
          setIsLoading(false);
        }
      };
      fetchChannelVideos();
    }
  }, [channelName]);

  const handleLike = async (videoId: string) => { 
    if (likedVideoIds.has(videoId)) return;

    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, likes: (video.likes ?? 0) + 1 } : video
      )
    );
    if (selectedVideo && selectedVideo._id === videoId) {
        setSelectedVideo(prev => prev ? { ...prev, likes: (prev.likes ?? 0) + 1 } : null);
    }

    const newLikedIds = new Set(likedVideoIds).add(videoId);
    setLikedVideoIds(newLikedIds);
    localStorage.setItem(LIKED_VIDEOS_STORAGE_KEY, JSON.stringify(Array.from(newLikedIds)));

    try {
      await fetch(`/api/videos/${videoId}/like`, { method: 'POST' });
    } catch (error) {
      console.error('Error liking video on profile page:', error);
    }
  };

  const handleMouseEnter = (index: number) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.play().catch(error => console.log('Autoplay for preview failed', error));
    }
  };

  const handleMouseLeave = (index: number) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-24" /> 
            <div className="flex items-center justify-end flex-grow">
                <Skeleton className="h-10 w-40" /> 
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[9/16] rounded-md bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const decodedChannelName = decodeURIComponent(channelName);
  const instagramProfileUrl = `https://www.instagram.com/${decodedChannelName}`;

  return (
    <div className="container mx-auto px-4 py-16 pt-24">
      <div className="flex items-center justify-between mb-8">
        <Button onClick={() => router.back()} variant="outline" className="whitespace-nowrap flex-shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        <a 
          href={instagramProfileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex flex-col items-end min-w-0 ml-auto pl-4 hover:opacity-80 transition-opacity" 
        >
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {profileUsername || decodedChannelName} 
          </h1>
          { (profileUsername && profileUsername.toLowerCase() !== decodedChannelName.toLowerCase()) || !profileUsername ? (
             <span className="text-xs sm:text-sm text-muted-foreground truncate">(@{decodedChannelName})</span>
          ) : null}
        </a>
      </div>

      {videos.length === 0 && !isLoading && (
        <p>No videos found for channel: {decodedChannelName}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {videos.map((video, index) => (
          <Card 
            key={video._id} 
            className="overflow-hidden cursor-pointer group aspect-[9/16]" 
            onClick={() => setSelectedVideo(video)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="relative w-full h-full">
              <video
                ref={el => videoRefs.current[index] = el}
                src={video.cdnUrl}
                poster={video.thumbnail_url}
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <Play className="w-12 h-12 text-white opacity-70" />
               </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={selectedVideo !== null} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-screen-lg h-auto max-h-[calc(100vh-2rem)] p-0 border-0 bg-transparent flex items-center justify-center rounded-lg sm:bg-black/80 sm:backdrop-blur-sm">
          {selectedVideo && (
            <div className="w-full h-full aspect-[9/16] bg-black rounded-lg overflow-hidden relative flex items-center justify-center max-w-full max-h-full">
                <DialogClose asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/75 text-white rounded-full"
                    >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                    </Button>
                </DialogClose>
              <video
                id="modal-video"
                src={selectedVideo.cdnUrl}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-full max-w-full object-contain"
                onContextMenu={(e) => e.preventDefault()}
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
              />
              
              {isPaused && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none"
                  >
                    <Play className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}

               {selectedVideo._id && (
                  <div className="absolute bottom-12 right-2 sm:right-4 z-[70] flex flex-col space-y-1.5 bg-black/30 p-1.5 sm:p-2 rounded-md">
                     <Button variant="ghost" size="icon" className={`h-8 w-8 sm:h-9 sm:w-9 p-1.5 flex flex-col items-center ${likedVideoIds.has(selectedVideo._id) ? 'text-red-500' : 'text-white'}`} 
                        onClick={(e) => { e.stopPropagation(); if (!likedVideoIds.has(selectedVideo._id)) handleLike(selectedVideo._id); }}>
                        <Heart className="w-5 h-5" />
                        <span className="text-xs">{selectedVideo.likes ?? 0}</span>
                     </Button>
                     <div className="flex flex-col items-center p-1.5 text-white">
                        <Eye className="w-5 h-5" />
                        <span className="text-xs">{selectedVideo.views ?? 0}</span>
                     </div>
                    {selectedVideo.originalUrl && (
                       <NextLink href={selectedVideo.originalUrl} passHref legacyBehavior>
                         <a target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-white hover:bg-white/20">
                               <LinkIconComponent className="w-5 h-5" />
                            </Button>
                         </a>
                       </NextLink>
                    )}
                 </div>
              )}
              {selectedVideo.description && (
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-[calc(100%-6rem)] md:max-w-[60%] text-white p-2 bg-black/60 rounded-md text-xs sm:text-sm">
                  <p className="opacity-90 line-clamp-2 sm:line-clamp-3">{selectedVideo.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
