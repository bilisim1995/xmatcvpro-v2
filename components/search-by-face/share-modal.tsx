'use client';

import { useState } from 'react';
import { Share2, Download, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { SearchResult } from '@/lib/api/types';
import { usePreviewDownload } from '@/hooks/use-preview-download';
import { shareToTelegram, shareToWhatsApp } from '@/lib/utils/share/social';
import { toast } from '@/components/ui/use-toast';

interface ShareModalProps {
  searchImage: string;
  results: SearchResult[];
}

export function ShareModal({ searchImage, results }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { downloadPreview } = usePreviewDownload({
    elementId: 'share-preview',
    filename: 'xmatch-results.png',
    quality: 1.0,
    scale: 2
  });

  const handleDownload = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await downloadPreview();
      toast({
        title: "Success!",
        description: "Your results have been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again. If the problem persists, try a different browser.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTelegramShare = () => {
    const text = `Check out my AI-powered search results from xmatch.pro! 🔍✨\n\nFind your matches: https://xmatch.pro`;
    shareToTelegram(text);
  };

  const handleWhatsAppShare = () => {
    const text = `Check out my AI-powered search results from xmatch.pro! 🔍✨\n\nFind your matches: https://xmatch.pro`;
    shareToWhatsApp(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Share2 className="w-5 h-5 text-red-600" />
            Share Your Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card id="share-preview" className="p-6 space-y-6 bg-background">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-foreground">xmatch.pro</span>
              <span className="text-sm text-muted-foreground">AI-Powered Search Results</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Source Image */}
              <div className="col-span-1">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border">
                  <img 
                    src={searchImage}
                    alt="Search"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {results.slice(0, 3).map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border">
                      <img 
                        src={result.image}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground truncate">{result.name}</p>
                      <div className="h-1.5 bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        {result.confidence}% match
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
              <span>Powered by AI Face Recognition</span>
              <span>xmatch.pro</span>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="w-full gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDownload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Download className="w-4 h-4 animate-bounce" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleTelegramShare}
            >
              <Send className="w-4 h-4" />
              Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}