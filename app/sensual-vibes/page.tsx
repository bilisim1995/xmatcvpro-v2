'use client';

import { useEffect, useState, useRef } from 'react';
import { Video as VideoIcon, Instagram, Link as LinkIconComponent, User, Heart, Volume2, VolumeX, AlertCircle, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Input bileşenini ekledik
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  _id: string;
  userId: string; // Kodu basitleştirmek için şimdilik string olarak tutulacak, gerçek uygulamada User ID referansı olabilir.
  username: string;
  content: string;
  createdAt: Date;
}

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
  comments?: any[]; // MongoDB'den gelen ham yorum verisi
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
  comments: Comment[];
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
  
  const comments: Comment[] = (apiVideo.comments || []).map((comment: any) => ({
    _id: comment._id.$oid || comment._id,
    userId: comment.userId.$oid || comment.userId,
    username: comment.username,
    content: comment.content,
    createdAt: new Date(comment.createdAt.$date?.$numberLong ? parseInt(comment.createdAt.$date.$numberLong) : comment.createdAt),
  }));

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
    comments: comments,
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { width, height } = useWindowSize();
  const [confetti, setConfetti] = useState<{ x: number, y: number, w: number, h: number, run: boolean }>({ x: 0, y: 0, w: 0, h: 0, run: false });
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [isGloballyMuted, setIsGloballyMuted] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportingVideoUrl, setReportingVideoUrl] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Yorum modalı için state'ler
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentVideoForComments, setCurrentVideoForComments] = useState<Video | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [commenterName, setCommenterName] = useState<string>(''); // Yorumcu adı için yeni state
  const commentsListRef = useRef<HTMLDivElement>(null);


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
          setVideos(mappedVideos);
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
            if (videoId) {
              handleView(videoId);
            }
          } else {
            videoElement.pause();
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

  const handleCommentClick = async (video: Video) => {
    setCurrentVideoForComments(video);
    setNewCommentContent(''); // Yeni yorum alanını temizle
    setCommenterName(''); // Yorumcu adı alanını temizle

    try {
      const response = await fetch(`/api/videos/${video._id}/comments`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const fetchedComments: Comment[] = await response.json();

      // fetchedComments içindeki tarih stringlerini Date objelerine dönüştür
      const parsedComments = fetchedComments.map(comment => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }));

      // currentVideoForComments state'ini güncellerken yorumları da dahil et
      setCurrentVideoForComments(prev => prev ? { ...prev, comments: parsedComments } : null);
      setShowCommentModal(true); // Yorumlar çekildikten sonra modalı aç
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Yorumlar çekilemezse bile modalı açabiliriz, boş bir liste gösterir
      setCurrentVideoForComments(prev => prev ? { ...prev, comments: [] } : null);
      setShowCommentModal(true);
    }
  };

  const handlePostComment = async () => {
    if (!currentVideoForComments || newCommentContent.trim() === '') return;

    const videoId = currentVideoForComments._id;
    // Kullanıcı adı boşsa 'AnonymousUser' olarak ayarla
    const finalUsername = commenterName.trim() === '' ? 'AnonymousUser' : commenterName.trim();

    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'anon', username: finalUsername, content: newCommentContent.trim() }),
      });

      if (response.ok) {
        const newComment = await response.json();
        // Videonun yorumlarını güncelle
        setVideos(prevVideos =>
          prevVideos.map(video =>
            video._id === videoId
              ? { ...video, comments: [...video.comments, newComment] }
              : video
          )
        );
        setCurrentVideoForComments(prev => prev ? { ...prev, comments: [...prev.comments, { ...newComment, createdAt: new Date(newComment.createdAt) }] } : null);
        setNewCommentContent(''); // Yorum gönderildikten sonra inputu temizle
        setCommenterName(''); // Yorumcu adı gönderildikten sonra inputu temizle
        // Yorumlar listesini en alta kaydır
        if (commentsListRef.current) {
          commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
        }
      } else {
        console.error('Failed to post comment');
        // Hata durumunda kullanıcıya bilgi verebiliriz
        alert('Failed to post comment. Please try again.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment. Please try again.');
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
          className="w-full h-[calc(100%-60px)] overflow-y-scroll snap-y snap-mandatory" // Yükseklik güncellendi
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
                      } else {
                        videoElement.pause();
                      }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />

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
                      className="flex items-center p-2 bg-black/60 rounded-md text-white cursor-pointer"
                      onClick={() => handleCommentClick(video)}>
                      <MessageCircle className="w-5 h-5 mr-1" />
                      {video.comments?.length ?? 0}
                   </div>
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

      {/* Yorum Modalı */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-[80vh] flex flex-col p-4">
          <DialogHeader className="pb-4">
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription className="line-clamp-2">{currentVideoForComments?.description}</DialogDescription>
          </DialogHeader>
          <div ref={commentsListRef} className="flex-1 overflow-y-auto p-4 space-y-4 border-b border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850 shadow-inner">
            {currentVideoForComments?.comments
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // En yeni yorum en üstte
              .map((comment) => (
                <div key={comment._id} className="bg-gray-200 dark:bg-[#2D3748] p-3 rounded-lg shadow-sm"> {/* Burası güncellendi */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{comment.username}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{comment.createdAt.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm break-words">{comment.content}</p>
                </div>
              ))}
          </div>
          <DialogFooter className="flex flex-col p-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Input
              placeholder="Your Name (Optional)"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className="mb-3 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <Textarea
              placeholder="Write your comment here..."
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="mb-3 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 min-h-[80px]"
            />
            <Button 
              onClick={handlePostComment} 
              disabled={newCommentContent.trim() === ''} // Yorum içeriği boşsa butonu devre dışı bırak
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confetti.run && <Confetti width={width} height={height} recycle={false} numberOfPieces={150} gravity={0.5} initialVelocityX={5} initialVelocityY={15} confettiSource={{ x: confetti.x, y: confetti.y, w: 0, h: 0 }} />}
    </div>
  );
}