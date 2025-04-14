'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageIcon, Upload, Search, Loader2, Info, AlertTriangle } from 'lucide-react';
import { initializeFaceApi } from '@/lib/face-detection/initialize';
import { findMatches } from '@/lib/face-detection/face-matcher';
import { detectGenderAndAge } from '@/lib/face-detection/gender';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { SearchResult } from '@/lib/api/types';
import { UploadAnimation } from './upload-animation';
import { AgeVerificationDialog } from '@/components/age-verification/age-verification-dialog';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface ImageUploaderProps {
  onSearchStart?: () => void;
  onSearchComplete?: (results: SearchResult[], imageUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function ImageUploader({ onSearchStart, onSearchComplete }: ImageUploaderProps) {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMale, setIsMale] = useState(false);
  const [detectedAge, setDetectedAge] = useState<number | null>(null);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size must be less than 5MB");
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Only JPG and PNG files are supported");
    }
    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      validateFile(file);
      setOriginalFile(file);
      
      // Create image element for gender detection
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Initialize face-api if needed
      if (!isInitialized) {
        await initializeFaceApi();
        setIsInitialized(true);
      }

      // Detect gender
      const { gender, age } = await detectGenderAndAge(img);
      setIsMale(gender === 'male');
      setDetectedAge(age);

      // Show warning if detected age is under 18
      if (age !== null && age < 18) {
        toast({
          title: t('image_uploader.age_verification_required'),
          description: t('image_uploader.age_verification_description'),
          variant: "destructive",
        });
        setImage(null);
        setOriginalFile(null);
        return;
      }

      // Set image preview
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process file";
      toast({ title: t('image_uploader.error'), description: message, variant: "destructive" });
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleSearch = async () => {
    setShowAgeVerification(true);
  };

  const handleVerified = async () => {
    setShowAgeVerification(false);

    if (!image || !originalFile || (detectedAge !== null && detectedAge < 18)) {
      toast({
        title: t('image_uploader.age_verification_failed'),
        description: t('image_uploader.adult_images_only'),
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    onSearchStart?.();

    try {
      if (!isInitialized) {
        await initializeFaceApi();
        setIsInitialized(true);
      }
      
      const matches = await findMatches(originalFile);

      if (!matches || !matches.length) {
        toast({
          title: t('image_uploader.no_matches_found'),
          description: t('image_uploader.adjust_image_quality'),
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      onSearchComplete?.(matches, image);
      setImage(null);
      setOriginalFile(null);
    } catch (error) {
      toast({
        title: t('image_uploader.error'),
        description: error instanceof Error ? error.message : t('image_uploader.failed_to_process_image'),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div
        className="relative grid md:grid-cols-2 gap-8"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Left Side: Text Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              {t('image_uploader.upload_photo')}
            </h3>
            <p className="text-muted-foreground">
              {t('image_uploader.best_results')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1 rounded-full bg-muted">
                {t('image_uploader.jpg_png')}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-muted">
                {t('image_uploader.max_5mb')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <p>{t('image_uploader.not_stored')}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <p>{t('image_uploader.only_adults')}</p>
            </div>
          </div>

          <Button 
            variant="default"
            size="lg" 
            className="gap-3 px-8 py-6 text-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6" />
            {t('image_uploader.select_image')}
          </Button>
        </div>

        {/* Right Side: Upload Area */}
        <div>
          <div 
            className={`
              border-2 border-dashed rounded-xl p-8 h-full transition-colors duration-300 flex items-center justify-center
              relative
              ${dragActive 
                ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10 scale-[0.99]' 
                : 'border-muted hover:border-red-500/50'
              }
            `}
          >
            {isProcessing && <UploadAnimation />}
            <motion.div 
              className="relative w-48 h-48 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {image ? (
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t('image_uploader.drag_drop')}</p>
                </div>
              )}
              {image && (
                <motion.div 
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-red-600/50"
                    onClick={() => {
                      setImage(null);
                      setOriginalFile(null);
                    }}
                  >
                    {t('image_uploader.change_photo')}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
            id="file-upload"
          />
        </div>
      </div>

      {/* Search Button */}
      {image && (
        <div className="mt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleSearch}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('image_uploader.searching')}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {t('image_uploader.search')} {isMale && '😅'}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}
      
      <AgeVerificationDialog 
        open={showAgeVerification} 
        onOpenChange={setShowAgeVerification}
        onVerify={handleVerified}
      />
    </Card>
  );
}