'use client';

import { useState, useCallback } from 'react';
import { validateImageFile, processImageFile } from '@/lib/utils/file-handler';
import { findMatches } from '@/lib/face-detection/face-matcher';
import { initializeFaceApi } from '@/lib/face-detection/initialize';

interface UseImageUploadOptions {
  onError: (error: string) => void;
  onSearchStart: () => void;
  onSearchComplete: (results: any[], imageUrl: string) => void;
}

export function useImageUpload({ onError, onSearchStart, onSearchComplete }: UseImageUploadOptions) {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      onError('');
      
      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        onError(validation.error || 'Invalid file');
        return;
      }

      // Process file and create preview
      const imageUrl = await processImageFile(file);
      
      // Store file for later use
      setOriginalFile(file);
      setImage(imageUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      onError(message);
    }
  }, [onError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleSearch = useCallback(async () => {
    if (!image) return;
    if (!originalFile) {
      onError('No image file available');
      return;
    }
    
    let retryCount = 0;
    const maxRetries = 2;
    
    setIsUploading(true);
    onError('');
    
    try {
      while (retryCount < maxRetries) {
        try {
          const results = await findMatches(originalFile);
          if (results.length === 0) {
            throw new Error('No matching models found. Please try another photo.');
          }
          onSearchComplete(results, image);
          return;
        } catch (error) {
          if (error instanceof Error && error.message.includes('initialization failed')) {
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
          throw error;
        }
      }
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during search';
      onError(message);
    } finally {
      setIsUploading(false);
    }
  }, [image, originalFile, onSearchStart, onSearchComplete, onError]);

  return {
    image,
    isUploading,
    dragActive,
    handleDrag,
    handleDrop,
    originalFile,
    handleFileSelect,
    handleSearch
  };
}