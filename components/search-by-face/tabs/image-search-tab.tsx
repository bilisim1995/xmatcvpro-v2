'use client';

import { useState } from 'react';
import { ImageUploader } from '../image-search/image-uploader';
import { SearchResults } from '../image-search/search-results';
import { SearchResult } from '@/lib/api/types';

export default function ImageSearchTab() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchStart = () => {
    setIsSearching(true);
  };

  const handleSearchComplete = (results: SearchResult[], imageUrl: string) => {
    setSearchResults(results);
    setSearchImage(imageUrl);
    setIsSearching(false);
  };

  const handleSearchAgain = () => {
    setSearchResults([]);
    setSearchImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {(!isSearching && searchResults.length === 0) && (
        <ImageUploader 
          onSearchStart={handleSearchStart}
          onSearchComplete={handleSearchComplete}
        />
      )}
      
      {(isSearching || searchResults.length > 0) && (
        <SearchResults 
          results={searchResults}
          searchImage={searchImage}
          isLoading={isSearching}
          onSearchAgain={handleSearchAgain}
        />
      )}
    </div>
  );
}